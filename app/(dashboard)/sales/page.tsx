// app/(dashboard)/sales/page.tsx
import { db } from "@/lib/db";
import { sales } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import AddSaleModal from "@/components/sales/AddSaleModal";

export default async function SalesPage() {
  const session = await auth();

  const businessSales = await db.query.sales.findMany({
    where: eq(sales.businessId, session?.user.businessId!),
    with: {
      customer: true, // Join with customer table
    },
    orderBy: [desc(sales.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Sales Orders</h1>
          <p className="text-zinc-400 text-sm">Track and manage your customer invoices.</p>
        </div>
        <AddSaleModal />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {businessSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-indigo-400">{sale.invoiceNo}</td>
                <td className="px-6 py-4 text-sm text-zinc-200">
                  {sale.customer?.name || "Walk-in Customer"}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {format(new Date(sale.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-zinc-100">
                  ${Number(sale.totalAmount).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
            {businessSales.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                  No sales recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}