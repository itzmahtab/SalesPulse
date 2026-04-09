// app/actions/products.ts
'use server'

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const category = formData.get('category') as string;
  const costPrice = formData.get('costPrice') as string;
  const sellPrice = formData.get('sellPrice') as string;
  const stockQty = parseInt(formData.get('stockQty') as string);

  try {
    await db.insert(products).values({
      name,
      sku,
      category,
      costPrice,
      sellPrice,
      stockQty,
      businessId: session.user.businessId,
    });

    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const category = formData.get('category') as string;
  const costPrice = formData.get('costPrice') as string;
  const sellPrice = formData.get('sellPrice') as string;
  const stockQty = parseInt(formData.get('stockQty') as string);
  const lowStockThreshold = parseInt(formData.get('lowStockThreshold') as string);

  try {
    await db.update(products)
      .set({
        name,
        sku,
        category,
        costPrice,
        sellPrice,
        stockQty,
        lowStockThreshold,
      })
      .where(eq(products.id, id));

    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await db.delete(products).where(eq(products.id, productId));

    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete product" };
  }
}
