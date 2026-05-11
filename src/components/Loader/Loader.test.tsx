import { render, screen } from '@testing-library/react';
import Loader from './Loader';


describe('Loader component', () => {
  test('renders loader correctly', () => {
    render(<Loader />);

    const loader = screen.getByTestId('loader');

    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('loader');
  });

  test('renders only one loader', () => {
    render(<Loader />);
    expect(screen.getAllByTestId('loader')).toHaveLength(1);
  });
});