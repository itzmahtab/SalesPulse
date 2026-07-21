'use client'

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface Product {
  id: string;
  name: string;
  sku: string;
  sellPrice: string;
  costPrice: string;
  stockQty: number;
  category?: string | null;
}

export type { Product };

interface ProductSelectProps {
  value: string;
  onChange: (product: Product | null) => void;
  excludeIds?: string[];
}

export default function ProductSelect({ value, onChange, excludeIds = [] }: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("sales.productSelect");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.filter((p: Product) => !excludeIds.includes(p.id) && p.stockQty > 0));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setLoading(false);
    }

    if (open) {
      fetchProducts();
    }
  }, [open, search, excludeIds]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProduct = products.find(p => p.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-card border border-border p-2.5 rounded-md hover:border-border transition-colors text-left"
      >
        {selectedProduct ? (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-foreground">{selectedProduct.name}</span>
            <span className="text-xs text-muted-foreground">({selectedProduct.sku})</span>
          </div>
        ) : (
          <span className="text-muted-foreground">{t("selectProduct")}</span>
        )}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 bg-muted rounded px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
            ) : products.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">{t("noProducts")}</div>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onChange(product);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku} {product.category && `• ${product.category}`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-400">৳{Number(product.sellPrice).toFixed(2)}</p>
                      <p className={`text-xs ${product.stockQty <= 5 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {product.stockQty} {t("inStock")}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
