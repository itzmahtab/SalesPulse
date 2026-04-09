// app/(dashboard)/customers/page.tsx
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import EditCustomerModal from "@/components/customers/EditCustomerModal";
import DeleteCustomerButton from "@/components/customers/DeleteCustomerButton";
import { Users, Mail, Phone, ShoppingBag } from "lucide-react";

export default async function CustomersPage() {
  const session = await auth();
  const businessId = session?.user.businessId;
  
  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const businessCustomers = await db.query.customers.findMany({
    where: eq(customers.businessId, businessId),
    orderBy: [desc(customers.createdAt)],
  });

  const totalRevenue = businessCustomers.reduce(
    (acc, c) => acc + Number(c.totalSpent),
    0
  );

  const totalOrders = businessCustomers.reduce(
    (acc, c) => acc + c.orderCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Customers</h1>
          <p className="text-zinc-400 text-sm">Manage your customer database and track purchases.</p>
        </div>
        <AddCustomerModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Customers</p>
          <p className="text-xl font-bold">{businessCustomers.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Orders</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Revenue from Customers</p>
          <p className="text-xl font-bold text-emerald-500">৳{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium text-center">Orders</th>
              <th className="px-6 py-4 font-medium text-right">Total Spent</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                    {!customer.email && !customer.phone && (
                      <span className="text-xs text-zinc-600 italic">No contact info</span>
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
                  No customers found. Add your first customer to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
