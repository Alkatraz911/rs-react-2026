import { useState } from 'react';
import Modal from '../../components/Modal/Modal';

type FormVariant = 'uncontrolled' | 'hookForm';

function FormsPage() {
  const [openVariant, setOpenVariant] =
    useState<FormVariant | null>(null);

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
