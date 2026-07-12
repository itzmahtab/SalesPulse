'use client'

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageSettings() {
  const t = useTranslations("settings.language");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    setLocaleCookie(newLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  const languages = [
    { code: 'en', label: t('english') },
    { code: 'bn', label: t('bengali') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">{t("title")}</h2>
        <p className="text-sm text-zinc-500">{t("subtitle")}</p>
      </div>

      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            disabled={isPending}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
              locale === lang.code
                ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800/50",
              isPending && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-3">
              <Globe className={cn("h-5 w-5", locale === lang.code ? "text-indigo-400" : "text-zinc-500")} />
              <span className="font-medium">{lang.label}</span>
            </div>
            {locale === lang.code && (
              <Check className="h-5 w-5 text-indigo-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
