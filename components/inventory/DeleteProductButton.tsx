// components/inventory/DeleteProductButton.tsx
'use client'

import { useState } from "react";
import { deleteProduct } from "@/app/actions/products";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export default function DeleteProductButton({ productId, productName, onSuccess }: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProduct(productId);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      onSuccess?.();
    } else {
      alert(result.error || "Failed to delete product");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Product
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-zinc-300">
            Are you sure you want to delete <span className="font-semibold text-white">{productName}</span>?
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            This action cannot be undone. The product and all related data will be permanently removed.
          </p>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border border-zinc-700 rounded-md text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-rose-600 rounded-md hover:bg-rose-500 transition-colors text-white font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
