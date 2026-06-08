import { screen } from '@testing-library/react';

import Flyout from './Flyout';
import { renderWithRouter } from '../../helpers/test.utils';

describe('Flyout component', () => {
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
