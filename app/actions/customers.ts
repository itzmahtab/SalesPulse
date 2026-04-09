// app/actions/customers.ts
'use server'

import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCustomer(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  try {
    await db.insert(customers).values({
      name,
      email: email || null,
      phone: phone || null,
      businessId: session.user.businessId,
    });

    revalidatePath('/customers');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create customer" };
  }
}

export async function updateCustomer(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  try {
    await db.update(customers)
      .set({
        name,
        email: email || null,
        phone: phone || null,
      })
      .where(eq(customers.id, id));

    revalidatePath('/customers');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update customer" };
  }
}

export async function deleteCustomer(customerId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await db.delete(customers).where(eq(customers.id, customerId));

    revalidatePath('/customers');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete customer" };
  }
}
