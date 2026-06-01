import { describe, it, expect } from 'vitest';
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
