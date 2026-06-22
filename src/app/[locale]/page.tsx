import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ locale: string }>;
};

// Placeholder home page — replaced by the server-rendered search results
// page in a later step.
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <p>Home placeholder</p>;
}
