import { notFound } from 'next/navigation';

// Catch-all for unknown routes under a locale. With the next-intl middleware in
// place, this is required so unmatched paths render the localized not-found UI.
export default function CatchAllPage() {
  notFound();
}
