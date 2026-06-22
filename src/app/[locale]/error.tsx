'use client';

import ErrorFallback from '@/components/ErrorFallback/ErrorFallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return <ErrorFallback onReset={reset} />;
}
