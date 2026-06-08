import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordStrength from './PasswordStrength';

describe('PasswordStrength', () => {
  it('renders Empty label for empty password', () => {
    render(<PasswordStrength password="" />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
  });

  it('renders all four criteria items', () => {
    render(<PasswordStrength password="" />);
    expect(screen.getByText('lowercase')).toBeInTheDocument();
    expect(screen.getByText('uppercase')).toBeInTheDocument();
    expect(screen.getByText('number')).toBeInTheDocument();
    expect(screen.getByText('special')).toBeInTheDocument();
  });

  it('marks met criteria with the met modifier class', () => {
    const { container } = render(<PasswordStrength password="aB1!" />);
    const met = container.querySelectorAll('.password-strength__rule--met');
    expect(met.length).toBe(4);
  });

  it('marks zero criteria as met when password only has digits', () => {
    const { container } = render(<PasswordStrength password="123" />);
    const met = container.querySelectorAll('.password-strength__rule--met');
    expect(met.length).toBe(1);
  });

  it('updates the strength label as password gains criteria', () => {
    const { rerender } = render(<PasswordStrength password="a" />);
    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    rerender(<PasswordStrength password="aB1!" />);
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('fills the right number of bar segments', () => {
    const { container } = render(<PasswordStrength password="aB" />);
    const filled = container.querySelectorAll(
      '.password-strength__segment--filled'
    );
    expect(filled.length).toBe(2);
  });
});
