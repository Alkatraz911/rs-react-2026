import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { usePokemonList } from './usePokemonList';
import { usePokemonDetails } from './usePokemonDetails';
import { store } from '../store/store';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('Hook Error Message Handling', () => {
  describe('usePokemonList error handling', () => {
    test('handles null error gracefully', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });

    test('returns items array even with no data', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(Array.isArray(result.current.items)).toBe(true);
    });

    test('calculates total pages from data', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.totalPages).toBe('number');
      expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
    });

    test('refetch function is available', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
      expect(() => result.current.refetch()).not.toThrow();
    });

    test('handles search query switching', () => {
      const { result: browseResult } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      const { result: searchResult } = renderHook(
        () => usePokemonList('test', 1),
        { wrapper }
      );

      expect(typeof browseResult.current.loading).toBe('boolean');
      expect(typeof searchResult.current.loading).toBe('boolean');
    });
  });

  describe('usePokemonDetails error handling', () => {
    test('handles null error gracefully', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });

    test('returns null pokemon with undefined id', () => {
      const { result } = renderHook(
        () => usePokemonDetails(undefined),
        { wrapper }
      );

      expect(result.current.pokemon).toBe(null);
      expect(result.current.loading).toBe(false);
    });

    test('refetch function is available', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
      expect(() => result.current.refetch()).not.toThrow();
    });

    test('handles id parameter changes', () => {
      const { result: result1 } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => usePokemonDetails('25'),
        { wrapper }
      );

      expect(result1.current.pokemon).toBe(null);
      expect(result2.current.pokemon).toBe(null);
    });

    test('maintains state consistency', () => {
      const { result, rerender } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      const initialError = result.current.error;
      const initialLoading = result.current.loading;

      rerender();

      expect(result.current.error).toBe(initialError);
      expect(result.current.loading).toBe(initialLoading);
    });
  });

  describe('Error Type Handling', () => {
    test('usePokemonList return type structure', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('totalPages');
      expect(result.current).toHaveProperty('refetch');
    });

    test('usePokemonDetails return type structure', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current).toHaveProperty('pokemon');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
    });
  });
});
