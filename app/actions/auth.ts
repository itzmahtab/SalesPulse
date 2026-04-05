// app/actions/auth.ts
'use server'

import { db } from "@/lib/db";
import { users, businesses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const businessName = formData.get('businessName') as string;
  const userName = formData.get('userName') as string;

  if (!email || !password || !businessName || !userName) {
    return { error: "All fields are required." };
  }

  try {
    // 1. Check if the email is already in use
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: "This email is already registered." };
    }

    // 2. Hash the password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Generate UUIDs upfront to avoid circular reference issues
    const businessId = randomUUID();
    const userId = randomUUID();
    
    const slug = businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    
    const [newBusiness] = await db.insert(businesses).values({
      id: businessId,
      name: businessName,
      slug: slug,
      ownerId: userId,
    }).returning();

    // 4. Create the User and assign them to the new Business
    const [newUser] = await db.insert(users).values({
      id: userId,
      name: userName,
      email,
      passwordHash,
      businessId: businessId,
      role: 'owner',
    }).returning();

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong during registration. Please try again." };
  }
}