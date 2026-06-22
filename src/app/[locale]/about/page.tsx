import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

// Statically generated at build time (SSG) — no runtime/client data fetching.
export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'About' });

  return { title: t('title') };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations('About');

  return (
    <div className="about-page">
      <h1>{t('title')}</h1>

      <p>{t('description')}</p>

      <p>{t('author')}</p>

      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        {t('courseLink')}
      </a>
    </div>
  );
}
