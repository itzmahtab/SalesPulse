// components/sales/AddSaleModal.tsx
'use client'

import { useState, useEffect } from "react";
import { createSale } from "@/app/actions/sales";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Loader2 } from "lucide-react";

export default function AddSaleModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // In a real build, fetch products via an API route or pass as props
  // For this demo, let's assume we have a simple state for the items being added
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  async function handleSale() {
    if (!selectedProduct) return;
    setLoading(true);
    
    const res = await createSale({
      items: [{ productId: selectedProduct, qty: quantity }]
    });

    if ('error' in res && res.error) {
      alert(res.error);
    } else {
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New Sale
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Record a Sale</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Product ID (Paste from Inventory)</label>
            <input 
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none" 
              placeholder="UUID of the product"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded-md outline-none" 
            />
          </div>

          <button 
            onClick={handleSale}
            disabled={loading}
            className="w-full bg-indigo-600 p-2.5 rounded-md hover:bg-indigo-500 transition-colors font-medium flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Sale"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}