import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation APIs. All app links/redirects go through these
// so that the active locale prefix is applied automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
