import { screen } from '@testing-library/react';
import CardList from './CardList';
import type { PokemonCardData } from '../../services/api';
import { renderWithRouter } from '../../helpers/test.utils';

describe('CardList component', () => {
  const mockItems: PokemonCardData[] = [
    {
      id: 1,
      name: 'Pikachu',
      image: 'https://example.com/pikachu.png',
      height: 4,
      types: ['electric'],
    },
    {
      id: 2,
      name: 'Charizard',
      image: 'https://example.com/charizard.png',
      height: 17,
      types: ['fire', 'flying'],
    },
  ];

  test('renders all pokemon cards', () => {
    renderWithRouter(<CardList items={mockItems} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  test('renders correct number of cards', () => {
    renderWithRouter(<CardList items={mockItems} />);
    expect(screen.getAllByText(/Pikachu|Charizard/)).toHaveLength(2);
  });

  test('renders pokemon images with correct alt text', () => {
    renderWithRouter(<CardList items={mockItems} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Pikachu');          
    expect(images[1]).toHaveAttribute('alt', 'Charizard');

    expect(screen.getByAltText('Pikachu')).toBeInTheDocument();
    expect(screen.getByAltText('Charizard')).toBeInTheDocument();
  });

  test('renders empty list when no items provided', () => {
    renderWithRouter(<CardList items={[]} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('Pikachu')).not.toBeInTheDocument();
  });

  test('renders results grid container', () => {
    const { container } = renderWithRouter(<CardList items={mockItems} />);
    expect(container.querySelector('.results-grid')).toBeInTheDocument();
  });

  test('renders pokemon types', () => {
    renderWithRouter(<CardList items={mockItems} />);

    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('fire')).toBeInTheDocument();
    expect(screen.getByText('flying')).toBeInTheDocument();
  });
  
});