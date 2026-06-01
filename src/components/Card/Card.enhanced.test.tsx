import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Card from './Card';
import { renderWithRouter } from '../../helpers/test.utils';
import type { PokemonCardData } from '../../services/api';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<
    typeof import('react-router-dom')
  >('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [
      new URLSearchParams('query=pikachu&page=1'),
    ],
  };
});

describe('Card component - Enhanced Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItem: PokemonCardData = {
    id: 25,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
    height: 4,
    types: ['electric'],
  };

  const mockItemMultipleTypes: PokemonCardData = {
    id: 6,
    name: 'charizard',
    image: 'https://example.com/charizard.png',
    height: 17,
    types: ['fire', 'flying'],
  };

  describe('Rendering', () => {
    test('renders pokemon name', () => {
      renderWithRouter(<Card item={mockItem} />);
      expect(screen.getByText('pikachu')).toBeInTheDocument();
    });

    test('renders pokemon height', () => {
      renderWithRouter(<Card item={mockItem} />);
      expect(screen.getByText('Height: 4')).toBeInTheDocument();
    });

    test('renders pokemon image', () => {
      renderWithRouter(<Card item={mockItem} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'https://example.com/pikachu.png');
    });

    test('renders pokemon image alt text', () => {
      renderWithRouter(<Card item={mockItem} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'pikachu');
    });

    test('renders all pokemon types', () => {
      renderWithRouter(<Card item={mockItemMultipleTypes} />);
      expect(screen.getByText('fire')).toBeInTheDocument();
      expect(screen.getByText('flying')).toBeInTheDocument();
    });

    test('renders single type', () => {
      renderWithRouter(<Card item={mockItem} />);
      expect(screen.getByText('electric')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('navigates on button click', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Card item={mockItem} />);

      await user.click(screen.getByRole('button'));

      expect(navigateMock).toHaveBeenCalledWith({
        pathname: '/pokemon/25',
        search: 'query=pikachu&page=1',
      });
    });

    test('navigates with correct pokemon id', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Card item={mockItemMultipleTypes} />);

      await user.click(screen.getByRole('button'));

      expect(navigateMock).toHaveBeenCalledWith({
        pathname: '/pokemon/6',
        search: 'query=pikachu&page=1',
      });
    });

    test('card button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<Card item={mockItem} />);

      const card = container.querySelector('button');
      if (card) {
        await user.type(card, '{enter}');
        expect(navigateMock).toHaveBeenCalled();
      }
    });

    test('card button is focusable', () => {
      renderWithRouter(<Card item={mockItem} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Accessibility', () => {
    test('card is a button element', () => {
      renderWithRouter(<Card item={mockItem} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('image has alt text', () => {
      renderWithRouter(<Card item={mockItem} />);
      const img = screen.getByAltText('pikachu');
      expect(img).toBeInTheDocument();
    });

    test('card has proper ARIA attributes', () => {
      const { container } = renderWithRouter(<Card item={mockItem} />);
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('card has card class', () => {
      const { container } = renderWithRouter(<Card item={mockItem} />);
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    test('types container has types class', () => {
      const { container } = renderWithRouter(<Card item={mockItem} />);
      const types = container.querySelector('.types');
      expect(types).toBeInTheDocument();
    });

    test('type badge has type class', () => {
      const { container } = renderWithRouter(<Card item={mockItem} />);
      const type = container.querySelector('.type');
      expect(type).toBeInTheDocument();
    });
  });

  describe('Different Pokemon', () => {
    test('works with different pokemon', () => {
      const customMon: PokemonCardData = {
        id: 1,
        name: 'bulbasaur',
        image: 'https://example.com/bulbasaur.png',
        height: 7,
        types: ['grass', 'poison'],
      };

      renderWithRouter(<Card item={customMon} />);
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Height: 7')).toBeInTheDocument();
    });

    test('handles pokemon with no image', () => {
      const noimageMon: PokemonCardData = {
        id: 99,
        name: 'kingler',
        image: null,
        height: 13,
        types: ['water'],
      };

      renderWithRouter(<Card item={noimageMon} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'kingler');
    });
  });

  describe('Checkbox Interactions', () => {
    test('checkbox can be toggled', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Card item={mockItem} />);

      const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    test('checkbox click is independent from card click', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Card item={mockItem} />);

      const checkbox = screen.getByRole('checkbox');
      const initialNavigateCalls = navigateMock.mock.calls.length;

      await user.click(checkbox);

      expect(navigateMock.mock.calls.length).toBe(initialNavigateCalls);
    });

    test('checkbox label click does not navigate', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Card item={mockItem} />);

      const label = screen.getByRole('checkbox').closest('.card-checkbox');
      const initialNavigateCalls = navigateMock.mock.calls.length;

      if (label) {
        await user.click(label);
      }

      expect(navigateMock.mock.calls.length).toBe(initialNavigateCalls);
    });

    test('checkbox aria label is correct', () => {
      renderWithRouter(<Card item={mockItem} />);
      const checkbox = screen.getByRole('checkbox', { name: /select pikachu/i });
      expect(checkbox).toHaveAttribute('aria-label', 'Select pikachu');
    });

    test('card element has card class', () => {
      const { container } = renderWithRouter(<Card item={mockItem} />);
      const cardElement = container.querySelector('.card');
      expect(cardElement).toHaveClass('card');
    });
  });
});
