// components/settings/SettingsTabs.tsx
'use client'

import { User, Building2, CreditCard, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

const tabs = [
  { id: "profile", labelKey: "profile", icon: User },
  { id: "business", labelKey: "business", icon: Building2 },
  { id: "billing", labelKey: "billing", icon: CreditCard },
  { id: "language", labelKey: "language", icon: Globe },
];

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const t = useTranslations("settings.tabs");
  return (
    <div className="flex gap-1 p-1 bg-card rounded-lg w-fit overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
