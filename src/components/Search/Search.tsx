import { getTranslations } from 'next-intl/server';
import { searchAction, clearAction } from '@/app/[locale]/actions';

type SearchProps = {
  initialQuery: string;
};

async function Search({ initialQuery }: SearchProps) {
  const t = await getTranslations('Search');

  return (
    <form className="search" action={searchAction}>
      <input
        name="query"
        defaultValue={initialQuery}
        placeholder={t('placeholder')}
      />

      <button
        type="submit"
        className="clear-search"
        formAction={clearAction}
        aria-label={t('clear')}
      >
        X
      </button>

      <button type="submit">{t('search')}</button>
    </form>
  );
}

export default Search;
