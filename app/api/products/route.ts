// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
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
    const businessProducts = await db.query.products.findMany({
      where: and(
        eq(products.businessId, session.user.businessId),
        search ? ilike(products.name, `%${search}%`) : undefined
      ),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 50,
    });

    return NextResponse.json(businessProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
