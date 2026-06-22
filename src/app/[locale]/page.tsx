import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getPokemonResults } from '@/lib/pokeapi';
import Search from '@/components/Search/Search';
import CardList from '@/components/CardList/CardList';
import Pagination from '@/components/Pagination/Pagination';
import RefreshButton from '@/components/RefreshButton/RefreshButton';
import Loader from '@/components/Loader/Loader';
import PokemonDetailsPanel from '@/components/Details/PokemonDetailsPanel';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const sp = await searchParams;
  const query = firstParam(sp.query);
  const page = Math.max(1, Number(firstParam(sp.page)) || 1);
  const detailsId = firstParam(sp.details);

  const t = await getTranslations('Home');
  const { items, totalPages } = await getPokemonResults({ query, page });

  return (
    <div className="app-layout with-details">
      <div className="left-panel">
        <Search key={query} initialQuery={query} />

        <div className="results">
          {items.length === 0 ? (
            <p className="results-empty">{t('empty')}</p>
          ) : (
            <CardList items={items} query={query} page={page} />
          )}

          <RefreshButton className="refresh-btn" label={t('refresh')} />
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          query={query}
        />
      </div>

      <div className="right-panel">
        {detailsId ? (
          <Suspense fallback={<Loader />}>
            <PokemonDetailsPanel id={detailsId} query={query} page={page} />
          </Suspense>
        ) : (
          <p className="details-empty">{t('selectHint')}</p>
        )}
      </div>
    </div>
  );
}
