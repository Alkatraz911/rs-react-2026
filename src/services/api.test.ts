import { vi } from 'vitest';
import { fetchPokemons, searchPokemons } from './api';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  const mockFetchResponses = (responses: any[]) => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    responses.forEach((response) => {
      fetchSpy.mockResolvedValueOnce(response as Response);
    });
    return fetchSpy;
  };

  describe('fetchPokemons', () => {
    test('returns correctly transformed pokemon data', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [
              { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
            ],
            next: 'next-page',
            previous: null,
          }),
        },
        {
          ok: true,
          json: async () => ({
            id: 25,
            name: 'pikachu',
            height: 4,
            sprites: { front_default: 'pikachu.png' },
            types: [{ type: { name: 'electric' } }],
          }),
        },
      ]);

      const result = await fetchPokemons();

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: 25,
        name: 'pikachu',
        image: 'pikachu.png',
        height: 4,
        types: ['electric'],
      });
      expect(result.next).toBe('next-page');
      expect(result.previous).toBeNull();
    });

    test('throws error when main list request fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(fetchPokemons()).rejects.toThrow('Failed to fetch pokemons');
    });

    test('throws error when pokemon details request fails', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [{ name: 'pikachu', url: 'https://...' }],
            next: null,
            previous: null,
          }),
        },
        {
          ok: false,
        } as Response,
      ]);

      await expect(fetchPokemons()).rejects.toThrow('Failed details');
    });
  });

  describe('searchPokemons', () => {
    test('returns filtered pokemons', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [
              { name: 'pikachu', url: 'https://...' },
              { name: 'bulbasaur', url: 'https://...' },
            ],
          }),
        },
        {
          ok: true,
          json: async () => ({
            id: 25,
            name: 'pikachu',
            height: 4,
            sprites: { front_default: 'pikachu.png' },
            types: [{ type: { name: 'electric' } }],
          }),
        },
      ]);

      const result = await searchPokemons('pika');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('pikachu');
    });

    test('is case insensitive', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [{ name: 'Pikachu', url: 'https://...' }],
          }),
        },
        {
          ok: true,
          json: async () => ({
            id: 25,
            name: 'Pikachu',
            height: 4,
            sprites: { front_default: 'pikachu.png' },
            types: [],
          }),
        },
      ]);

      const result = await searchPokemons('PIKA');
      expect(result.items).toHaveLength(1);
    });

    test('returns empty array when no matches found', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [{ name: 'bulbasaur', url: 'https://...' }],
          }),
        },
      ]);

      const result = await searchPokemons('pikachu');
      expect(result.items).toEqual([]);
    });

    test('throws error when search request fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(searchPokemons('pikachu')).rejects.toThrow('Search failed');
    });

    test('throws error when details request fails', async () => {
      mockFetchResponses([
        {
          ok: true,
          json: async () => ({
            results: [{ name: 'pikachu', url: 'https://...' }],
          }),
        },
        { ok: false } as Response,
      ]);

      await expect(searchPokemons('pikachu')).rejects.toThrow('Failed details');
    });
  });
});