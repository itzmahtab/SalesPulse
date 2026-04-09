// app/actions/products.ts
'use server'

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
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
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create product" };
  }
}