// app/(dashboard)/reports/page.tsx
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, desc } from "drizzle-orm";
import { RevenueChart } from "@/components/reports/RevenueChart";
import { CategoryChart } from "@/components/reports/CategoryChart";
import { TopProductsChart } from "@/components/reports/TopProductsChart";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react";

interface SaleData {
  id: string;
  totalAmount: string;
  profit: string;
  createdAt: Date;
  items?: Array<{
    subtotal: string;
    qty: number;
    product: {
      name: string;
      category: string | null;
    } | null;
  }>;
}

function getDateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

function groupByDate(sales: SaleData[], days: number) {
  const groups: Record<string, { revenue: number; profit: number }> = {};
  
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    groups[key] = { revenue: 0, profit: 0 };
  }
  
  sales.forEach((sale) => {
    const date = new Date(sale.createdAt).toISOString().split('T')[0];
    if (groups[date]) {
      groups[date].revenue += Number(sale.totalAmount);
      groups[date].profit += Number(sale.profit);
    }
  });
  
  return Object.entries(groups).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue * 100) / 100,
    profit: Math.round(data.profit * 100) / 100,
  }));
}

export default async function ReportsPage() {
  const session = await auth();
  const businessId = session?.user.businessId;
  
  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const { start: weekStart } = getDateRange(7);
  const { start: monthStart } = getDateRange(30);
  const { start: yearStart } = getDateRange(365);

  const weekSales = await db.query.sales.findMany({
    where: and(
      eq(sales.businessId, businessId),
      gte(sales.createdAt, weekStart)
    ),
  });

  const monthSales = await db.query.sales.findMany({
    where: and(
      eq(sales.businessId, businessId),
      gte(sales.createdAt, monthStart)
    ),
  });

  const yearSales = await db.query.sales.findMany({
    where: and(
      eq(sales.businessId, businessId),
      gte(sales.createdAt, yearStart)
    ),
  });

  const allSales = await db.query.sales.findMany({
    where: eq(sales.businessId, businessId),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
    orderBy: [desc(sales.createdAt)],
  });

  const weekRevenue = weekSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const monthRevenue = monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const yearRevenue = yearSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = yearSales.reduce((acc, s) => acc + Number(s.profit), 0);

  const monthlyChartData = groupByDate(monthSales, 30);

  const categoryMap: Record<string, number> = {};
  allSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const category = item.product?.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + Number(item.subtotal);
    });
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  allSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productName = item.product?.name || 'Unknown';
      if (!productMap[item.productId]) {
        productMap[item.productId] = { name: productName, qty: 0, revenue: 0 };
      }
      productMap[item.productId].qty += item.qty;
      productMap[item.productId].revenue += Number(item.subtotal);
    });
  });
  const topProductsData = Object.values(productMap)
    .map((p) => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Reports</h1>
        <p className="text-zinc-400 text-sm">Analytics and insights for your business.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <p className="text-xs text-zinc-500 uppercase font-semibold">This Week</p>
          </div>
          <p className="text-xl font-bold text-emerald-500">৳{weekRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <p className="text-xs text-zinc-500 uppercase font-semibold">This Month</p>
          </div>
          <p className="text-xl font-bold text-indigo-500">৳{monthRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            <p className="text-xs text-zinc-500 uppercase font-semibold">This Year</p>
          </div>
          <p className="text-xl font-bold text-purple-500">৳{yearRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-zinc-500 uppercase font-semibold">Total Profit</p>
          </div>
          <p className="text-xl font-bold text-amber-500">৳{totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Revenue Trend (30 Days)</h2>
          <RevenueChart data={monthlyChartData} />
        </div>

        {/* Sales by Category */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Sales by Category</h2>
          {categoryData.length > 0 ? (
            <CategoryChart data={categoryData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-500">
              No category data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Top Products</h2>
          {topProductsData.length > 0 ? (
            <TopProductsChart data={topProductsData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-500">
              No product data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
