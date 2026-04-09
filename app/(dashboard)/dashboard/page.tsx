// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sales, products, customers } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { KPICard } from "@/components/dashboard/KPICard";
import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from "lucide-react";

export default async function DashboardOverview() {
  const session = await auth();
  const businessId = session?.user.businessId;

  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const businessSales = await db.query.sales.findMany({
    where: and(
      eq(sales.businessId, businessId),
      gte(sales.createdAt, firstDayOfMonth)
    ),
  });

  const businessProducts = await db.query.products.findMany({
    where: eq(products.businessId, businessId),
  });

  const businessCustomers = await db.query.customers.findMany({
    where: eq(customers.businessId, businessId),
  });

  const totalRevenue = businessSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = businessSales.reduce((acc, s) => acc + Number(s.profit), 0);
  const totalOrders = businessSales.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const totalInventoryValue = businessProducts.reduce(
    (acc, p) => acc + Number(p.costPrice) * p.stockQty,
    0
  );

  const lowStockCount = businessProducts.filter(
    (p) => p.stockQty <= p.lowStockThreshold
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
        <p className="text-zinc-400 text-sm">Welcome back, here is what is happening with your store today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Revenue" 
          value={`৳${totalRevenue.toFixed(2)}`}
          trend={totalRevenue > 0 ? "+100%" : "0%"} 
          trendDirection={totalRevenue > 0 ? "up" : "neutral"} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Total Orders" 
          value={totalOrders.toString()}
          trend={totalOrders > 0 ? "+100%" : "0%"}
          trendDirection={totalOrders > 0 ? "up" : "neutral"}
          icon={ShoppingBag} 
        />
        <KPICard 
          title="Avg. Order Value" 
          value={`৳${avgOrderValue.toFixed(2)}`}
          trend="—" 
          trendDirection="neutral"
          icon={CreditCard} 
        />
        <KPICard 
          title="Gross Profit" 
          value={`৳${totalProfit.toFixed(2)}`}
          trend={totalProfit > 0 ? "+100%" : "0%"}
          trendDirection={totalProfit > 0 ? "up" : "neutral"}
          icon={TrendingUp} 
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Products</p>
          <p className="text-xl font-bold">{businessProducts.length}</p>
          <p className="text-xs text-amber-500 mt-1">{lowStockCount} low stock</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Customers</p>
          <p className="text-xl font-bold">{businessCustomers.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Inventory Value</p>
          <p className="text-xl font-bold text-emerald-500">৳{totalInventoryValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center">
          <p className="text-zinc-500 mb-2">Revenue Trend</p>
          <p className="text-xs text-zinc-600">Chart coming soon</p>
        </div>
        <div className="h-80 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center">
          <p className="text-zinc-500 mb-2">Sales by Category</p>
          <p className="text-xs text-zinc-600">Chart coming soon</p>
        </div>
      </div>
    </div>
  );
}
