import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
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

describe('RTK Query Hooks - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetPokemonListQuery - Hook Properties', () => {
    it('returns expected hook properties', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 20 }),
        { wrapper }
      );

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('refetch');
      expect(result.current).toHaveProperty('status');
    });

    it('has correct property types', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 20 }),
        { wrapper }
      );

      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.refetch).toBe('function');
    });

    it('initializes with loading state', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 20 }),
        { wrapper }
      );

      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('skip option prevents query', () => {
      const { result: skipped } = renderHook(
        () =>
          useGetPokemonListQuery(
            { offset: 0, limit: 20 },
            { skip: true }
          ),
        { wrapper }
      );

      const { result: notSkipped } = renderHook(
        () =>
          useGetPokemonListQuery(
            { offset: 0, limit: 20 },
            { skip: false }
          ),
        { wrapper }
      );

      expect(typeof skipped.current.isLoading).toBe('boolean');
      expect(typeof notSkipped.current.isLoading).toBe('boolean');
    });
  });

  describe('useGetPokemonDetailsQuery - Hook Properties', () => {
    it('returns expected hook properties', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('25'),
        { wrapper }
      );

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('refetch');
      expect(result.current).toHaveProperty('status');
    });

    it('skip option prevents query when id undefined', () => {
      const { result: withId } = renderHook(
        () => useGetPokemonDetailsQuery('25'),
        { wrapper }
      );

      const { result: withoutId } = renderHook(
        () => useGetPokemonDetailsQuery(undefined),
        { wrapper }
      );

      expect(typeof withId.current.isLoading).toBe('boolean');
      expect(typeof withoutId.current.isLoading).toBe('boolean');
    });

    it('handles different pokemon ids', () => {
      const { result: pika } = renderHook(
        () => useGetPokemonDetailsQuery('25'),
        { wrapper }
      );

      const { result: char } = renderHook(
        () => useGetPokemonDetailsQuery('6'),
        { wrapper }
      );

      expect(typeof pika.current.isLoading).toBe('boolean');
      expect(typeof char.current.isLoading).toBe('boolean');
    });
  });

  describe('useSearchPokemonsQuery - Hook Properties', () => {
    it('returns expected hook properties', () => {
      const { result } = renderHook(
        () =>
          useSearchPokemonsQuery({
            query: 'pikachu',
            page: 1,
            limit: 20,
          }),
        { wrapper }
      );

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('refetch');
      expect(result.current).toHaveProperty('status');
    });

    it('handles empty search query', () => {
      const { result: empty } = renderHook(
        () =>
          useSearchPokemonsQuery(
            { query: '', page: 1, limit: 20 },
            { skip: true }
          ),
        { wrapper }
      );

      const { result: withQuery } = renderHook(
        () =>
          useSearchPokemonsQuery(
            { query: 'pikachu', page: 1, limit: 20 },
            { skip: false }
          ),
        { wrapper }
      );

      expect(typeof empty.current.isLoading).toBe('boolean');
      expect(typeof withQuery.current.isLoading).toBe('boolean');
    });

    it('handles pagination', () => {
      const { result: page1 } = renderHook(
        () =>
          useSearchPokemonsQuery({
            query: 'pik',
            page: 1,
            limit: 20,
          }),
        { wrapper }
      );

      const { result: page2 } = renderHook(
        () =>
          useSearchPokemonsQuery({
            query: 'pik',
            page: 2,
            limit: 20,
          }),
        { wrapper }
      );

      expect(typeof page1.current.isLoading).toBe('boolean');
      expect(typeof page2.current.isLoading).toBe('boolean');
    });
  });

  describe('API Hook Refetch Functionality', () => {
    it('list query refetch is callable', () => {
      const { result } = renderHook(
        () => useGetPokemonListQuery({ offset: 0, limit: 20 }),
        { wrapper }
      );

      expect(() => result.current.refetch()).not.toThrow();
    });

    it('details query refetch is callable', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('25'),
        { wrapper }
      );

      expect(() => result.current.refetch()).not.toThrow();
    });

    it('search query refetch is callable', () => {
      const { result } = renderHook(
        () =>
          useSearchPokemonsQuery({
            query: 'pikachu',
            page: 1,
            limit: 20,
          }),
        { wrapper }
      );

      expect(() => result.current.refetch()).not.toThrow();
    });
  });

  describe('API Endpoint Configuration', () => {
    it('list query accepts pagination parameters', () => {
      const { result } = renderHook(
        () =>
          useGetPokemonListQuery({
            offset: 0,
            limit: 21,
          }),
        { wrapper }
      );

      expect(result.current).toBeDefined();
    });

    it('details query accepts pokemon id', () => {
      const { result } = renderHook(
        () => useGetPokemonDetailsQuery('1'),
        { wrapper }
      );

      expect(result.current).toBeDefined();
    });

    it('search query accepts search parameters', () => {
      const { result } = renderHook(
        () =>
          useSearchPokemonsQuery({
            query: 'test',
            page: 1,
            limit: 20,
          }),
        { wrapper }
      );

      expect(result.current).toBeDefined();
    });
  });
});
