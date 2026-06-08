import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubmissionCard from './SubmissionCard';
import type { Submission } from '../../store/formsSlice';

const baseSubmission: Submission = {
  id: 'abc',
  source: 'uncontrolled',
  name: 'Anna',
  age: 25,
  email: 'a@b.com',
  gender: 'female',
  acceptedTerms: true,
  password: 'secret',
  country: 'Germany',
  image: '',
  createdAt: Date.now(),
};

describe('SubmissionCard', () => {
  it('renders all submission fields', () => {
    render(
      <SubmissionCard submission={baseSubmission} highlighted={false} />
    );
    expect(screen.getByText('Anna')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('a@b.com')).toBeInTheDocument();
    expect(screen.getByText('female')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('shows "No" when terms not accepted', () => {
    render(
      <SubmissionCard
        submission={{ ...baseSubmission, acceptedTerms: false }}
        highlighted={false}
      />
    );
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders image when present', () => {
    render(
      <SubmissionCard
        submission={{
          ...baseSubmission,
          image: 'data:image/png;base64,xx',
        }}
        highlighted={false}
      />
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,xx');
    expect(img).toHaveAttribute('alt', expect.stringContaining('Anna'));
  });

  it('does not render image when missing', () => {
    render(
      <SubmissionCard submission={baseSubmission} highlighted={false} />
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies highlight class when highlighted prop is true', () => {
    const { container } = render(
      <SubmissionCard submission={baseSubmission} highlighted />
    );
    const article = container.querySelector('article');
    expect(article).toHaveClass('submission-card--new');
  });

  it('does not apply highlight class when highlighted is false', () => {
    const { container } = render(
      <SubmissionCard submission={baseSubmission} highlighted={false} />
    );
    const article = container.querySelector('article');
    expect(article).not.toHaveClass('submission-card--new');
  });

  it('shows the right source label for uncontrolled', () => {
    render(
      <SubmissionCard submission={baseSubmission} highlighted={false} />
    );
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
  });

  it('shows the right source label for hookForm', () => {
    render(
      <SubmissionCard
        submission={{ ...baseSubmission, source: 'hookForm' }}
        highlighted={false}
      />
    );
    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });
});
