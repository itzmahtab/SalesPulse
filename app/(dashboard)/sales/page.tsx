// app/(dashboard)/sales/page.tsx
import { db } from "@/lib/db";
import { sales, saleItems, customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, count, sum } from "drizzle-orm";
import { Plus, Search, FileText, Download } from "lucide-react";
import AddSaleModal from "@/components/sales/AddSaleModal";
import { getTranslations } from "next-intl/server";

export default async function SalesPage() {
  const session = await auth();
  const businessId = session?.user.businessId;

  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const t = await getTranslations("sales");

  const businessSales = await db
    .select({
      id: sales.id,
      invoiceNo: sales.invoiceNo,
      customerName: customers.name,
      totalAmount: sales.totalAmount,
      profit: sales.profit,
      createdAt: sales.createdAt,
      status: sales.status,
      itemsCount: count(saleItems.id),
    })
    .from(sales)
    .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
    .leftJoin(customers, eq(sales.customerId, customers.id))
    .where(eq(sales.businessId, businessId))
    .groupBy(sales.id, customers.name)
    .orderBy(desc(sales.createdAt));

  const totalRevenue = businessSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = businessSales.reduce((acc, s) => acc + Number(s.profit), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{t("title")}</h1>
          <p className="text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <AddSaleModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.totalSales")}</p>
          <p className="text-2xl font-bold text-zinc-100">{businessSales.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.totalRevenue")}</p>
          <p className="text-2xl font-bold text-emerald-400">৳{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.totalProfit")}</p>
          <p className="text-2xl font-bold text-indigo-400">৳{totalProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">{t("table.invoice")}</th>
              <th className="px-6 py-4 font-medium">{t("table.customer")}</th>
              <th className="px-6 py-4 font-medium">{t("table.items")}</th>
              <th className="px-6 py-4 font-medium">{t("table.date")}</th>
              <th className="px-6 py-4 font-medium text-right">{t("table.amount")}</th>
              <th className="px-6 py-4 font-medium text-right">{t("table.profit")}</th>
              <th className="px-6 py-4 font-medium">{t("table.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {businessSales.map((sale) => (
              <tr key={sale.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4 font-medium text-indigo-400">
                  {sale.invoiceNo}
                </td>
                <td className="px-6 py-4 text-zinc-300">
                  {sale.customerName || <span className="text-zinc-600 italic">{t("table.walkInCustomer")}</span>}
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {sale.itemsCount === 1 ? t("table.itemCount", { count: sale.itemsCount }) : t("table.itemsCount", { count: sale.itemsCount })}
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right font-medium text-zinc-100">
                  ৳{Number(sale.totalAmount).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right text-emerald-500">
                  ৳{Number(sale.profit).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${
                    sale.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : sale.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
            {businessSales.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 italic">
                  {t("table.noSales")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
