import { describe, it, expect } from 'vitest';
import selectedReducer, {
  toggleSelected,
  unselectAll,
} from './selectedSlice';
import type { PokemonCardData } from '../services/api';

describe('selectedSlice', () => {
  const mockPokemon: PokemonCardData = {
    id: 1,
    name: 'pikachu',
    image: null,
    height: 4,
    types: ['electric'],
  };

  const mockPokemon2: PokemonCardData = {
    id: 2,
    name: 'charizard',
    image: null,
    height: 17,
    types: ['fire', 'flying'],
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = selectedReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({ items: [] });
    });
  });

  describe('toggleSelected', () => {
    it('should add pokemon to items when not present', () => {
      const previousState = { items: [] };
      const state = selectedReducer(
        previousState,
        toggleSelected(mockPokemon)
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemon);
    });

    it('should remove pokemon from items when already present', () => {
      const previousState = { items: [mockPokemon] };
      const state = selectedReducer(
        previousState,
        toggleSelected(mockPokemon)
      );
      expect(state.items).toHaveLength(0);
    });

    it('should handle multiple pokemon', () => {
      let state: ReturnType<typeof selectedReducer> = { items: [] };
      state = selectedReducer(state, toggleSelected(mockPokemon));
      state = selectedReducer(state, toggleSelected(mockPokemon2));
      expect(state.items).toHaveLength(2);
      expect(state.items).toContainEqual(mockPokemon);
      expect(state.items).toContainEqual(mockPokemon2);
    });

    it('should toggle between add and remove', () => {
      let state: ReturnType<typeof selectedReducer> = { items: [] };
      state = selectedReducer(state, toggleSelected(mockPokemon));
      expect(state.items).toHaveLength(1);
      state = selectedReducer(state, toggleSelected(mockPokemon));
      expect(state.items).toHaveLength(0);
    });
  });

  describe('unselectAll', () => {
    it('should clear all items', () => {
      const previousState = {
        items: [mockPokemon, mockPokemon2],
      };
      const state = selectedReducer(previousState, unselectAll());
      expect(state.items).toEqual([]);
    });

    it('should handle already empty state', () => {
      const previousState = { items: [] };
      const state = selectedReducer(previousState, unselectAll());
      expect(state.items).toEqual([]);
    });
  });

  describe('combined operations', () => {
    it('should maintain state consistency', () => {
      let state: ReturnType<typeof selectedReducer> = { items: [] };

      state = selectedReducer(state, toggleSelected(mockPokemon));
      expect(state.items).toHaveLength(1);

      state = selectedReducer(state, toggleSelected(mockPokemon2));
      expect(state.items).toHaveLength(2);

      state = selectedReducer(state, toggleSelected(mockPokemon));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPokemon2);

      state = selectedReducer(state, unselectAll());
      expect(state.items).toEqual([]);
    });
  });
});
