// components/settings/BusinessSettings.tsx
'use client'

import { useState } from "react";
import { updateBusiness } from "@/app/actions/settings";
import { Building2, Loader2 } from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export function BusinessSettings({ business }: { business: BusinessData | null }) {
  const [loading, setLoading] = useState(false);

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
          <h3 className="text-lg font-semibold text-zinc-100">Business Settings</h3>
          <p className="text-sm text-zinc-500">Manage your business information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Business Name</label>
          <input
            name="name"
            defaultValue={business?.name || ""}
            required
            className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Business URL Slug</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-md text-zinc-500 text-sm">
              salespulse.app/
            </span>
            <input
              name="slug"
              defaultValue={business?.slug || ""}
              required
              pattern="[a-z0-9-]+"
              className="flex-1 bg-zinc-900 border border-zinc-800 p-2.5 rounded-r-md outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-xs text-zinc-600 mt-1">Only lowercase letters, numbers, and hyphens</p>
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Current Plan</label>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              business?.plan === 'agency' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              business?.plan === 'pro' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
            }`}>
              {business?.plan || 'free'}
            </span>
            {business?.plan === 'free' && (
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">
                Upgrade to Pro →
              </a>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
