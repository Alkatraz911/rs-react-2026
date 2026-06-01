import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './api';

const makeStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(pokemonApi.middleware),
  });

const mockListResponse = {
  count: 1302,
  next: 'next-url',
  previous: null,
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  ],
};

const mockPikachuDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  sprites: { front_default: 'pikachu.png' },
  types: [{ type: { name: 'electric' } }],
};

const mockBulbasaurDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  sprites: { front_default: 'bulbasaur.png' },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
};

const makeResponse = (body: unknown, ok = true) =>
  ({
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  }) as Response;

describe('pokemonApi - structure', () => {
  it('has reducerPath', () => {
    expect(pokemonApi.reducerPath).toBe('pokemonApi');
  });

  it('exposes endpoints', () => {
    expect(pokemonApi.endpoints.getPokemonList).toBeDefined();
    expect(pokemonApi.endpoints.getPokemonDetails).toBeDefined();
    expect(pokemonApi.endpoints.searchPokemons).toBeDefined();
  });

  it('exposes hooks', () => {
    expect(pokemonApi.useGetPokemonListQuery).toBeDefined();
    expect(pokemonApi.useGetPokemonDetailsQuery).toBeDefined();
    expect(pokemonApi.useSearchPokemonsQuery).toBeDefined();
  });
});

describe('pokemonApi - getPokemonList queryFn', () => {
  let store: ReturnType<typeof makeStore>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    fetchSpy = vi.spyOn(globalThis, 'fetch' as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns transformed list data on success', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never)
      .mockResolvedValueOnce(makeResponse(mockBulbasaurDetails) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.count).toBe(1302);
    expect(result.data?.next).toBe('next-url');
    expect(result.data?.previous).toBeNull();
    expect(result.data?.items).toHaveLength(2);
    expect(result.data?.items[0]).toEqual({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      height: 4,
      types: ['electric'],
    });
    expect(result.data?.items[1]).toEqual({
      id: 1,
      name: 'bulbasaur',
      image: 'bulbasaur.png',
      height: 7,
      types: ['grass', 'poison'],
    });
  });

  it('builds url with offset and limit', async () => {
    fetchSpy
      .mockResolvedValueOnce(
        makeResponse({ count: 0, next: null, previous: null, results: [] }) as never
      );

    await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 40,
        limit: 21,
      })
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?offset=40&limit=21'
    );
  });

  it('returns error when list fetch fails', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(null, false) as never
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: string }).status).toBe('FETCH_ERROR');
  });

  it('returns error when detail fetch fails', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(null, false) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
  });

  it('returns error on network failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network down') as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect(
      (result.error as { error: string }).error
    ).toContain('Network down');
  });

  it('returns error on non-Error throw', async () => {
    fetchSpy.mockImplementationOnce((() => {
      throw 'plain string error';
    }) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect(
      (result.error as { error: string }).error
    ).toBe('plain string error');
  });

  it('handles unknown error type with default message', async () => {
    fetchSpy.mockImplementationOnce((() => {
      throw { weird: 'object' };
    }) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({
        offset: 0,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect(
      (result.error as { error: string }).error
    ).toContain('unexpected');
  });
});

describe('pokemonApi - getPokemonDetails queryFn', () => {
  let store: ReturnType<typeof makeStore>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    fetchSpy = vi.spyOn(globalThis, 'fetch' as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns transformed pokemon on success', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(mockPikachuDetails) as never
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('25')
    );

    expect(result.data).toEqual({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      height: 4,
      types: ['electric'],
    });
  });

  it('builds url with given id', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(mockPikachuDetails) as never
    );

    await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('25')
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/25'
    );
  });

  it('returns CUSTOM_ERROR when id is undefined', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate(undefined)
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: string }).status).toBe('CUSTOM_ERROR');
    expect((result.error as { error: string }).error).toBe('Pokemon not found');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns error when fetch fails with non-ok status', async () => {
    fetchSpy.mockResolvedValueOnce(makeResponse(null, false) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('999999')
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: string }).status).toBe('FETCH_ERROR');
    expect((result.error as { error: string }).error).toContain('Pokemon not found');
  });

  it('returns error on network failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('No network') as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('25')
    );

    expect(result.error).toBeDefined();
    expect(
      (result.error as { error: string }).error
    ).toBe('No network');
  });

  it('handles pokemon with multiple types', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(mockBulbasaurDetails) as never
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('1')
    );

    expect(result.data?.types).toEqual(['grass', 'poison']);
  });
});

describe('pokemonApi - searchPokemons queryFn', () => {
  let store: ReturnType<typeof makeStore>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    fetchSpy = vi.spyOn(globalThis, 'fetch' as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters by query and returns matched details', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'pika',
        page: 1,
        limit: 20,
      })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.items).toHaveLength(1);
    expect(result.data?.items[0].name).toBe('pikachu');
    expect(result.data?.count).toBe(1);
    expect(result.data?.next).toBeNull();
    expect(result.data?.previous).toBeNull();
  });

  it('is case-insensitive', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(mockPikachuDetails) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'PIKA',
        page: 1,
        limit: 20,
      })
    );

    expect(result.data?.items).toHaveLength(1);
  });

  it('returns empty results when no match', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse(mockListResponse) as never
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'nonexistent',
        page: 1,
        limit: 20,
      })
    );

    expect(result.data?.items).toEqual([]);
    expect(result.data?.count).toBe(0);
  });

  it('paginates filtered results', async () => {
    const manyResults = {
      count: 3,
      next: null,
      previous: null,
      results: [
        { name: 'pidgey', url: 'https://pokeapi.co/api/v2/pokemon/16/' },
        { name: 'pidgeotto', url: 'https://pokeapi.co/api/v2/pokemon/17/' },
        { name: 'pidgeot', url: 'https://pokeapi.co/api/v2/pokemon/18/' },
      ],
    };
    const singleDetail = {
      id: 18,
      name: 'pidgeot',
      height: 15,
      sprites: { front_default: 'pidgeot.png' },
      types: [{ type: { name: 'normal' } }, { type: { name: 'flying' } }],
    };

    fetchSpy
      .mockResolvedValueOnce(makeResponse(manyResults) as never)
      .mockResolvedValueOnce(makeResponse(singleDetail) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'pid',
        page: 2,
        limit: 2,
      })
    );

    expect(result.data?.count).toBe(3);
    expect(result.data?.items).toHaveLength(1);
  });

  it('returns error when list fetch fails', async () => {
    fetchSpy.mockResolvedValueOnce(makeResponse(null, false) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'pika',
        page: 1,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect((result.error as { status: string }).status).toBe('FETCH_ERROR');
    expect((result.error as { error: string }).error).toContain('Search failed');
  });

  it('returns error when detail fetch fails', async () => {
    fetchSpy
      .mockResolvedValueOnce(makeResponse(mockListResponse) as never)
      .mockResolvedValueOnce(makeResponse(null, false) as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'pika',
        page: 1,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
  });

  it('returns error on network failure', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Connection refused') as never);

    const result = await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'pika',
        page: 1,
        limit: 20,
      })
    );

    expect(result.error).toBeDefined();
    expect(
      (result.error as { error: string }).error
    ).toBe('Connection refused');
  });

  it('fetches from full-list endpoint with limit=1000', async () => {
    fetchSpy.mockResolvedValueOnce(
      makeResponse({ ...mockListResponse, results: [] }) as never
    );

    await store.dispatch(
      pokemonApi.endpoints.searchPokemons.initiate({
        query: 'anything',
        page: 1,
        limit: 20,
      })
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=1000'
    );
  });
});
