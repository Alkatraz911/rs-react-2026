import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PokemonCardData, PokemonPageData } from '../services/api';

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  height: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

const transformPokemon = (
  details: PokemonDetailsResponse
): PokemonCardData => ({
  id: details.id,
  name: details.name,
  image: details.sprites.front_default,
  height: details.height,
  types: details.types.map((t) => t.type.name),
});

const fetchPokemonDetails = async (
  url: string
): Promise<PokemonCardData> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch pokemon details');
  }

  const data: PokemonDetailsResponse = await res.json();
  return transformPokemon(data);
};

const cacheTTLMinutes = () => {
  const ttl = import.meta.env.VITE_CACHE_TTL_MINUTES;
  return ttl ? parseInt(ttl, 10) * 60 : 5 * 60;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2',
  }),
  tagTypes: ['Pokemon', 'PokemonList', 'PokemonSearch'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<
      PokemonPageData,
      { offset: number; limit: number }
    >({
      queryFn: async ({ offset, limit }) => {
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
          );

          if (!res.ok) {
            throw new Error(
              `Failed to load pokemon list (${res.status})`
            );
          }

          const data: PokemonListResponse = await res.json();

          const items = await Promise.all(
            data.results.map((pokemon) =>
              fetchPokemonDetails(pokemon.url)
            )
          );

          return {
            data: {
              items,
              next: data.next,
              previous: data.previous,
              count: data.count,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: getErrorMessage(error),
            },
          };
        }
      },
      providesTags: ['PokemonList'],
      keepUnusedDataFor: cacheTTLMinutes(),
    }),

    getPokemonDetails: builder.query<
      PokemonCardData,
      string | undefined
    >({
      queryFn: async (id) => {
        if (!id) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Pokemon not found',
            },
          };
        }

        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );

          if (!res.ok) {
            throw new Error(
              `Pokemon not found (${res.status})`
            );
          }

          const data: PokemonDetailsResponse =
            await res.json();

          return {
            data: transformPokemon(data),
          };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: getErrorMessage(error),
            },
          };
        }
      },
      providesTags: (_result, _error, id) => [
        { type: 'Pokemon', id },
      ],
      keepUnusedDataFor: cacheTTLMinutes(),
    }),

    searchPokemons: builder.query<
      PokemonPageData,
      { query: string; page: number; limit: number }
    >({
      queryFn: async ({ query, page, limit }) => {
        try {
          const res = await fetch(
            'https://pokeapi.co/api/v2/pokemon?limit=1000'
          );

          if (!res.ok) {
            throw new Error(
              `Search failed (${res.status})`
            );
          }

          const data: PokemonListResponse =
            await res.json();

          const filtered = data.results.filter(
            (pokemon) =>
              pokemon.name
                .toLowerCase()
                .includes(query.toLowerCase())
          );

          const offset = (page - 1) * limit;
          const paginated = filtered.slice(
            offset,
            offset + limit
          );

          const items = await Promise.all(
            paginated.map((pokemon) =>
              fetchPokemonDetails(pokemon.url)
            )
          );

          return {
            data: {
              items,
              next: null,
              previous: null,
              count: filtered.length,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: getErrorMessage(error),
            },
          };
        }
      },
      providesTags: ['PokemonSearch'],
      keepUnusedDataFor: cacheTTLMinutes(),
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonsQuery,
  useLazyGetPokemonListQuery,
  useLazyGetPokemonDetailsQuery,
  useLazySearchPokemonsQuery,
} = pokemonApi;
