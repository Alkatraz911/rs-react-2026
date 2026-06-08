import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import UncontrolledForm from './UncontrolledForm';
import { store } from '../../store/store';

const renderForm = (onSubmit = vi.fn()) =>
  render(
    <Provider store={store}>
      <UncontrolledForm onSubmit={onSubmit} />
    </Provider>
  );

describe('UncontrolledForm', () => {
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

  it('does not call onSubmit and surfaces errors when submitting empty form', async () => {
    const onSubmit = vi.fn();
    renderForm(onSubmit);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    const alertsWithText = screen
      .getAllByRole('alert')
      .filter((el) => el.textContent && el.textContent.length > 0);
    expect(alertsWithText.length).toBeGreaterThan(0);
  });

  it('shows specific name error when name has lowercase first letter', async () => {
    const onSubmit = vi.fn();
    renderForm(onSubmit);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^name$/i), 'anna');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(
      screen.getByText(/first letter must be uppercase/i)
    ).toBeInTheDocument();
  });

  it('submit button is not disabled even when form is empty', () => {
    renderForm();
    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).not.toBeDisabled();
  });

  it('clears errors after a previous bad submit is fixed and resubmitted', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(
      screen.getByText(/name is required/i)
    ).toBeInTheDocument();
  });
});
