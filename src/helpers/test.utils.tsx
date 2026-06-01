import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider } from '../context/ThemeContext';

export const renderWithRouter = (
  ui: ReactElement,
  route = '/'
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};
