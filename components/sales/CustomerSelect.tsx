'use client'

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  totalSpent: string;
  orderCount: number;
}

interface CustomerSelectProps {
  value: string;
  onChange: (customer: Customer | null) => void;
}

export default function CustomerSelect({ value, onChange }: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("sales.customerSelect");

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
      setLoading(false);
    }

    if (open) {
      fetchCustomers();
    }
  }, [open, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCustomer = value ? customers.find(c => c.id === value) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-card border border-border p-2.5 rounded-md hover:border-border transition-colors text-left"
      >
        {selectedCustomer ? (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-foreground">{selectedCustomer.name}</span>
            {selectedCustomer.phone && (
              <span className="text-xs text-muted-foreground">({selectedCustomer.phone})</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t("walkInCustomer")}</span>
          </div>
        )}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 bg-muted rounded px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
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
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
                setSearch("");
              }}
              className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t("walkInCustomer")}</span>
                <span className="text-xs text-muted-foreground ml-auto">{t("noCustomer")}</span>
              </div>
            </button>

            {loading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
            ) : customers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">{t("noCustomers")}</div>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => {
                    onChange(customer);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email || customer.phone || t("noContactInfo")} • {customer.orderCount} {t("orders")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t("total")}: ৳{Number(customer.totalSpent).toFixed(2)}</p>
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
