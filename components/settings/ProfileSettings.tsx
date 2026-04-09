// components/settings/ProfileSettings.tsx
'use client'

import { useState } from "react";
import { updateUserProfile } from "@/app/actions/settings";
import { User, Loader2 } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ProfileSettings({ user }: { user: UserData | null }) {
  const [loading, setLoading] = useState(false);

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
        <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <User className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Profile Settings</h3>
          <p className="text-sm text-zinc-500">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Full Name</label>
            <input
              name="name"
              defaultValue={user?.name || ""}
              required
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              required
              className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Role</label>
          <input
            value={user?.role || "user"}
            disabled
            className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-md text-zinc-500 cursor-not-allowed"
          />
          <p className="text-xs text-zinc-600 mt-1">Role cannot be changed</p>
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
