import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import HookForm from './HookForm';
import { store } from '../../store/store';

const renderForm = (onSubmit = vi.fn()) =>
  render(
    <Provider store={store}>
      <HookForm onSubmit={onSubmit} />
    </Provider>
  );

describe('HookForm', () => {
  it('renders all labelled fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i accept/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
  });

  it('disables the submit button on initial mount when form is invalid', async () => {
    renderForm();
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeDisabled();
    });
  });

  it('shows validation error after the user touches an invalid field', async () => {
    renderForm();
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/^name$/i);
    await user.type(nameInput, 'anna');
    await waitFor(() => {
      expect(
        screen.getByText(/first letter must be uppercase/i)
      ).toBeInTheDocument();
    });
  });

  it('does not show error before the user touches a field', () => {
    renderForm();
    expect(
      screen.queryByText(/first letter must be uppercase/i)
    ).not.toBeInTheDocument();
  });

  it('shows email error after typing invalid email', async () => {
    renderForm();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^email$/i), 'bad');
    await waitFor(() => {
      expect(screen.getByText(/email is not valid/i)).toBeInTheDocument();
    });
  });
});
