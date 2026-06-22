import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const PAGES_PER_GROUP = 10;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query: string;
};

async function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const t = await getTranslations('Pagination');

  const currentGroup = Math.floor((currentPage - 1) / PAGES_PER_GROUP);
  const startPage = currentGroup * PAGES_PER_GROUP + 1;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const hrefFor = (page: number) => ({
    pathname: '/' as const,
    query: { ...(query ? { query } : {}), page: String(page) },
  });

  return (
    <div className="pagination">
      {currentPage === 1 ? (
        <span className="pagination-btn disabled">{t('prev')}</span>
      ) : (
        <Link className="pagination-btn" href={hrefFor(currentPage - 1)}>
          {t('prev')}
        </Link>
      )}

      <div className="pages">
        {pages.map((page) => (
          <Link
            key={page}
            className={page === currentPage ? 'page active' : 'page'}
            href={hrefFor(page)}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage === totalPages ? (
        <span className="pagination-btn disabled">{t('next')}</span>
      ) : (
        <Link className="pagination-btn" href={hrefFor(currentPage + 1)}>
          {t('next')}
        </Link>
      )}
    </div>
  );
}

export default Pagination;
