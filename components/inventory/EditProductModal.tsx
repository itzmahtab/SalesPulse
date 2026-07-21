// components/inventory/EditProductModal.tsx
'use client'

import { useState } from "react";
import { updateProduct } from "@/app/actions/products";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Pencil, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string | null;
  costPrice: string;
  sellPrice: string;
  stockQty: number;
  lowStockThreshold: number;
}

interface EditProductModalProps {
  product: Product;
  onSuccess?: () => void;
}

export default function EditProductModal({ product, onSuccess }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("inventory.editModal");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('id', product.id);
    
    const result = await updateProduct(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      onSuccess?.();
    } else {
      alert(result.error || "Failed to update product");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <Pencil className="h-3.5 w-3.5" />
          {t("title")}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">{t("nameLabel")}</label>
              <input 
                name="name" 
                defaultValue={product.name}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("skuLabel")}</label>
              <input 
                name="sku" 
                defaultValue={product.sku}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("categoryLabel")}</label>
              <input 
                name="category" 
                defaultValue={product.category || ""}
                placeholder="Electronics" 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("costPriceLabel")}</label>
              <input 
                name="costPrice" 
                type="number" 
                step="0.01" 
                defaultValue={product.costPrice}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("sellPriceLabel")}</label>
              <input 
                name="sellPrice" 
                type="number" 
                step="0.01" 
                defaultValue={product.sellPrice}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("stockLabel")}</label>
              <input 
                name="stockQty" 
                type="number" 
                defaultValue={product.stockQty}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("lowStockAlertLabel")}</label>
              <input 
                name="lowStockThreshold" 
                type="number" 
                defaultValue={product.lowStockThreshold}
                required 
                className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary p-2.5 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? t("saving") : t("updateProduct")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
