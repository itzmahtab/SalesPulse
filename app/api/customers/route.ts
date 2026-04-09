// app/api/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, ilike, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const businessCustomers = await db.query.customers.findMany({
      where: and(
        eq(customers.businessId, session.user.businessId),
        search ? ilike(customers.name, `%${search}%`) : undefined
      ),
      orderBy: (customers, { desc }) => [desc(customers.createdAt)],
      limit: 50,
    });

    return NextResponse.json(businessCustomers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
