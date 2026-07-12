import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'bn'];
export const defaultLocale = 'bn';

export default getRequestConfig(async () => {
  // Read the locale from the cookie (set by LanguageToggle)
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  
  if (!locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
