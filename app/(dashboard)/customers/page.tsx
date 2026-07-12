// app/(dashboard)/customers/page.tsx
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import EditCustomerModal from "@/components/customers/EditCustomerModal";
import DeleteCustomerButton from "@/components/customers/DeleteCustomerButton";
import { Users, Mail, Phone, ShoppingBag, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CustomersPage() {
  const session = await auth();
  const businessId = session?.user.businessId;
  
  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const t = await getTranslations("customers");

  const businessCustomers = await db.query.customers.findMany({
    where: eq(customers.businessId, businessId),
    orderBy: [desc(customers.createdAt)],
  });

  const totalCustomerRevenue = businessCustomers.reduce(
    (acc, c) => acc + Number(c.totalSpent),
    0
  );

  const totalOrders = businessCustomers.reduce(
    (acc, c) => acc + c.orderCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{t("title")}</h1>
          <p className="text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <AddCustomerModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.totalCustomers")}</p>
          <p className="text-2xl font-bold text-zinc-100">{businessCustomers.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.totalRevenue")}</p>
          <p className="text-2xl font-bold text-emerald-400">৳{totalCustomerRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-400 mb-1">{t("stats.avgOrderValue")}</p>
          <p className="text-2xl font-bold text-indigo-400">
            ৳{totalOrders > 0 ? (totalCustomerRevenue / totalOrders).toFixed(0) : "0"}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={t("customerSelect.searchPlaceholder")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-zinc-500 bg-zinc-900/50 border-b border-zinc-800 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">{t("table.customer")}</th>
              <th className="px-6 py-4 font-medium">{t("table.contact")}</th>
              <th className="px-6 py-4 font-medium text-right">{t("table.orders")}</th>
              <th className="px-6 py-4 font-medium text-right">{t("table.totalSpent")}</th>
              <th className="px-6 py-4 font-medium text-center">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {businessCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{customer.name}</p>
                      <p className="text-xs text-zinc-500">
                        Joined {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Mail className="h-3.5 w-3.5 text-zinc-600" />
                        {customer.email}
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Phone className="h-3.5 w-3.5 text-zinc-600" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ShoppingBag className="h-4 w-4 text-zinc-600" />
                    <span className="font-medium text-zinc-200">{customer.orderCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-emerald-500">৳{Number(customer.totalSpent).toFixed(2)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <EditCustomerModal customer={customer} />
                    <DeleteCustomerButton 
                      customerId={customer.id} 
                      customerName={customer.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {businessCustomers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                  {t("table.noCustomers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
