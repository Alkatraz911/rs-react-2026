import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { usePokemonDetails } from './usePokemonDetails';
import * as api from '../services/api';
import { PokemonCardData } from '../services/api';

vi.mock('../services/api');

describe('usePokemonDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns loading state initially', () => {
    (api.fetchPokemonById as any).mockResolvedValue({
      id: 1,
      name: 'pikachu',
    });

    const { result } = renderHook(() => usePokemonDetails('1'));

    expect(result.current.loading).toBe(true);
  });

  test('returns pokemon on success', async () => {
    (api.fetchPokemonById as any).mockResolvedValue({
      id: 1,
      name: 'pikachu',
    });

    const { result } = renderHook(() => usePokemonDetails('1'));

    await waitFor(() => {
      expect(result.current.pokemon).toBeTruthy();
    });

    expect(result.current.error).toBe(null);
  });

    test('returns if no id', async () => {
    (api.fetchPokemonById as any).mockResolvedValue({
      id: 1,
      name: 'pikachu',
    });

    const { result } = renderHook(() => usePokemonDetails(undefined));

    await waitFor(() => {
      expect(result.current.pokemon).toBe(null);
    });

    expect(result.current.error).toBe(null);
  });

  test('returns error on failure', async () => {
    (api.fetchPokemonById as any).mockRejectedValue(
      new Error('Failed')
    );

    const { result } = renderHook(() => usePokemonDetails('1'));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });
});