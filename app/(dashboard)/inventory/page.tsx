// app/(dashboard)/inventory/page.tsx
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { Package, Plus, Search } from "lucide-react";
import AddProductModal from "@/components/inventory/AddProductModal";

export default async function InventoryPage() {
  const session = await auth();
  
  // Fetch products for this business
  const businessProducts = await db.query.products.findMany({
    where: eq(products.businessId, session?.user.businessId!),
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Inventory</h1>
          <p className="text-zinc-400 text-sm">Manage your products and stock levels.</p>
        </div>
        <AddProductModal />
      </div>

      {/* Stats Mini-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Total Products</p>
          <p className="text-xl font-bold">{businessProducts.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Low Stock Items</p>
          <p className="text-xl font-bold text-amber-500">
            {businessProducts.filter(p => p.stockQty <= p.lowStockThreshold).length}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase font-semibold">Inventory Value</p>
          <p className="text-xl font-bold text-emerald-500">
            ${businessProducts.reduce((acc, p) => acc + (Number(p.costPrice) * p.stockQty), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {businessProducts.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-200">{product.name}</div>
                  <div className="text-xs text-zinc-500">{product.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-zinc-200">${product.sellPrice}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stockQty <= product.lowStockThreshold 
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                    : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {product.stockQty} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-zinc-500 hover:text-white">Edit</button>
                </td>
              </tr>
            ))}
            {businessProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                  No products found. Add your first item to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}