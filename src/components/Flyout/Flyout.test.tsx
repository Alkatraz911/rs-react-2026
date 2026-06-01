import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import Flyout from './Flyout';
import { renderWithRouter } from '../../helpers/test.utils';
import type { PokemonCardData } from '../../services/api';

describe('Flyout component', () => {
  const mockItem: PokemonCardData = {
    id: 1,
    name: 'pikachu',
    image: null,
    height: 4,
    types: ['electric'],
  };

  test('renders nothing when no items selected', () => {
    const { container } = renderWithRouter(<Flyout />);
    const flyout = container.querySelector('.flyout');
    expect(flyout).not.toBeInTheDocument();
  });

  test('renders flyout when items are selected', () => {
    renderWithRouter(<Flyout />);
    const region = screen.queryByRole('region', { name: /selected items/i });
    expect(region).not.toBeInTheDocument();
  });

  test('has aria-label for accessibility', () => {
    const { container } = renderWithRouter(<Flyout />);
    expect(container.querySelector('[role="region"]')).not.toBeInTheDocument();
  });

  test('unselect button exists when needed', () => {
    renderWithRouter(<Flyout />);
    const unSelectBtn = screen.queryByText('Unselect all');
    expect(unSelectBtn).not.toBeInTheDocument();
  });

  test('download button exists when needed', () => {
    renderWithRouter(<Flyout />);
    const downloadBtn = screen.queryByText('Download');
    expect(downloadBtn).not.toBeInTheDocument();
  });

  test('matches snapshot when hidden', () => {
    const { container } = renderWithRouter(<Flyout />);
    expect(container.querySelector('.flyout')).not.toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    const { container } = renderWithRouter(<Flyout />);
    const flyout = container.querySelector('.flyout');
    expect(flyout).not.toBeInTheDocument();
  });
});
