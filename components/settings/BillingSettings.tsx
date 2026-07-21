// components/settings/BillingSettings.tsx
'use client'

import { CreditCard, Zap, Crown, Building } from "lucide-react";
import { useTranslations } from "next-intl";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    icon: Zap,
    features: ["100 Sales/month", "1 User", "Basic Analytics", "Email Support"],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    icon: Crown,
    features: ["Unlimited Sales", "5 Users", "Advanced Analytics", "AI Insights", "Priority Support"],
    current: false,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$99",
    icon: Building,
    features: ["Unlimited Everything", "Unlimited Users", "White Label", "API Access", "Dedicated Support"],
    current: false,
  },
];

export function BillingSettings({ currentPlan }: { currentPlan: string }) {
  const t = useTranslations("settings.billing");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border ${
                isCurrent
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-foreground">{plan.name}</span>
                </div>
                {isCurrent && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {t("currentBadge")}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-foreground mb-4">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{t("perMonth")}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button className="w-full mt-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-accent transition-colors">
                  {t("upgradeBtn")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <h4 className="font-medium text-foreground mb-2">{t("historyTitle")}</h4>
        <p className="text-sm text-muted-foreground">{t("historyEmptyFree")}</p>
      </div>
    </div>
  );
}
