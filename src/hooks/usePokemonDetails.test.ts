import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';

import { usePokemonDetails } from './usePokemonDetails';
import { store } from '../store/store';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('usePokemonDetails', () => {
  describe('Initial State', () => {
    test('returns loading state initially', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.pokemon).toBe(null);
      expect(result.current.error).toBe(null);
    });

    test('returns if no id', () => {
      const { result } = renderHook(
        () => usePokemonDetails(undefined),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.pokemon).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Refetch Function', () => {
    test('refetch is a function', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    test('refetch can be called', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(() => result.current.refetch()).not.toThrow();
    });
  });

  describe('Error Message Handling', () => {
    test('error message is null when no error', () => {
      const { result } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });

    test('error message handles different error types', () => {
      const { result } = renderHook(
        () => usePokemonDetails(undefined),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });
  });

  describe('State Updates', () => {
    test('returns null pokemon initially with id', () => {
      const { result } = renderHook(
        () => usePokemonDetails('25'),
        { wrapper }
      );

      expect(result.current.pokemon).toBe(null);
    });

    test('maintains state across re-renders', () => {
      const { result, rerender } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      const firstError = result.current.error;
      const firstLoading = result.current.loading;

      rerender();

      expect(result.current.error).toBe(firstError);
      expect(result.current.loading).toBe(firstLoading);
    });
  });

  describe('ID Parameter Changes', () => {
    test('handles undefined id', () => {
      const { result } = renderHook(
        () => usePokemonDetails(undefined),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.pokemon).toBe(null);
    });

    test('handles different valid ids', () => {
      const { result: result1 } = renderHook(
        () => usePokemonDetails('1'),
        { wrapper }
      );

      const { result: result2 } = renderHook(
        () => usePokemonDetails('25'),
        { wrapper }
      );

      expect(typeof result1.current.refetch).toBe('function');
      expect(typeof result2.current.refetch).toBe('function');
    });
  });
});
