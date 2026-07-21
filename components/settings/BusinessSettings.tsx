// components/settings/BusinessSettings.tsx
'use client'

import { useState } from "react";
import { updateBusiness } from "@/app/actions/settings";
import { Building2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export function BusinessSettings({ business }: { business: BusinessData | null }) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("settings.business");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateBusiness(formData);
    if (result.error) {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Building2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("businessName")}</label>
          <input
            name="name"
            defaultValue={business?.name || ""}
            required
            className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("businessSlug")}</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-border rounded-l-md text-muted-foreground text-sm">
              salespulse.app/
            </span>
            <input
              name="slug"
              defaultValue={business?.slug || ""}
              required
              pattern="[a-z0-9-]+"
              className="flex-1 bg-background border border-input p-2.5 rounded-r-md outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{t("slugHint")}</p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("currentPlan")}</label>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              business?.plan === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              business?.plan === 'pro' ? 'bg-primary/10 text-primary border border-primary/20' :
              'bg-muted text-muted-foreground border border-border'
            }`}>
              {business?.plan || 'free'}
            </span>
            {business?.plan === 'free' && (
              <a href="#" className="text-xs text-primary hover:text-primary/80">
                {t("upgradeToPro")}
              </a>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? t("saving") : t("save")}
        </button>
      </form>
    </div>
  );
}
