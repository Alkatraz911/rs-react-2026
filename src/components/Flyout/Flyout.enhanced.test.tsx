import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Flyout from './Flyout';
import { renderWithRouter } from '../../helpers/test.utils';
import { store } from '../../store/store';
import { toggleSelected, unselectAll } from '../../store/selectedSlice';
import type { PokemonCardData } from '../../services/api';

describe('Flyout component - Enhanced Tests', () => {
  const mockPokemon: PokemonCardData = {
    id: 25,
    name: 'pikachu',
    image: null,
    height: 4,
    types: ['electric'],
  };

  const mockPokemon2: PokemonCardData = {
    id: 6,
    name: 'charizard',
    image: null,
    height: 17,
    types: ['fire', 'flying'],
  };

  beforeEach(() => {
    store.dispatch(unselectAll());
    vi.clearAllMocks();
  });

  describe('Visibility', () => {
    test('renders nothing when no items selected', () => {
      const { container } = renderWithRouter(<Flyout />);
      const flyout = container.querySelector('.flyout');
      expect(flyout).not.toBeInTheDocument();
    });

    test('shows flyout when items are selected', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      const flyout = container.querySelector('.flyout');
      expect(flyout).toBeInTheDocument();
    });

    test('shows flyout with multiple selections', () => {
      store.dispatch(toggleSelected(mockPokemon));
      store.dispatch(toggleSelected(mockPokemon2));
      const { container } = renderWithRouter(<Flyout />);
      const flyout = container.querySelector('.flyout');
      expect(flyout).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    test('displays count for single item', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      expect(screen.getByText('1 item selected')).toBeInTheDocument();
    });

    test('displays correct count for multiple items', () => {
      store.dispatch(toggleSelected(mockPokemon));
      store.dispatch(toggleSelected(mockPokemon2));
      renderWithRouter(<Flyout />);
      expect(screen.getByText('2 items selected')).toBeInTheDocument();
    });

    test('uses plural for items count', () => {
      store.dispatch(toggleSelected(mockPokemon));
      store.dispatch(toggleSelected(mockPokemon2));
      renderWithRouter(<Flyout />);
      const count = screen.getByText(/items selected/);
      expect(count).toBeInTheDocument();
    });

    test('uses singular for single item', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      const count = screen.getByText(/item selected/);
      expect(count).toBeInTheDocument();
    });
  });

  describe('Buttons', () => {
    test('renders unselect button when items selected', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      expect(screen.getByText('Unselect all')).toBeInTheDocument();
    });

    test('renders download button when items selected', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      expect(screen.getByText('Download')).toBeInTheDocument();
    });

    test('buttons are clickable', async () => {
      const user = userEvent.setup();
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);

      const unselectBtn = screen.getByText('Unselect all');
      expect(unselectBtn).toBeInTheDocument();
      await user.click(unselectBtn);
      expect(screen.queryByText('Unselect all')).not.toBeInTheDocument();
    });

    test('unselect button clears selections', async () => {
      const user = userEvent.setup();
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);

      let flyout = container.querySelector('.flyout');
      expect(flyout).toBeInTheDocument();

      const unselectBtn = screen.getByText('Unselect all');
      await user.click(unselectBtn);

      flyout = container.querySelector('.flyout');
      expect(flyout).not.toBeInTheDocument();
    });

    test('download button has correct styling', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      const downloadBtn = container.querySelector('.flyout-btn--download');
      expect(downloadBtn).toBeInTheDocument();
    });

    test('unselect button has correct styling', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      const unselectBtn = container.querySelector('.flyout-btn--unselect');
      expect(unselectBtn).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('flyout has region role', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      const region = screen.getByRole('region', { name: /selected items/i });
      expect(region).toBeInTheDocument();
    });

    test('buttons are accessible', async () => {
      const user = userEvent.setup();
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      for (const btn of buttons) {
        expect(btn).toBeEnabled();
      }
    });

    test('has proper ARIA label', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute(
        'aria-label',
        'Selected items'
      );
    });
  });

  describe('CSS Classes', () => {
    test('has flyout class', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      expect(container.querySelector('.flyout')).toBeInTheDocument();
    });

    test('has flyout-count class', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      expect(container.querySelector('.flyout-count')).toBeInTheDocument();
    });

    test('has flyout-actions class', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      expect(container.querySelector('.flyout-actions')).toBeInTheDocument();
    });

    test('has flyout-btn class on buttons', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      const buttons = container.querySelectorAll('.flyout-btn');
      expect(buttons.length).toBe(2);
    });
  });

  describe('State Synchronization', () => {
    test('updates when selection changes', () => {
      const { container } = renderWithRouter(<Flyout />);
      let flyout = container.querySelector('.flyout');
      expect(flyout).not.toBeInTheDocument();

      act(() => {
        store.dispatch(toggleSelected(mockPokemon));
      });
      flyout = container.querySelector('.flyout');
      expect(flyout).toBeInTheDocument();
      expect(screen.getByText('1 item selected')).toBeInTheDocument();
    });

    test('handles rapid selections', () => {
      store.dispatch(toggleSelected(mockPokemon));
      store.dispatch(toggleSelected(mockPokemon2));
      store.dispatch(toggleSelected(mockPokemon));

      const { container } = renderWithRouter(<Flyout />);
      const flyout = container.querySelector('.flyout');
      expect(flyout).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    test('download button is enabled when items selected', () => {
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);

      const downloadBtn = screen.getByText('Download');
      expect(downloadBtn).toBeEnabled();
    });

    test('download button can be clicked', async () => {
      const user = userEvent.setup();
      store.dispatch(toggleSelected(mockPokemon));
      renderWithRouter(<Flyout />);

      const downloadBtn = screen.getByText('Download');
      await user.click(downloadBtn);
      expect(downloadBtn).toBeInTheDocument();
    });

    test('download button has download class', () => {
      store.dispatch(toggleSelected(mockPokemon));
      const { container } = renderWithRouter(<Flyout />);
      const downloadBtn = container.querySelector('.flyout-btn--download');
      expect(downloadBtn).toBeInTheDocument();
      expect(downloadBtn).toHaveClass('flyout-btn');
    });

    test('download is available with multiple selections', async () => {
      store.dispatch(toggleSelected(mockPokemon));
      store.dispatch(toggleSelected(mockPokemon2));
      renderWithRouter(<Flyout />);

      const downloadBtn = screen.getByText('Download');
      expect(downloadBtn).toBeInTheDocument();
      expect(downloadBtn).toBeEnabled();
    });
  });
});
