import { screen } from '@testing-library/react';
import AboutPage from './AboutPage';
import { renderWithRouter } from '../../helpers/test.utils';

describe('AboutPage', () => {
  test('renders main heading', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText('About Application')).toBeInTheDocument();
  });

  test('renders description text', () => {
    renderWithRouter(<AboutPage />);
    expect(
      screen.getByText(/pokemon explorer built with react/i)
    ).toBeInTheDocument();
  });

  test('renders author name', () => {
    renderWithRouter(<AboutPage />);
    expect(screen.getByText(/alkatraz911/i)).toBeInTheDocument();
  });

  test('renders external link', () => {
    renderWithRouter(<AboutPage />);
    const link = screen.getByRole('link', {
      name: /rs school react course/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});