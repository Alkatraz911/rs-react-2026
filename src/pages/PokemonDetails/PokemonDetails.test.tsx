import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, afterEach } from 'vitest';

import PokemonDetails from './PokemonDetails';
import * as hook from '../../hooks/usePokemonDetails';

import type { PokemonCardData } from '../../services/api';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: '1' }),
    useSearchParams: () => [
      new URLSearchParams('query=pika&page=2'),
      vi.fn(),
    ],
  };
});

const pokemonMock: PokemonCardData = {
  id: 1,
  name: 'Pikachu',
  image: null,
  height: 10,
  types: ['electric'],
};

const createHookState = (
  overrides = {}
) => ({
  pokemon: null,
  loading: false,
  error: null,
  refetch: vi.fn(),
  ...overrides,
});

const renderComponent = () => {
  return render(<PokemonDetails />);
};

describe('PokemonDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader', () => {
    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          loading: true,
        })
      );

    renderComponent();

    expect(
      screen.getByTestId('loader')
    ).toBeInTheDocument();
  });

  it('renders error', () => {
    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          error: 'Error',
        })
      );

    renderComponent();

    expect(
      screen.getByText(/error/i)
    ).toBeInTheDocument();
  });

  it('renders pokemon details', () => {
    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon: pokemonMock,
        })
      );

    renderComponent();

    expect(
      screen.getByText(/pikachu/i)
    ).toBeInTheDocument();
  });

  it('navigates back on close', async () => {
    const user = userEvent.setup();

    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon: pokemonMock,
        })
      );

    renderComponent();

    await user.click(
      screen.getByText(/close/i)
    );

    expect(navigateMock)
      .toHaveBeenCalledWith({
        pathname: '/',
        search: expect.any(String),
      });
  });

  it('renders pokemon height', () => {
    const pokemon = {
      ...pokemonMock,
      height: 20,
    };

    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon,
        })
      );

    renderComponent();

    expect(
      screen.getByText(/height:\s*20/i)
    ).toBeInTheDocument();
  });

  it('renders pokemon types', () => {
    const pokemon = {
      ...pokemonMock,
      types: ['electric', 'flying'],
    };

    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon,
        })
      );

    renderComponent();

    expect(
      screen.getByText(/electric/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/flying/i)
    ).toBeInTheDocument();
  });

  it('renders error with refresh button', () => {
    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          error: 'Network error',
        })
      );

    renderComponent();

    expect(
      screen.getByText(/network error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try again/i)
    ).toBeInTheDocument();
  });

  it('refresh button calls refetch', async () => {
    const user = userEvent.setup();
    const refetchMock = vi.fn();

    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          error: 'Error',
          refetch: refetchMock,
        })
      );

    renderComponent();

    const refreshBtn = screen.getByText(/try again/i);
    await user.click(refreshBtn);

    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders details header', () => {
    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon: pokemonMock,
        })
      );

    const { container } = render(<PokemonDetails />);
    expect(
      container.querySelector('.details-header')
    ).toBeInTheDocument();
  });

  it('renders pokemon image', () => {
    const pokemon = {
      ...pokemonMock,
      image: 'https://example.com/image.png',
    };

    vi.spyOn(hook, 'usePokemonDetails')
      .mockReturnValue(
        createHookState({
          pokemon,
        })
      );

    renderComponent();

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
  });
});