// components/customers/EditCustomerModal.tsx
'use client'

import { useState } from "react";
import { updateCustomer } from "@/app/actions/customers";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Pencil, Loader2, User } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}

interface EditCustomerModalProps {
  customer: Customer;
  onSuccess?: () => void;
}

export default function EditCustomerModal({ customer, onSuccess }: EditCustomerModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set('id', customer.id);
    
    const result = await updateCustomer(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      onSuccess?.();
    } else {
      alert(result.error || "Failed to update customer");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-400" />
            Edit Customer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name *</label>
            <input 
              name="name" 
              required 
              defaultValue={customer.name}
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500" 
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <input 
              name="email" 
              type="email"
              defaultValue={customer.email || ""}
              placeholder="john@example.com"
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500" 
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Phone</label>
            <input 
              name="phone" 
              type="tel"
              defaultValue={customer.phone || ""}
              placeholder="+880 1XXX XXXXXX"
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 p-2.5 rounded-md hover:bg-indigo-500 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Update Customer"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
