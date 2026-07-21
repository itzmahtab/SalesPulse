// components/sales/AddSaleModal.tsx
'use client'

import { useState } from "react";
import { createSale } from "@/app/actions/sales";
import ProductSelect, { type Product } from "./ProductSelect";
import CustomerSelect from "./CustomerSelect";
import LineItemRow from "./LineItemRow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, ShoppingCart, Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface LineItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: string;
  costPrice: string;
  stockQty: number;
}

export default function AddSaleModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const t = useTranslations("sales.addModal");

  const subtotal = lineItems.reduce((acc, item) => acc + Number(item.unitPrice) * item.quantity, 0);
  const totalCost = lineItems.reduce((acc, item) => acc + Number(item.costPrice) * item.quantity, 0);
  const profit = subtotal - totalCost;

  function handleAddProduct(product: Product | null) {
    if (!product) return;
    
    const existingIndex = lineItems.findIndex(item => item.productId === product.id);
    if (existingIndex >= 0) {
      const updated = [...lineItems];
      updated[existingIndex].quantity = Math.min(
        updated[existingIndex].quantity + 1,
        product.stockQty
      );
      setLineItems(updated);
    } else {
      setLineItems([
        ...lineItems,
        {
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: 1,
          unitPrice: product.sellPrice,
          costPrice: product.costPrice,
          stockQty: product.stockQty,
        },
      ]);
    }
  }

  function handleUpdateItem(id: string, updates: Partial<LineItem>) {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }

  function handleRemoveItem(id: string) {
    setLineItems(lineItems.filter((item) => item.id !== id));
  }

  function resetForm() {
    setCustomerId(null);
    setLineItems([]);
  }

  async function handleSubmit() {
    if (lineItems.length === 0) return;
    
    setLoading(true);
    const res = await createSale({
      customerId: customerId || undefined,
      items: lineItems.map((item) => ({
        productId: item.productId,
        qty: item.quantity,
      })),
    });

    if ('error' in res && res.error) {
      alert(res.error);
    } else {
      setOpen(false);
      resetForm();
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          {t("title")}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-500" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Customer Selection */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">{t("customerLabel")}</label>
            <CustomerSelect
              value={customerId || ""}
              onChange={(customer) => setCustomerId(customer?.id || null)}
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">{t("addProductLabel")}</label>
            <ProductSelect
              value=""
              onChange={handleAddProduct}
              excludeIds={lineItems.map((item) => item.productId)}
            />
          </div>

          {/* Line Items */}
          {lineItems.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">{t("itemsLabel")} ({lineItems.length})</label>
              {lineItems.map((item) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}

          {lineItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              <Package className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm">{t("noItems")}</p>
              <p className="text-xs text-muted-foreground">{t("selectProductToStart")}</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {lineItems.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-medium">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("totalCost")}</span>
                <span className="text-muted-foreground">৳{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("grossProfit")}</span>
                <span className="text-emerald-500 font-semibold">৳{profit.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="flex-1 py-2.5 border border-border rounded-md text-muted-foreground hover:bg-accent transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || lineItems.length === 0}
                className="flex-1 py-2.5 bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    {t("completeSale")}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
