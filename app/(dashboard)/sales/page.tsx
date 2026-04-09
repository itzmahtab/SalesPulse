// app/(dashboard)/sales/page.tsx
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import AddSaleModal from "@/components/sales/AddSaleModal";

export default async function SalesPage() {
  const session = await auth();
  const businessId = session?.user.businessId;

  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const businessSales = await db.query.sales.findMany({
    where: eq(sales.businessId, businessId),
    with: {
      customer: true,
      items: {
        with: {
          product: true,
        },
      },
    },
    orderBy: [desc(sales.createdAt)],
  });

  const totalRevenue = businessSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = businessSales.reduce((acc, s) => acc + Number(s.profit), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Sales Orders</h1>
          <p className="text-zinc-400 text-sm">Track and manage your customer invoices.</p>
        </div>
        <AddSaleModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Sales</p>
          <p className="text-xl font-bold">{businessSales.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-500">৳{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Profit</p>
          <p className="text-xl font-bold text-indigo-500">৳{totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Profit</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {businessSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-indigo-400">{sale.invoiceNo}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-zinc-200">{sale.customer?.name || "Walk-in Customer"}</span>
                  {sale.customer?.phone && (
                    <span className="text-xs text-zinc-500 ml-1">({sale.customer.phone})</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {format(new Date(sale.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-zinc-100 text-right">
                  ৳{Number(sale.totalAmount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-emerald-500 text-right">
                  ৳{Number(sale.profit).toFixed(2)}
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
                  No sales recorded yet. Start by creating your first sale!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
