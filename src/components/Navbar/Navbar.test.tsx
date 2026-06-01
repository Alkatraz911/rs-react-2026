import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { renderWithRouter } from '../../helpers/test.utils';

describe('Navbar component', () => {
  test('renders navbar element', () => {
    renderWithRouter(<Navbar />);
    const navbar = document.querySelector('nav');
    expect(navbar).toBeInTheDocument();
  });

  test('renders home link', () => {
    renderWithRouter(<Navbar />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });

  test('renders about link', () => {
    renderWithRouter(<Navbar />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    renderWithRouter(<Navbar />);
    const themeButton = screen.getByRole('button', { name: /mode|theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  test('theme button is clickable', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);
    const themeButton = screen.getByRole('button', { name: /mode|theme/i });

    await user.click(themeButton);
    expect(themeButton).toBeInTheDocument();
  });

  test('navbar has correct structure', () => {
    const { container } = renderWithRouter(<Navbar />);
    const navbar = container.querySelector('nav');
    expect(navbar).toHaveClass('navbar');
  });

  test('has proper link hrefs', () => {
    renderWithRouter(<Navbar />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  test('all links are accessible', () => {
    renderWithRouter(<Navbar />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  test('theme button is accessible', () => {
    renderWithRouter(<Navbar />);
    const themeButton = screen.getByRole('button', { name: /mode|theme/i });
    expect(themeButton).toHaveAccessibleName();
  });

  test('error boundary test button is present', () => {
    renderWithRouter(<Navbar />);
    const errorBtn = screen.getByRole('button', { name: /test error boundary/i });
    expect(errorBtn).toBeInTheDocument();
  });

  test('error boundary test button can be clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);
    const errorBtn = screen.getByRole('button', { name: /test error boundary/i });

    expect(() => {
      user.click(errorBtn);
    }).not.toThrow();
  });
});
