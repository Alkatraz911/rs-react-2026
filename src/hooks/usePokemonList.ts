
import { useEffect, useState } from 'react';

import {
  fetchPokemons,
  searchPokemons,
  type PokemonCardData,
} from '../services/api';

interface ReturnType {
  items: PokemonCardData[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const LIMIT = 21;

export const usePokemonList = (
  query: string,
  page: number
): ReturnType => {
  const [items, setItems] = useState<
    PokemonCardData[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [totalPages, setTotalPages] =
    useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * LIMIT;

        const data = query
          ? await searchPokemons(
              query,
              page,
              LIMIT
            )
          : await fetchPokemons(
              offset,
              LIMIT
            );

        setItems(data.items);

        setTotalPages(
          Math.ceil(data.count / LIMIT)
        );
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [query, page]);

  return {
    items,
    loading,
    error,
    totalPages,
  };
};

