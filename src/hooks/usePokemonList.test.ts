import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { usePokemonList } from './usePokemonList';
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

const mockListResponse = {
  count: 1302,
  next: 'next-url',
  previous: null,
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ],
};

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
    status: ok ? 200 : 500,
    json: async () => body,
  }) as Response;

describe('usePokemonList', () => {
  let store: ReturnType<typeof makeStore>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    fetchSpy = vi.spyOn(globalThis, 'fetch' as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns loading state initially', () => {
    fetchSpy.mockImplementation(() => new Promise(() => {}) as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper: makeWrapper(store) }
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.totalPages).toBe(1);
  });

  it('returns transformed items on success', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('pikachu');
    expect(result.current.error).toBeNull();
  });

  it('calculates totalPages based on count', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.totalPages).toBe(Math.ceil(1302 / 21));
  });

  it('uses search query when provided', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const { result } = renderHook(
      () => usePokemonList('pika', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=1000'
    );
    expect(result.current.items[0].name).toBe('pikachu');
  });

  it('returns error string when list fetch fails', async () => {
    fetchSpy.mockResolvedValueOnce(makeResponse(null, false) as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(typeof result.current.error).toBe('string');
  });

  it('returns error string when search fetch fails', async () => {
    fetchSpy.mockResolvedValueOnce(makeResponse(null, false) as never);

    const { result } = renderHook(
      () => usePokemonList('pika', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('returns error on network failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('network down') as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('builds correct offset for given page', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse({ count: 0, next: null, previous: null, results: [] }) as never
    );

    renderHook(
      () => usePokemonList('', 3),
      { wrapper: makeWrapper(store) }
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?offset=42&limit=21'
    );
  });

  it('refetch triggers a new fetch', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never)
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const { result } = renderHook(
      () => usePokemonList('', 1),
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
});
