import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PokemonDetails from './PokemonDetails';
import * as hook from '../../hooks/usePokemonDetails';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

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

const renderComponent = () => {
  return render(<PokemonDetails />);
};

describe('PokemonDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader', () => {
    vi.spyOn(hook, 'usePokemonDetails').mockReturnValue({
      pokemon: null,
      loading: true,
      error: null,
    } as any);

    renderComponent();

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error', () => {
    vi.spyOn(hook, 'usePokemonDetails').mockReturnValue({
      pokemon: null,
      loading: false,
      error: 'Error',
    } as any);

    renderComponent();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('renders pokemon details', () => {
    vi.spyOn(hook, 'usePokemonDetails').mockReturnValue({
      pokemon: {
        id: 1,
        name: 'Pikachu',
        image: 'img.png',
        height: 10,
        types: ['electric'],
      },
      loading: false,
      error: null,
    } as any);

    renderComponent();

    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('navigates back on close', async () => {
    const user = userEvent.setup();

    vi.spyOn(hook, 'usePokemonDetails').mockReturnValue({
      pokemon: {
        id: 1,
        name: 'Pikachu',
        image: 'img.png',
        height: 10,
        types: ['electric'],
      },
      loading: false,
      error: null,
    } as any);

    renderComponent();

    await user.click(screen.getByText(/close/i));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/',
      search: expect.any(String),
    });
  });
});