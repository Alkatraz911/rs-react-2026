import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormsPage from './FormsPage';
import { renderWithRouter } from '../../helpers/test.utils';
import { store } from '../../store/store';
import { addSubmission, clearLastSubmission } from '../../store/formsSlice';

const sampleData = {
  name: 'Anna',
  age: 25,
  email: 'a@b.com',
  gender: 'female' as const,
  acceptedTerms: true,
  password: 'Aa1!aa',
  country: 'Germany',
  image: '',
};

describe('FormsPage', () => {
  beforeEach(() => {
    // reset slice between tests by clearing then re-init
    while (store.getState().forms.submissions.length > 0) {
      // wipe via simple clear approach
      store.dispatch({ type: '@@INIT' });
      break;
    }
    store.dispatch(clearLastSubmission());
  });

  it('renders heading and both action buttons', () => {
    renderWithRouter(<FormsPage />);
    expect(
      screen.getByRole('heading', { name: /forms/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open uncontrolled/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open react hook form/i })
    ).toBeInTheDocument();
  });

  it('shows empty state when no submissions exist', () => {
    renderWithRouter(<FormsPage />);
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
  });

  it('opens the uncontrolled modal when its button is clicked', async () => {
    renderWithRouter(<FormsPage />);
    await userEvent.click(
      screen.getByRole('button', { name: /open uncontrolled/i })
    );
    expect(
      screen.getByRole('dialog', { name: /uncontrolled form/i })
    ).toBeInTheDocument();
  });

  it('opens the hook form modal when its button is clicked', async () => {
    renderWithRouter(<FormsPage />);
    await userEvent.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );
    expect(
      screen.getByRole('dialog', { name: /react hook form/i })
    ).toBeInTheDocument();
  });

  it('displays existing submissions from the store', () => {
    store.dispatch(
      addSubmission({ data: sampleData, source: 'uncontrolled' })
    );
    renderWithRouter(<FormsPage />);
    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.queryByText(/no submissions yet/i)).not.toBeInTheDocument();
  });
});
