import { render, screen } from '@testing-library/react';
import Card from './Card';
import type { PokemonCardData } from '../../services/api';

describe('Card component', () => {
  const mockItem: PokemonCardData = {
    id: 1,
    name: 'Pikachu',
    image: 'https://example.com/pikachu.png',
    height: 4,
    types: ['electric'],
  };

  test('renders pokemon name', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  test('renders pokemon image with correct src and alt', () => {
    render(<Card item={mockItem} />);

    const image = screen.getByRole('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockItem.image);
    expect(image).toHaveAttribute('alt', mockItem.name);
  });

  test('renders pokemon height', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByText('Height: 4')).toBeInTheDocument();
  });

  test('renders pokemon types', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  test('renders multiple pokemon types', () => {
    const multiTypeItem: PokemonCardData = {
      ...mockItem,
      types: ['electric', 'flying'],
    };

    render(<Card item={multiTypeItem} />);

    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('flying')).toBeInTheDocument();
  });

  test('renders correct number of type elements', () => {
    const multiTypeItem: PokemonCardData = {
      ...mockItem,
      types: ['electric', 'flying'],
    };

    render(<Card item={multiTypeItem} />);

    // Лучше использовать data-testid или role, но если класс обязателен:
    const typeElements = screen.getAllByText(/electric|flying/);
    expect(typeElements).toHaveLength(2);
  });

  test('handles empty types array gracefully', () => {
    const noTypeItem: PokemonCardData = {
      ...mockItem,
      types: [],
    };

    render(<Card item={noTypeItem} />);

    // Проверяем, что карточка всё равно рендерится
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.queryByText('electric')).not.toBeInTheDocument();
  });
});