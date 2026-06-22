'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useTheme } from '@/context/ThemeContext';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

function Navbar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test Error Boundary');
  }

  const linkClassName = (href: string) =>
    pathname === href ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link href="/" className={linkClassName('/')}>
        {t('home')}
      </Link>

      <Link href="/about" className={linkClassName('/about')}>
        {t('about')}
      </Link>

      <LanguageSwitcher />

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
      >
        {theme === 'dark' ? t('lightMode') : t('darkMode')}
      </button>

      <button className="error-btn" onClick={() => setShouldThrow(true)}>
        {t('testError')}
      </button>
    </nav>
  );
}

export default Navbar;
