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
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <AddCustomerModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.totalCustomers")}</p>
          <p className="text-2xl font-bold text-foreground">{businessCustomers.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.totalRevenue")}</p>
          <p className="text-2xl font-bold text-emerald-400">৳{totalCustomerRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.avgOrderValue")}</p>
          <p className="text-2xl font-bold text-primary">
            ৳{totalOrders > 0 ? (totalCustomerRevenue / totalOrders).toFixed(0) : "0"}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t("table.searchPlaceholder")}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">{t("table.customer")}</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">{t("table.contact")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("table.orders")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("table.totalSpent")}</th>
                <th className="px-6 py-4 font-medium text-center">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {businessCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{customer.orderCount}</span>
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
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    {t("table.noCustomers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
