'use client';

import { useTranslations } from 'next-intl';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  const t = useTranslations('Error');

  return (
    <div className="error">
      <h2>{t('title')}</h2>
      <p>{t('message')}</p>
      <button onClick={reset}>{t('tryAgain')}</button>
    </div>
  );
}
