import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import SubmissionCard from '../../components/SubmissionCard/SubmissionCard';
import { useAppSelector } from '../../store/hooks';

type FormVariant = 'uncontrolled' | 'hookForm';

function FormsPage() {
  const [openVariant, setOpenVariant] =
    useState<FormVariant | null>(null);

  const submissions = useAppSelector(
    (state) => state.forms.submissions
  );
  const lastSubmissionId = useAppSelector(
    (state) => state.forms.lastSubmissionId
  );

  const handleClose = () => setOpenVariant(null);

  const modalTitle =
    openVariant === 'uncontrolled'
      ? 'Uncontrolled Form'
      : 'React Hook Form';

  return (
    <main className="forms-page">
      <h1>Forms</h1>

      <div className="forms-actions">
        <button
          type="button"
          className="forms-btn"
          onClick={() => setOpenVariant('uncontrolled')}
        >
          Open Uncontrolled Form
        </button>
        <button
          type="button"
          className="forms-btn"
          onClick={() => setOpenVariant('hookForm')}
        >
          Open React Hook Form
        </button>
      </div>

      <section
        className="submissions-section"
        aria-label="Submitted forms"
      >
        <h2>Submissions</h2>

        {submissions.length === 0 ? (
          <p className="submissions-empty">
            No submissions yet. Open a form above to submit your first one.
          </p>
        ) : (
          <div className="submissions-grid">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                highlighted={
                  submission.id === lastSubmissionId
                }
              />
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={openVariant !== null}
        onClose={handleClose}
        title={modalTitle}
      >
        <p>Form content will be added in the next feature.</p>
      </Modal>
    </main>
  );
}

export default FormsPage;
