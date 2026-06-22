'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';

// Server action: handle search submissions on the server and redirect to the
// updated, server-rendered results URL (page resets to 1 implicitly).
export async function searchAction(formData: FormData) {
  const query = String(formData.get('query') ?? '').trim();
  const locale = await getLocale();

  redirect({
    href: query ? { pathname: '/', query: { query } } : { pathname: '/' },
    locale,
  });
}

// Server action: clear the active search.
export async function clearAction() {
  const locale = await getLocale();
  redirect({ href: { pathname: '/' }, locale });
}
