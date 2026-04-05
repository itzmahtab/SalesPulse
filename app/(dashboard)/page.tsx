// app/(dashboard)/page.tsx
import { auth } from "@/lib/auth";
import { KPICard } from "@/components/dashboard/KPICard";
import { DollarSign, ShoppingBag, CreditCard, TrendingUp } from "lucide-react";

export default async function DashboardOverview() {
  const session = await auth();

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
          value="$45,231.89" 
          trend="+20.1%" 
          trendDirection="up" 
          icon={DollarSign} 
        />
        <KPICard 
          title="Total Orders" 
          value="356" 
          trend="+12.5%" 
          trendDirection="up" 
          icon={ShoppingBag} 
        />
        <KPICard 
          title="Avg. Order Value" 
          value="$127.05" 
          trend="-2.4%" 
          trendDirection="down" 
          icon={CreditCard} 
        />
        <KPICard 
          title="Gross Profit" 
          value="$18,450.00" 
          trend="+15.3%" 
          trendDirection="up" 
          icon={TrendingUp} 
        />
      </div>

      {/* Chart & Tables Placeholders for Sprint 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500">Revenue Chart (Recharts) goes here</p>
        </div>
        <div className="h-96 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-center">
          <p className="text-zinc-500">Sales by Category (Donut) goes here</p>
        </div>
      </div>
    </div>
  );
}