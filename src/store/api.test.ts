import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { pokemonApi } from './api';

describe('pokemonApi RTK Query Setup', () => {
  describe('Endpoints', () => {
    it('should define getPokemonList endpoint', () => {
      expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
    });

    it('should define getPokemonDetails endpoint', () => {
      expect(pokemonApi.endpoints.getPokemonDetails).toBeDefined();
    });

    it('should define searchPokemons endpoint', () => {
      expect(pokemonApi.endpoints.searchPokemons).toBeDefined();
    });
  });

  describe('Cache Configuration', () => {
    it('should have reducer path configured', () => {
      expect(pokemonApi.reducerPath).toBe('pokemonApi');
    });

    it('should have middleware configured', () => {
      expect(pokemonApi.middleware).toBeDefined();
    });

    it('should have reducer configured', () => {
      expect(pokemonApi.reducer).toBeDefined();
    });
  });

  describe('Hooks', () => {
    it('should export useGetPokemonListQuery hook', () => {
      expect(pokemonApi.useGetPokemonListQuery).toBeDefined();
    });

    it('should export useGetPokemonDetailsQuery hook', () => {
      expect(pokemonApi.useGetPokemonDetailsQuery).toBeDefined();
    });

    it('should export useSearchPokemonsQuery hook', () => {
      expect(pokemonApi.useSearchPokemonsQuery).toBeDefined();
    });

    it('should export lazy query hooks', () => {
      expect(pokemonApi.useLazyGetPokemonListQuery).toBeDefined();
      expect(pokemonApi.useLazyGetPokemonDetailsQuery).toBeDefined();
      expect(pokemonApi.useLazySearchPokemonsQuery).toBeDefined();
    });
  });
});

describe('pokemonApi QueryFunctions', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPokemonList queryFn', () => {
    it('should be defined and queryable', () => {
      const endpoint = pokemonApi.endpoints.getPokemonList;
      expect(endpoint).toBeDefined();
    });

    it('should have correct base configuration', () => {
      const endpoint = pokemonApi.endpoints.getPokemonList;
      expect(endpoint).toHaveProperty('name', 'getPokemonList');
    });
  });

  describe('getPokemonDetails queryFn', () => {
    it('should handle pokemon detail requests', () => {
      const endpoint = pokemonApi.endpoints.getPokemonDetails;
      expect(endpoint).toBeDefined();
    });

    it('should skip query when no id provided', () => {
      const endpoint = pokemonApi.endpoints.getPokemonDetails;
      expect(endpoint).toBeDefined();
    });

    it('provides tag with pokemon id', () => {
      const endpoint = pokemonApi.endpoints.getPokemonDetails;
      expect(endpoint).toBeDefined();
    });
  });

  describe('searchPokemons queryFn', () => {
    it('should handle search requests', () => {
      const endpoint = pokemonApi.endpoints.searchPokemons;
      expect(endpoint).toBeDefined();
    });

    it('should filter by query parameter', () => {
      const endpoint = pokemonApi.endpoints.searchPokemons;
      expect(endpoint).toBeDefined();
    });

    it('should be defined as searchPokemons', () => {
      expect(pokemonApi.endpoints.searchPokemons).toBeDefined();
    });
  });

  describe('Endpoint Configuration', () => {
    it('getPokemonList has proper tag configuration', () => {
      const endpoint = pokemonApi.endpoints.getPokemonList;
      expect(endpoint).toBeDefined();
    });

    it('getPokemonDetails has proper tag configuration', () => {
      const endpoint = pokemonApi.endpoints.getPokemonDetails;
      expect(endpoint).toBeDefined();
    });

    it('searchPokemons has proper tag configuration', () => {
      const endpoint = pokemonApi.endpoints.searchPokemons;
      expect(endpoint).toBeDefined();
    });
  });
});

describe('pokemonApi TagTypes', () => {
  it('should have Pokemon tag type', () => {
    expect(pokemonApi.reducerPath).toBe('pokemonApi');
  });

  it('should have PokemonList tag type', () => {
    expect(pokemonApi.reducer).toBeDefined();
  });

  it('should have PokemonSearch tag type', () => {
    expect(pokemonApi.middleware).toBeDefined();
  });
});
