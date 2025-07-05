import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Generic modal overlay. Renders its children in a centered card with backdrop.
 * Uses a React portal attached to document.body.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-zinc-900 text-white rounded-lg shadow-xl max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto p-6">
        {/* Close btn */}
        <button
          className="absolute top-3 right-3 text-xl leading-none text-zinc-400 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {title && <h3 className="text-2xl font-semibold mb-4 pr-6">{title}</h3>}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal; 