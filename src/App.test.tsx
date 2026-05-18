
import {
  screen,
  waitFor,
  act,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { useLocation } from 'react-router-dom';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import {
  fetchPokemons,
  searchPokemons,
} from './services/api';

import { renderWithRouter } from './helpers/test.utils';

vi.mock('./services/api', () => ({
  fetchPokemons: vi.fn(),
  searchPokemons: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchPokemons);
const mockedSearch = vi.mocked(searchPokemons);

function LocationDisplay() {
  const location = useLocation();

  return (
    <div data-testid="location">
      {location.search}
    </div>
  );
}

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('loads initial data (fetchPokemons)', async () => {
    mockedFetch.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'pikachu',
          image: null,
          height: 4,
          types: [],
        },
      ],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalled();
    });

    expect(mockedSearch).not.toHaveBeenCalled();
  });

  test('loads search data from URL/localStorage is NOT used for search', async () => {
    localStorage.setItem('search', 'pikachu');

    mockedFetch.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'pikachu',
          image: null,
          height: 4,
          types: [],
        },
      ],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalled();
    });

    expect(mockedSearch).not.toHaveBeenCalled();
  });

  test('saves search to localStorage', async () => {
    const user = userEvent.setup();

    mockedSearch.mockResolvedValue({
      items: [],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'pikachu');

    await user.click(
      screen.getByRole('button', { name: /search/i })
    );

    expect(localStorage.getItem('search')).toBe('pikachu');
  });

  test('renders loader', () => {
    mockedFetch.mockResolvedValue({
      items: [],
      next: null,
      previous: null,
      count: 1,
    });

    const { container } = renderWithRouter(<App />);

    expect(
      container.querySelector('.loader')
    ).toBeInTheDocument();
  });

  test('renders API error', async () => {
    mockedFetch.mockRejectedValue(new Error('API error'));

    renderWithRouter(<App />);

    expect(
      await screen.findByText(/failed to load data/i)
    ).toBeInTheDocument();
  });

  test('renders pokemon list', async () => {
    mockedFetch.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'pikachu',
          image: null,
          height: 4,
          types: [],
        },
      ],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    expect(await screen.findByText('pikachu')).toBeInTheDocument();
  });

  test('shows fallback UI on error boundary', async () => {
    const user = userEvent.setup();

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    const btn = screen.getByRole('button', {
      name: /test error/i,
    });

    await act(async () => {
      await user.click(btn);
    });

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test('renders pagination buttons', async () => {
    mockedFetch.mockResolvedValue({
      items: Array.from({ length: 3 }, (_, i) => ({
        id: i,
        name: `poke-${i}`,
        image: null,
        height: 1,
        types: [],
      })),
      next: 'next',
      previous: null,
      count: 40,
    });

    renderWithRouter(<App />);

    expect(await screen.findByText('Next')).toBeInTheDocument();
  });

  test('pagination updates URL', async () => {
    const user = userEvent.setup();

    mockedFetch.mockResolvedValue({
      items: Array.from({ length: 20 }, (_, i) => ({
        id: i,
        name: `poke-${i}`,
        image: null,
        height: 1,
        types: [],
      })),
      next: 'next',
      previous: null,
      count: 40,
    });

    renderWithRouter(
      <>
        <App />
        <LocationDisplay />
      </>
    );

    const page2 = await screen.findByRole('button', {
      name: '2',
    });

    await user.click(page2);

    expect(
      screen.getByTestId('location')
    ).toHaveTextContent('page=2');
  });

  test('shows empty state', async () => {
    const user = userEvent.setup();

    mockedSearch.mockResolvedValue({
      items: [],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'unknownpokemon123');

    await user.click(
      screen.getByRole('button', { name: /search/i })
    );

    expect(
      document.querySelector('.results-grid')
    ).toBeEmptyDOMElement();
  });

  test('does not duplicate search (UI behavior)', async () => {
    const user = userEvent.setup();

    mockedSearch.mockResolvedValue({
      items: [
        {
          id: 1,
          name: 'pikachu',
          image: null,
          height: 4,
          types: [],
        },
      ],
      next: null,
      previous: null,
      count: 1,
    });

    renderWithRouter(<App />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'pikachu');

    const searchBtn = screen.getByRole('button', {
      name: /search/i,
    });

    await user.click(searchBtn);
    await user.click(searchBtn);

    expect(mockedSearch).toHaveBeenCalledTimes(1);
  });
});

