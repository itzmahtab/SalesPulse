// components/inventory/AddProductModal.tsx
'use client'

import { useState } from "react";
import { addProduct } from "@/app/actions/products";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">Product Name</label>
              <input name="name" required className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">SKU</label>
              <input name="sku" required className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Category</label>
              <input name="category" placeholder="Electronics" className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Cost Price ($)</label>
              <input name="costPrice" type="number" step="0.01" required className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Sell Price ($)</label>
              <input name="sellPrice" type="number" step="0.01" required className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">Initial Stock Quantity</label>
              <input name="stockQty" type="number" required className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none focus:border-indigo-500" />
            </div>
          </div>
          <DialogFooter>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 p-2.5 rounded-md hover:bg-indigo-500 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}