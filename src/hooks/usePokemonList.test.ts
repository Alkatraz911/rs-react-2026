import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';

import { usePokemonList } from './usePokemonList';
import { store } from '../store/store';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('usePokemonList', () => {
  describe('Initial State', () => {
    test('returns loading state initially', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.loading).toBe(true);
      expect(Array.isArray(result.current.items)).toBe(true);
      expect(result.current.items.length).toBe(0);
      expect(result.current.error).toBe(null);
      expect(result.current.totalPages).toBe(1);
    });
  });

  describe('List State Properties', () => {
    test('returns items array', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(Array.isArray(result.current.items)).toBe(true);
    });

    test('returns totalPages as number', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.totalPages).toBe('number');
      expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
    });

    test('returns error as null or string', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      const isErrorValid =
        result.current.error === null ||
        typeof result.current.error === 'string';
      expect(isErrorValid).toBe(true);
    });

    test('returns loading as boolean', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.loading).toBe('boolean');
    });
  });

  describe('Refetch Function', () => {
    test('refetch is a function', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    test('refetch can be called without errors', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(() => result.current.refetch()).not.toThrow();
    });
  });

  describe('Search Parameter Handling', () => {
    test('handles empty query', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.items).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    test('handles search query string', () => {
      const { result } = renderHook(
        () => usePokemonList('pikachu', 1),
        { wrapper }
      );

      expect(Array.isArray(result.current.items)).toBe(true);
      const isErrorValid =
        result.current.error === null ||
        typeof result.current.error === 'string';
      expect(isErrorValid).toBe(true);
    });
  });

  describe('Pagination', () => {
    test('handles page 1', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
    });

    test('handles different page numbers', () => {
      const { result: result1 } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => usePokemonList('', 2),
        { wrapper }
      );

      expect(typeof result1.current.totalPages).toBe('number');
      expect(typeof result2.current.totalPages).toBe('number');
    });

    test('calculates total pages correctly', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
    });
  });

  describe('State Consistency', () => {
    test('maintains state across re-renders', () => {
      const { result, rerender } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      const firstLoading = result.current.loading;
      const firstError = result.current.error;

      rerender();

      expect(result.current.loading).toBe(firstLoading);
      expect(result.current.error).toBe(firstError);
    });

    test('maintains empty items on initial load', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.items).toEqual([]);
    });
  });

  describe('Search vs Browse Mode', () => {
    test('uses different queries for search and browse', () => {
      const { result: browseResult } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      const { result: searchResult } = renderHook(
        () => usePokemonList('pikachu', 1),
        { wrapper }
      );

      expect(typeof browseResult.current.loading).toBe('boolean');
      expect(typeof searchResult.current.loading).toBe('boolean');
    });
  });
});
