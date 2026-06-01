import { useGetPokemonDetailsQuery } from '../store/api';
import type { PokemonCardData } from '../services/api';

interface ReturnType {
  pokemon: PokemonCardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePokemonDetails = (
  id: string | undefined
): ReturnType => {
  const { data, isLoading, error, refetch } =
    useGetPokemonDetailsQuery(id, {
      skip: !id,
    });

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

    return 'Failed to load pokemon';
  };

  return {
    pokemon: data || null,
    loading: isLoading,
    error: getErrorMessage(),
    refetch: () => refetch(),
  };
};

