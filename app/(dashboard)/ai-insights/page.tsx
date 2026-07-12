import AIChat from "@/components/ai-insights/AIChat";
import { getTranslations } from "next-intl/server";

export default async function AIInsightsPage() {
  const t = await getTranslations("ai");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{t("title")}</h1>
        <p className="text-zinc-400 text-sm">{t("subtitle")}</p>
      </div>
      
      <AIChat />
    </div>
  );
}
