'use client'

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Users } from "lucide-react";

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
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2.5 rounded-md hover:border-zinc-700 transition-colors text-left"
      >
        {selectedCustomer ? (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="text-zinc-200">{selectedCustomer.name}</span>
            {selectedCustomer.phone && (
              <span className="text-xs text-zinc-500">({selectedCustomer.phone})</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-zinc-600" />
            <span className="text-zinc-500">Walk-in Customer</span>
          </div>
        )}
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-md shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 bg-zinc-800/50 rounded px-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
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
              className="w-full px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-zinc-600" />
                <span className="text-sm font-medium text-zinc-400">Walk-in Customer</span>
                <span className="text-xs text-zinc-600 ml-auto">No customer</span>
              </div>
            </button>

            {loading ? (
              <div className="p-4 text-center text-zinc-500 text-sm">Loading...</div>
            ) : customers.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No customers found</div>
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
                  className="w-full px-3 py-2.5 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{customer.name}</p>
                      <p className="text-xs text-zinc-500">
                        {customer.email || customer.phone || 'No contact info'} • {customer.orderCount} orders
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Total: ৳{Number(customer.totalSpent).toFixed(2)}</p>
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
