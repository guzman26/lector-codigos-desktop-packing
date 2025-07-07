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
  showTrafficLights?: boolean;
}

/**
 * Generic modal overlay. Renders its children in a centered card with backdrop.
 * Uses a React portal attached to document.body.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, showTrafficLights = true }) => {
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
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0,
  };

  const trafficButtonStyles = (color: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
    cursor: color === '#FF5F56' ? 'pointer' : 'default',
  });

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
              {(title || showTrafficLights) && (
                <div style={headerStyles}>
                  {showTrafficLights && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span
                        style={trafficButtonStyles('#FF5F56')}
                        onClick={onClose}
                      />
                      <span style={trafficButtonStyles('#FFBD2E')} />
                      <span style={trafficButtonStyles('#27C93F')} />
                    </div>
                  )}
                  {title && <h3 style={titleStyles}>{title}</h3>}
                </div>
              )}
              <div style={contentStyles}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal; 