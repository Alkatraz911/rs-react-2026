import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PokemonCardData } from '../services/api';

interface SelectedState {
  items: PokemonCardData[];
}

const initialState: SelectedState = {
  items: [],
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    toggleSelected(state, action: PayloadAction<PokemonCardData>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    unselectAll(state) {
      state.items = [];
    },
  },
});

export const { toggleSelected, unselectAll } = selectedSlice.actions;
export default selectedSlice.reducer;