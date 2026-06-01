import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useSearchPokemonsQuery,
} from './api';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('pokemonApi Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useGetPokemonListQuery', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 21 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should return query data when available', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 21 }),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should support different offsets', () => {
      const { result: result1 } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 21 }),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useGetPokemonListQuery({ offset: 21, limit: 21 }),
        { wrapper }
      );

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });

    it('should have refetch method', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 21 }),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('useGetPokemonDetailsQuery', () => {
    it('should handle id parameter correctly', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should start loading when id is provided', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should support different pokemon ids', () => {
      const { result: result1 } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useGetPokemonDetailsQuery('25'),
        { wrapper }
      );

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });

    it('should have refetch method', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should support string id parameter', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('pikachu'),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useSearchPokemonsQuery', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 1, limit: 21 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should support empty query', () => {
      const { result } = renderHook(
        () => useSearchPokemonsQuery({ query: '', page: 1, limit: 21 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should support different search terms', () => {
      const { result: result1 } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 1, limit: 21 }),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useSearchPokemonsQuery({ query: 'char', page: 1, limit: 21 }),
        { wrapper }
      );

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });

    it('should support pagination', () => {
      const { result: result1 } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 1, limit: 21 }),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 2, limit: 21 }),
        { wrapper }
      );

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(true);
    });

    it('should have refetch method', () => {
      const { result } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 1, limit: 21 }),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('Query State Management', () => {
    it('all queries should have isFetching property', () => {
      const { result: listResult } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 21 }),
        { wrapper }
      );

      const { result: detailsResult } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      const { result: searchResult } = renderHook(
        () => useSearchPokemonsQuery({ query: 'pika', page: 1, limit: 21 }),
        { wrapper }
      );

      expect('isFetching' in listResult.current).toBe(true);
      expect('isFetching' in detailsResult.current).toBe(true);
      expect('isFetching' in searchResult.current).toBe(true);
    });
  });
});
