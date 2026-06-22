'use client';

import { useTranslations } from 'next-intl';

type ErrorFallbackProps = {
  onReset: () => void;
};

// Shared, localized error UI used by both the route-level `error.tsx` and the
// client-side ErrorBoundary that wraps the app shell.
function ErrorFallback({ onReset }: ErrorFallbackProps) {
  const t = useTranslations('Error');

  return (
    <div className="error">
      <h2>{t('title')}</h2>
      <p>{t('message')}</p>
      <button onClick={onReset}>{t('tryAgain')}</button>
    </div>
  );
}

export default ErrorFallback;
