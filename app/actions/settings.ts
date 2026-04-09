// app/actions/settings.ts
'use server'

import { db } from "@/lib/db";
import { businesses, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBusiness(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  try {
    await db.update(businesses)
      .set({ name, slug })
      .where(eq(businesses.id, session.user.businessId));

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update business" };
  }
}

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  try {
    await db.update(users)
      .set({ name, email })
      .where(eq(users.id, session.user.id));

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update profile" };
  }
}

export async function getSettingsData() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.id, session.user.businessId),
  });

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  return { business, user };
}
