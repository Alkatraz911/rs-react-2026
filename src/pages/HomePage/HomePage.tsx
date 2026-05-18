import {
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import Search from '../../components/Search/Search';
import CardList from '../../components/CardList/CardList';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

import { usePokemonList } from '../../hooks/usePokemonList';

function HomePage() {
  const location = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const hasDetails =
    location.pathname.includes('/pokemon/');

  const query =
    searchParams.get('query') || '';

  const currentPage = Number(
    searchParams.get('page') || '1'
  );

  const {
    items,
    loading,
    error,
    totalPages,
  } = usePokemonList(
    query,
    currentPage
  );

  const handlePageChange = (
    page: number
  ) => {
    const params = new URLSearchParams(
      searchParams
    );

    params.set('page', String(page));

    setSearchParams(params);
  };

  return (
    <div
      className={
        hasDetails
          ? 'app-layout with-details'
          : 'app-layout'
      }
    >
      <div className="left-panel">
        <Search />

        <div className="results">
          {loading && <Loader />}

          {error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && (
            <CardList items={items} />
          )}
        </div>

        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={
              handlePageChange
            }
          />
        )}
      </div>

      {hasDetails && (
        <div className="right-panel">
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default HomePage;

