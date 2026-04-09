'use client'

import { X, AlertCircle } from "lucide-react";

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

interface LineItemRowProps {
  item: LineItem;
  onUpdate: (id: string, updates: Partial<LineItem>) => void;
  onRemove: (id: string) => void;
}

export default function LineItemRow({ item, onUpdate, onRemove }: LineItemRowProps) {
  const subtotal = Number(item.unitPrice) * item.quantity;
  const profit = (Number(item.unitPrice) - Number(item.costPrice)) * item.quantity;
  const isStockLow = item.quantity > item.stockQty;
  const isMaxStock = item.quantity >= item.stockQty;

  return (
    <div className="flex items-start gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{item.productName}</p>
        <p className="text-xs text-zinc-500">{item.productSku}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <label className="text-[10px] text-zinc-500 mb-1">Qty</label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
              className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors text-sm"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={item.stockQty}
              value={item.quantity}
              onChange={(e) => {
                const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), item.stockQty);
                onUpdate(item.id, { quantity: val });
              }}
              className="w-12 h-7 bg-zinc-800 border border-zinc-700 rounded text-center text-sm text-zinc-200 outline-none"
            />
            <button
              type="button"
              onClick={() => onUpdate(item.id, { quantity: Math.min(item.quantity + 1, item.stockQty) })}
              className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 transition-colors text-sm"
              disabled={isMaxStock}
            >
              +
            </button>
          </div>
          {isStockLow && (
            <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Only {item.stockQty} left
            </p>
          )}
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-zinc-200">৳{subtotal.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-500">Profit: ৳{profit.toFixed(2)}</p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors mt-5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
