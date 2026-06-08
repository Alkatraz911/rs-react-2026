import { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import SubmissionCard from '../../components/SubmissionCard/SubmissionCard';
import UncontrolledForm from '../../components/UncontrolledForm/UncontrolledForm';
import HookForm from '../../components/HookForm/HookForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addSubmission,
  clearLastSubmission,
  type FormSource,
  type SubmissionData,
} from '../../store/formsSlice';

const HIGHLIGHT_DURATION_MS = 3000;

function FormsPage() {
  const [openVariant, setOpenVariant] =
    useState<FormSource | null>(null);

  const dispatch = useAppDispatch();
  const submissions = useAppSelector(
    (state) => state.forms.submissions
  );
  const lastSubmissionId = useAppSelector(
    (state) => state.forms.lastSubmissionId
  );

  useEffect(() => {
    if (!lastSubmissionId) return;
    const timer = window.setTimeout(() => {
      dispatch(clearLastSubmission());
    }, HIGHLIGHT_DURATION_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [lastSubmissionId, dispatch]);

  const handleClose = () => setOpenVariant(null);

  const handleSubmit =
    (source: FormSource) => (data: SubmissionData) => {
      dispatch(addSubmission({ data, source }));
      setOpenVariant(null);
    };

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
        {openVariant === 'uncontrolled' && (
          <UncontrolledForm onSubmit={handleSubmit('uncontrolled')} />
        )}
        {openVariant === 'hookForm' && (
          <HookForm onSubmit={handleSubmit('hookForm')} />
        )}
      </Modal>
    </main>
  );
}

export default FormsPage;
