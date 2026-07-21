import { X, AlertCircle } from "lucide-react";
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
  const t = useTranslations("sales.addModal");

  return (
    <div className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
        <p className="text-xs text-muted-foreground">{item.productSku}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <label className="text-[10px] text-muted-foreground mb-1">{t("qty")}</label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
              className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-accent rounded text-muted-foreground transition-colors text-sm"
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
              className="w-12 h-7 bg-muted border border-border rounded text-center text-sm text-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => onUpdate(item.id, { quantity: Math.min(item.quantity + 1, item.stockQty) })}
              className="w-7 h-7 flex items-center justify-center bg-muted hover:bg-accent rounded text-muted-foreground transition-colors text-sm"
              disabled={isMaxStock}
            >
              +
            </button>
          </div>
          {isStockLow && (
            <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {t("onlyLeft", { count: item.stockQty })}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold text-foreground">৳{subtotal.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-500">Profit: ৳{profit.toFixed(2)}</p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors mt-5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
