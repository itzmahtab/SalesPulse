// components/settings/SettingsClient.tsx
'use client'

import { useState } from "react";
import { SettingsTabs } from "./SettingsTabs";
import { ProfileSettings } from "./ProfileSettings";
import { BusinessSettings } from "./BusinessSettings";
import { BillingSettings } from "./BillingSettings";

interface SettingsData {
  business?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function SettingsClient({ data }: { data: SettingsData }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "profile" && (
          <ProfileSettings user={data.user || null} />
        )}
        {activeTab === "business" && (
          <BusinessSettings business={data.business || null} />
        )}
        {activeTab === "billing" && (
          <BillingSettings currentPlan={data.business?.plan || "free"} />
        )}
      </div>
    </div>
  );
}
