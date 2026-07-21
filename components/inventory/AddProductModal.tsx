// components/inventory/AddProductModal.tsx
'use client'

import { useState } from "react";
import { addProduct } from "@/app/actions/products";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("inventory.addModal");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addProduct(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-colors font-medium">
          <Plus className="h-4 w-4" />
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
              <input name="name" required className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("skuLabel")}</label>
              <input name="sku" required className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("categoryLabel")}</label>
              <input name="category" placeholder="Electronics" className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("costPriceLabel")}</label>
              <input name="costPrice" type="number" step="0.01" required className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("sellPriceLabel")}</label>
              <input name="sellPrice" type="number" step="0.01" required className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">{t("initialStockLabel")}</label>
              <input name="stockQty" type="number" required className="w-full bg-background border border-input p-2 rounded-md outline-none focus:border-primary" />
            </div>
          </div>
          <DialogFooter>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black p-2.5 rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? t("saving") : t("saveProduct")}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}