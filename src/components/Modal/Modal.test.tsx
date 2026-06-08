import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render anything when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        content
      </Modal>
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('renders children via portal into document.body when open', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Hello">
        <p>portal content</p>
      </Modal>
    );
    expect(screen.getByText('portal content')).toBeInTheDocument();
    expect(screen.getByText('portal content').closest('[role="dialog"]'))
      .toBeInTheDocument();
  });

  it('applies dialog accessibility attributes', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="My title">
        <p>x</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(screen.getByText('My title')).toBeInTheDocument();
  });

  it('omits aria-labelledby when title is missing', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <p>x</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>x</p>
      </Modal>
    );
    await userEvent.click(
      screen.getByRole('button', { name: /close/i })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>x</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>x</p>
      </Modal>
    );
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.mouseDown(backdrop, {
      bubbles: true,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the dialog', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>inside</p>
      </Modal>
    );
    fireEvent.mouseDown(screen.getByText('inside'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('focuses the first focusable element (the close button) on open', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <button>first</button>
        <button>second</button>
      </Modal>
    );
    expect(document.activeElement).toHaveAttribute('aria-label', 'Close modal');
  });

  it('blocks body scroll while open and restores on close', () => {
    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()}>
        <p>x</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>x</p>
      </Modal>
    );
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('focus trap: Tab from last focusable wraps to first', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <button>first</button>
        <button>last</button>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    const focusables = dialog.querySelectorAll('button');
    const last = focusables[focusables.length - 1];
    last.focus();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toHaveAttribute(
      'aria-label',
      'Close modal'
    );
  });

  it('focus trap: Shift+Tab from first wraps to last', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <button>first</button>
        <button>last</button>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /close/i });
    closeBtn.focus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toHaveTextContent('last');
  });
});
