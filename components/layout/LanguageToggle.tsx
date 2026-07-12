'use client'

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = currentLocale === 'en' ? 'bn' : 'en';
    
    // Set the cookie for the server to read
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // We use transition to avoid showing stale data while refreshing
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm font-medium",
        isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800/50",
        currentLocale === 'en' 
          ? "border-zinc-800 bg-zinc-900/50 text-zinc-300" 
          : "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
      )}
      title="Toggle Language"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLocale === 'en' ? 'EN' : 'বাং'}</span>
    </button>
  );
}
