// app/(dashboard)/settings/page.tsx
import { getSettingsData } from "@/app/actions/settings";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  const result = await getSettingsData();
  const t = await getTranslations("settings");

  if ('error' in result) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">{t("errorMsg")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <SettingsClient data={result} />
      </div>
    </div>
  );
}
