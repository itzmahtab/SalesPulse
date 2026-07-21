// components/settings/ProfileSettings.tsx
'use client'

import { useState } from "react";
import { updateUserProfile } from "@/app/actions/settings";
import { User, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ProfileSettings({ user }: { user: UserData | null }) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("settings.profile");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateUserProfile(formData);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("fullName")}</label>
            <input
              name="name"
              defaultValue={user?.name || ""}
              required
              className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("email")}</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              required
              className="w-full bg-background border border-input p-2.5 rounded-md outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t("role")}</label>
          <input
            value={user?.role || "user"}
            disabled
            className="w-full bg-muted border border-border p-2.5 rounded-md text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">{t("roleHint")}</p>
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
