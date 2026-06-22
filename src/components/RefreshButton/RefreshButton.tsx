'use client';

import { useRouter } from 'next/navigation';

type RefreshButtonProps = {
  label: string;
  className?: string;
};

// Re-runs the server components for the current route, re-fetching server data.
function RefreshButton({ label, className = 'refresh-btn' }: RefreshButtonProps) {
  const router = useRouter();

  return (
    <button type="button" className={className} onClick={() => router.refresh()}>
      {label}
    </button>
  );
}

export default RefreshButton;
