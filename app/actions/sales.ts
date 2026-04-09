// app/actions/sales.ts
'use server'

import { db } from "@/lib/db";
import { sales, saleItems, products, customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSale(data: {
  customerId?: string;
  items: { productId: string; qty: number }[];
}) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    return await db.transaction(async (tx) => {
      let totalAmount = 0;
      let totalProfit = 0;

      // 1. Calculate totals and verify stock
      const itemsWithPrices = await Promise.all(
        data.items.map(async (item) => {
          const product = await tx.query.products.findFirst({
            where: eq(products.id, item.productId),
          });

          if (!product || product.stockQty < item.qty) {
            throw new Error(`Insufficient stock for ${product?.name || 'unknown product'}`);
          }

          const subtotal = Number(product.sellPrice) * item.qty;
          const cost = Number(product.costPrice) * item.qty;
          const profit = subtotal - cost;

          totalAmount += subtotal;
          totalProfit += profit;

          return { ...item, unitPrice: product.sellPrice, subtotal, profit };
        })
      );

      // 2. Create the Sale record
      const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
      const [newSale] = await tx.insert(sales).values({
        businessId: session.user.businessId,
        customerId: data.customerId || null,
        invoiceNo,
        totalAmount: totalAmount.toString(),
        profit: totalProfit.toString(),
        status: 'completed',
      }).returning();

      // 3. Create Sale Items and update Product Stock
      for (const item of itemsWithPrices) {
        await tx.insert(saleItems).values({
          saleId: newSale.id,
          productId: item.productId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal.toString(),
        });

        // Decrement stock
        await tx.update(products)
          .set({ stockQty: sql`${products.stockQty} - ${item.qty}` })
          .where(eq(products.id, item.productId));
      }

      // 4. Update Customer Stats if customer is selected
      if (data.customerId) {
        await tx.update(customers)
          .set({
            totalSpent: sql`${customers.totalSpent} + ${totalAmount}`,
            orderCount: sql`${customers.orderCount} + 1`,
          })
          .where(eq(customers.id, data.customerId));
      }

      revalidatePath('/sales');
      revalidatePath('/inventory');
      revalidatePath('/'); // Refresh dashboard KPIs
      return { success: true, saleId: newSale.id };
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to process sale" };
  }
}