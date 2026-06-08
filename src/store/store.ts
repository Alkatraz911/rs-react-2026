import { configureStore } from '@reduxjs/toolkit';
import selectedReducer from './selectedSlice';
import formsReducer from './formsSlice';
import { pokemonApi } from './api';

export const store = configureStore({
  reducer: {
    selected: selectedReducer,
    forms: formsReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pokemonApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;