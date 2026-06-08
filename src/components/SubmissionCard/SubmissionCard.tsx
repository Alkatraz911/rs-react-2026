import type { Submission } from '../../store/formsSlice';

interface Props {
  submission: Submission;
  highlighted: boolean;
}

function SubmissionCard({ submission, highlighted }: Props) {
  const className = highlighted
    ? 'submission-card submission-card--new'
    : 'submission-card';

  const sourceLabel =
    submission.source === 'uncontrolled'
      ? 'Uncontrolled'
      : 'React Hook Form';

  return (
    <article
      className={className}
      data-testid="submission-card"
      aria-label={`Submission from ${sourceLabel}`}
    >
      <header className="submission-card__header">
        <span className="submission-card__source">{sourceLabel}</span>
        <time
          className="submission-card__time"
          dateTime={new Date(submission.createdAt).toISOString()}
        >
          {new Date(submission.createdAt).toLocaleString()}
        </time>
      </header>

      {submission.image && (
        <img
          className="submission-card__image"
          src={submission.image}
          alt={`${submission.name}'s upload`}
        />
      )}

      <dl className="submission-card__fields">
        <dt>Name</dt>
        <dd>{submission.name}</dd>
        <dt>Age</dt>
        <dd>{submission.age}</dd>
        <dt>Email</dt>
        <dd>{submission.email}</dd>
        <dt>Gender</dt>
        <dd>{submission.gender}</dd>
        <dt>Country</dt>
        <dd>{submission.country}</dd>
        <dt>Accepted T&amp;C</dt>
        <dd>{submission.acceptedTerms ? 'Yes' : 'No'}</dd>
      </dl>
    </article>
  );
}

export default SubmissionCard;
