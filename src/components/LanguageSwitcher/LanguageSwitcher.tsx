'use client';

import type { ChangeEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as (typeof routing.locales)[number];

    // Read the current query string at interaction time so the active
    // search/pagination state is preserved across the locale change. This
    // avoids the useSearchParams hook, which would otherwise force a Suspense
    // boundary around the navbar in the shared layout.
    const query = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );

    router.replace({ pathname, query }, { locale: nextLocale });
  };

  return (
    <select
      className="language-switcher"
      value={locale}
      onChange={handleChange}
      aria-label={t('label')}
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
