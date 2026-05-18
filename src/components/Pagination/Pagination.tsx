
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGES_PER_GROUP = 10;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const currentGroup = Math.floor(
    (currentPage - 1) /
      PAGES_PER_GROUP
  );

  const startPage =
    currentGroup *
      PAGES_PER_GROUP +
    1;

  const endPage = Math.min(
    startPage +
      PAGES_PER_GROUP -
      1,
    totalPages
  );

  const pages = Array.from(
    {
      length:
        endPage - startPage + 1,
    },
    (_, i) => startPage + i
  );

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        Prev
      </button>

      <div className="pages">
        {pages.map((page) => (
          <button
            key={page}
            className={
              currentPage === page
                ? 'page active'
                : 'page'
            }
            onClick={() =>
              onPageChange(page)
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

