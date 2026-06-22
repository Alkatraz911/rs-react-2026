'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
