import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { theme } from '../styles/theme';

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

  const backdropStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: `blur(${theme.blur.sm})`,
    WebkitBackdropFilter: `blur(${theme.blur.sm})`,
    zIndex: 1000,
  };

  const modalContainerStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    padding: theme.spacing['2xl'],
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius['2xl'],
    boxShadow: theme.colors.shadow.xlarge,
    maxHeight: '90vh',
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.xl,
    overflowY: 'auto',
    flex: 1,
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            style={backdropStyles}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div style={modalContainerStyles}>
            <motion.div
              style={modalStyles}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {title && (
                <div style={headerStyles}>
                  <h3 style={titleStyles}>{title}</h3>
                  <motion.button
                    style={closeButtonStyles}
                    onClick={onClose}
                    aria-label="Close"
                    whileHover={{ 
                      backgroundColor: theme.colors.background.primary,
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={18} color={theme.colors.text.secondary} />
                  </motion.button>
                </div>
              )}
              <div style={contentStyles}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal; 