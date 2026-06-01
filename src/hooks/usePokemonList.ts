import {
  useGetPokemonListQuery,
  useSearchPokemonsQuery,
} from '../store/api';
import type { PokemonCardData } from '../services/api';

interface ReturnType {
  items: PokemonCardData[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  refetch: () => void;
}

const LIMIT = 21;

export const usePokemonList = (
  query: string,
  page: number
): ReturnType => {
  const offset = (page - 1) * LIMIT;

  const listQuery = useGetPokemonListQuery(
    { offset, limit: LIMIT },
    { skip: !!query }
  );

  const searchQuery = useSearchPokemonsQuery(
    { query, page, limit: LIMIT },
    { skip: !query }
  );

  const activeQuery = query ? searchQuery : listQuery;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = activeQuery;

  const getErrorMessage = (): string | null => {
    if (!error) {
      return null;
    }

    if (typeof error === 'string') {
      return error;
    }

    if ('data' in error && typeof error.data === 'string') {
      return error.data;
    }

    if ('message' in error && error.message) {
      return error.message;
    }

    return 'Failed to load data';
  };

  const items = data?.items || [];
  const totalPages = data
    ? Math.ceil(data.count / LIMIT)
    : 1;

  return {
    items,
    loading: isLoading,
    error: getErrorMessage(),
    totalPages,
    refetch: () => refetch(),
  };
};

