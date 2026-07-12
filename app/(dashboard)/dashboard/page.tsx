
// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sales, products, customers } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { KPICard } from "@/components/dashboard/KPICard";
import { DollarSign, ShoppingBag, CreditCard, TrendingUp, Activity } from "lucide-react";
import { RevenueChart } from "@/components/reports/RevenueChart";
import { CategoryChart } from "@/components/reports/CategoryChart";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const session = await auth();
  const businessId = session?.user.businessId;

  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const t = await getTranslations("dashboard");

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

  const lowStockProducts = await db.select().from(products)
    .where(and(eq(products.businessId, businessId), lte(products.stockQty, products.lowStockThreshold || 10)))
    .limit(5);

  const businessCustomers = await db.query.customers.findMany({
    where: eq(customers.businessId, businessId),
  });

  const totalRevenue = businessSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = businessSales.reduce((acc, s) => acc + Number(s.profit), 0);
  const totalSales = businessSales.length;
  const revenueData: any[] = []; 
  const categoryData: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{t("overview.title")}</h1>
        <p className="text-sm text-zinc-500">{t("overview.subtitle")}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title={t("kpi.totalRevenue")} 
          value={`৳${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          trendDirection="up"
          icon={DollarSign} 
        />
        <KPICard 
          title={t("kpi.totalOrders")} 
          value={totalSales.toString()} 
          trend="+5.2%" 
          trendDirection="up"
          icon={ShoppingBag} 
        />
        <KPICard 
          title={t("kpi.avgOrderValue")} 
          value={`৳${totalSales > 0 ? (totalRevenue / totalSales).toFixed(0) : 0}`} 
          trend="—" 
          trendDirection="neutral"
          icon={CreditCard} 
        />
        <KPICard 
          title={t("kpi.grossProfit")} 
          value={`৳${totalProfit.toLocaleString()}`} 
          trend="+8.4%" 
          trendDirection="up"
          icon={Activity} 
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">{t("stats.totalProducts")}</p>
          <p className="text-xl font-bold">{businessProducts.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">{t("stats.totalCustomers")}</p>
          <p className="text-xl font-bold">{businessCustomers.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">{t("stats.lowStock")}</p>
          <p className="text-xl font-bold text-amber-500">{lowStockProducts.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-100">{t("charts.revenueTrend")}</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <RevenueChart data={revenueData} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold text-zinc-100 mb-6">{t("charts.salesByCategory")}</h3>
            <CategoryChart data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
}
