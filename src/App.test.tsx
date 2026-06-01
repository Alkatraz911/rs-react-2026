import { screen } from '@testing-library/react';
import { renderWithRouter } from './helpers/test.utils';
import App from './App';

describe('App component', () => {
  test('renders navbar', () => {
    renderWithRouter(<App />);
    const navbar = document.querySelector('nav');
    expect(navbar).toBeInTheDocument();
  });

  test('renders app layout', () => {
    renderWithRouter(<App />);
    const layout = document.querySelector('.app-layout');
    expect(layout).toBeInTheDocument();
  });

  test('renders search component', () => {
    renderWithRouter(<App />);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders home page content', () => {
    renderWithRouter(<App />);
    const appDiv = document.querySelector('.app');
    expect(appDiv).toBeInTheDocument();
  });
});
