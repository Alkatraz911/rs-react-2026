import {
  useEffect,
  useState,
} from 'react';

import {
  fetchPokemonById,
  type PokemonCardData,
} from '../services/api';

interface ReturnType {
  pokemon: PokemonCardData | null;
  loading: boolean;
  error: string | null;
}

export const usePokemonDetails = (
  id: string | undefined
): ReturnType => {
  const [pokemon, setPokemon] =
    useState<PokemonCardData | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await fetchPokemonById(id);

        setPokemon(data);
      } catch {
        setError(
          'Failed to load pokemon'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [id]);

  return {
    pokemon,
    loading,
    error,
  };
};

