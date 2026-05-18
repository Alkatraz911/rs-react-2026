import { screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';
import { renderWithRouter } from '../../helpers/test.utils';

describe('NotFoundPage', () => {
  test('renders 404 heading', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('renders page not found text', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  test('renders link to home', () => {
    renderWithRouter(<NotFoundPage />);

    const link = screen.getByRole('link', {
      name: /return to home/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});