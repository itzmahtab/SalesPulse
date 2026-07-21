// components/customers/AddCustomerModal.tsx
'use client'

import { useState } from "react";
import { addCustomer } from "@/app/actions/customers";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AddCustomerModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("customers.addModal");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await addCustomer(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } else {
      alert(result.error || "Failed to create customer");
    }
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
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("fullNameLabel")}</label>
            <input 
              name="name" 
              required 
              placeholder="John Doe"
              className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("emailLabel")}</label>
            <input 
              name="email" 
              type="email"
              placeholder="john@example.com"
              className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("phoneLabel")}</label>
            <input 
              name="phone" 
              type="tel"
              placeholder="+880 1XXX XXXXXX"
              className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white dark:bg-white dark:text-black p-2.5 rounded-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? t("adding") : t("addCustomer")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
