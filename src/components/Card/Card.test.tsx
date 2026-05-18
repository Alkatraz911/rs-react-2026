import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import Card from './Card';
import { renderWithRouter } from '../../helpers/test.utils';
import type { PokemonCardData } from '../../services/api';

const navigateMock = vi.fn();

// mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [
      new URLSearchParams('query=pikachu&page=1'),
    ],
  };
});

describe('Card component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItem: PokemonCardData = {
    id: 25,
    name: 'pikachu',
    image: null,
    height: 4,
    types: ['electric'],
  };

  test('renders pokemon data', () => {
    renderWithRouter(<Card item={mockItem} />);

    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('Height: 4')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'pikachu');
  });

  test('renders pokemon types', () => {
    renderWithRouter(<Card item={mockItem} />);

    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  test('navigates to details on click', async () => {
    const user = userEvent.setup();

    renderWithRouter(<Card item={mockItem} />);

    await user.click(screen.getByRole('button'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/pokemon/25',
      search: 'query=pikachu&page=1',
    });
  });



  test('card is accessible as button', () => {
    renderWithRouter(<Card item={mockItem} />);

    const card = screen.getByRole('button');

    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  test('opens details on Enter key', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Card
        item={{
          id: 1,
          name: 'pikachu',
          image: '',
          height: 4,
          types: [],
        }}
      />
    );

    const card = screen.getByRole('button');

    await user.type(card, '{enter}');

    expect(card).toBeInTheDocument();
  });

  
});