// app/(dashboard)/inventory/page.tsx
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { Search, Tag } from "lucide-react";
import AddProductModal from "@/components/inventory/AddProductModal";
import EditProductModal from "@/components/inventory/EditProductModal";
import DeleteProductButton from "@/components/inventory/DeleteProductButton";
import CopyIdButton from "@/components/inventory/CopyIdButton";
import { getTranslations } from "next-intl/server";

export default async function InventoryPage() {
  const session = await auth();
  const businessId = session?.user.businessId;
  
  if (!businessId) {
    return <div>Unauthorized</div>;
  }

  const t = await getTranslations("inventory");

  const businessProducts = await db.query.products.findMany({
    where: eq(products.businessId, businessId),
    orderBy: [desc(products.createdAt)],
  });

  const totalInventoryValue = businessProducts.reduce(
    (acc, p) => acc + (Number(p.costPrice) * p.stockQty),
    0
  );

  const lowStockCount = businessProducts.filter(
    p => p.stockQty <= p.lowStockThreshold
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <AddProductModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.totalProducts")}</p>
          <p className="text-2xl font-bold text-foreground">{businessProducts.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.lowStockItems")}</p>
          <p className="text-2xl font-bold text-amber-500">{lowStockCount}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <p className="text-sm font-medium text-muted-foreground mb-1">{t("stats.inventoryValue")}</p>
          <p className="text-2xl font-bold text-emerald-400">৳{totalInventoryValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder={t("productSelect.searchPlaceholder")}
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">{t("table.product")}</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">{t("table.sku")}</th>
                <th className="px-6 py-4 font-medium text-right hidden md:table-cell">{t("table.costSell")}</th>
                <th className="px-6 py-4 font-medium text-right hidden md:table-cell">{t("table.margin")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("table.stock")}</th>
                <th className="px-6 py-4 font-medium text-center">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {businessProducts.map((product) => {
                const cost = Number(product.costPrice);
                const sell = Number(product.sellPrice);
                const margin = ((sell - cost) / cost * 100).toFixed(1);
                
                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Tag className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">{product.category || t("table.uncategorized")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono hidden sm:table-cell">{product.sku}</td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <div className="text-sm text-muted-foreground">৳{cost.toFixed(2)}</div>
                      <div className="text-sm text-foreground">৳{sell.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className={`text-sm font-medium ${
                        Number(margin) > 50 ? 'text-emerald-500' : 
                        Number(margin) > 20 ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.stockQty <= 0 
                          ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                          : product.stockQty <= product.lowStockThreshold 
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {product.stockQty} {t("table.inStock")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <CopyIdButton id={product.id} />
                        <EditProductModal product={product} />
                        <DeleteProductButton 
                          productId={product.id} 
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {businessProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                    {t("table.noProducts")}
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
