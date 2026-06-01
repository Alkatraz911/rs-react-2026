import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';

import { usePokemonList } from './usePokemonList';
import { usePokemonDetails } from './usePokemonDetails';
import { store } from '../store/store';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('Query Loading States', () => {
  describe('usePokemonList', () => {
    it('should start with loading state true', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.loading).toBe(true);
    });

    it('should have error as null initially', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });

    it('should have items array', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(Array.isArray(result.current.items)).toBe(true);
    });

    it('should have totalPages number', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.totalPages).toBe('number');
    });

    it('should have refetch function', () => {
      const { result } = renderHook(
        () => usePokemonList('', 1),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('usePokemonDetails', () => {
    it('should start with loading state when id provided', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current.loading).toBe(true);
    });

    it('should skip loading when id is undefined', () => {
      const { result } = renderHook(
        () => usePokemonDetails(undefined),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
    });

    it('should have pokemon as null initially', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current.pokemon).toBe(null);
    });

    it('should have refetch function', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });
  });
});

describe('Query Error Handling', () => {
  it('usePokemonDetails should handle undefined id gracefully', () => {
    const { result } = renderHook(
      () => usePokemonDetails(undefined),
      { wrapper }
    );

    expect(result.current.error).toBe(null);
    expect(result.current.pokemon).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('usePokemonList should initialize with empty items', () => {
    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper }
    );

    expect(result.current.items).toEqual([]);
  });
});

describe('Cache Behavior', () => {
  it('usePokemonList should have items array', () => {
    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper }
    );

    expect(Array.isArray(result.current.items)).toBe(true);
  });

  it('usePokemonDetails should maintain loading state across renders', () => {
    const { result, rerender } = renderHook(
      () => usePokemonDetails('1'),
      { wrapper }
    );

    const firstLoading = result.current.loading;

    rerender();

    expect(result.current.loading).toBe(firstLoading);
  });
});
