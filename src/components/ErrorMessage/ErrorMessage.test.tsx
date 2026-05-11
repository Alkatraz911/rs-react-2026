import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage component', () => {
  test('renders error message correctly', () => {
    render(<ErrorMessage message="Something failed" />);

    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  test('renders different error messages', () => {
    render(<ErrorMessage message="Network error" />);

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('handles empty message', () => {
    render(<ErrorMessage message="" />);

    const messageElement = screen.getByTestId('error-message') || 
                          screen.getByRole('alert');

    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveTextContent('');
  });

  test('updates when message prop changes', () => {
    const { rerender } = render(<ErrorMessage message="Old error" />);

    expect(screen.getByText('Old error')).toBeInTheDocument();

    rerender(<ErrorMessage message="New error" />);

    expect(screen.getByText('New error')).toBeInTheDocument();
  });
});