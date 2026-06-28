import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Hidden Modal">
        Secret content
      </Modal>
    );
    expect(screen.queryByText('Hidden Modal')).toBeNull();
    expect(screen.queryByText('Secret content')).toBeNull();
  });

  it('renders title and children when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Visible Modal">
        Modal body content
      </Modal>
    );
    expect(screen.getByText('Visible Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal body content')).toBeInTheDocument();
  });

  it('renders without a title when title prop is omitted', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        Content only
      </Modal>
    );
    expect(screen.getByText('Content only')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Close Me">
        Content
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Escape Test">
        Content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for non-Escape key presses', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Key Test">
        Content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders the footer slot when footer prop is provided', () => {
    render(
      <Modal
        open={true}
        onClose={vi.fn()}
        footer={<button>Confirm Action</button>}
      >
        Content
      </Modal>
    );
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('does not attach keydown listener when modal is closed', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    render(
      <Modal open={false} onClose={vi.fn()}>
        Content
      </Modal>
    );
    const keydownCalls = addSpy.mock.calls.filter(([event]) => event === 'keydown');
    expect(keydownCalls.length).toBe(0);
    addSpy.mockRestore();
  });
});
