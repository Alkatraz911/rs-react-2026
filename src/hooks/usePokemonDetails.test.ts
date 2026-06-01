import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { usePokemonDetails } from './usePokemonDetails';
import { pokemonApi } from '../store/api';
import selectedReducer from '../store/selectedSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
      selected: selectedReducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(pokemonApi.middleware),
  });

const makeWrapper = (store: ReturnType<typeof makeStore>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store, children });

const mockPikachuDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  sprites: { front_default: 'pikachu.png' },
  types: [{ type: { name: 'electric' } }],
};

const makeResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 404,
    json: async () => body,
  }) as Response;

describe('usePokemonDetails', () => {
  let store: ReturnType<typeof makeStore>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    fetchSpy = vi.spyOn(globalThis, 'fetch' as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns loading state initially when id provided', () => {
    fetchSpy.mockImplementation(() => new Promise(() => {}) as never);

    const { result } = renderHook(
      () => usePokemonDetails('25'),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.pokemon).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('does not fetch when id is undefined', () => {
    const { result } = renderHook(
      () => usePokemonDetails(undefined),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.pokemon).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns transformed pokemon on success', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(mockPikachuDetails) as never
    );

    const { result } = renderHook(
      () => usePokemonDetails('25'),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon).toEqual({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      height: 4,
      types: ['electric'],
    });
    expect(result.current.error).toBeNull();
  });

  it('returns error string when fetch fails with non-ok status', async () => {
    fetchSpy.mockResolvedValueOnce(makeResponse(null, false) as never);

    const { result } = renderHook(
      () => usePokemonDetails('999999'),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(typeof result.current.error).toBe('string');
    expect(result.current.pokemon).toBeNull();
  });

  it('returns error on network failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error') as never);

    const { result } = renderHook(
      () => usePokemonDetails('25'),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(typeof result.current.error).toBe('string');
  });

  it('handles different pokemon ids', async () => {
    const bulba = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      sprites: { front_default: 'bulba.png' },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    };
    fetchSpy.mockResolvedValueOnce(makeResponse(bulba) as never);

    const { result } = renderHook(
      () => usePokemonDetails('1'),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon?.id).toBe(1);
    expect(result.current.pokemon?.types).toEqual(['grass', 'poison']);
  });

  it('refetch triggers a new fetch', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const { result } = renderHook(
      () => usePokemonDetails('25'),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const callsBeforeRefetch = fetchSpy.mock.calls.length;

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(callsBeforeRefetch);
    });
  });

  it('handles undefined id without calling fetch', () => {
    const { result } = renderHook(
      () => usePokemonDetails(undefined),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current.error).toBeNull();
    expect(result.current.pokemon).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
