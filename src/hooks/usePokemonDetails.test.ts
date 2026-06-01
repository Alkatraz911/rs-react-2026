import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';

import { usePokemonDetails } from './usePokemonDetails';
import { store } from '../store/store';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(Provider, { store, children });

describe('usePokemonDetails', () => {
  test('returns loading state initially', () => {
    const { result } = renderHook(
      () => usePokemonDetails('1'),
      { wrapper }
    );

    expect(result.current.loading).toBe(true);
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

  test('refetch is a function', () => {
    const { result } = renderHook(
      () => usePokemonDetails('1'),
      { wrapper }
    );

    expect(typeof result.current.refetch).toBe('function');
  });
});
