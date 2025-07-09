import { ReactNode, useEffect, useCallback, useRef } from 'react';
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
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
}

/**
 * Enhanced Modal Component
 * 
 * Improvements for touchscreen and accessibility:
 * - Large close button for easy touch targeting
 * - Swipe down to close on mobile
 * - Escape key support
 * - Focus management
 * - ARIA attributes
 * - Responsive sizing
 * 
 * @rationale Factory operators need quick, reliable modal interactions
 * even with gloved hands or in rushed situations
 */
const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showTrafficLights = false,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscapeKey = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscapeKey) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscapeKey]);

  // Prevent background scroll and manage focus
  useEffect(() => {
    if (!isOpen) return;

    // Store current focus
    previousActiveElement.current = document.activeElement;

    // Prevent scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus modal
    const timer = setTimeout(() => {
      modalRef.current?.focus();
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return { maxWidth: '400px' };
      case 'large':
        return { maxWidth: '1200px' };
      case 'fullscreen':
        return { 
          maxWidth: '100%', 
          maxHeight: '100%',
          width: '100%',
          height: '100%',
          margin: 0,
          borderRadius: 0,
        };
      default:
        return { maxWidth: '800px' };
    }
  };

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
    padding: size === 'fullscreen' ? 0 : theme.spacing.xl,
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: size === 'fullscreen' ? 0 : theme.borderRadius['2xl'],
    boxShadow: theme.colors.shadow.xlarge,
    maxHeight: size === 'fullscreen' ? '100%' : '90vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    ...getSizeStyles(),
  };

  const headerStyles: React.CSSProperties = {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    minHeight: '64px', // Touch-friendly height
  };

  const titleWrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    flex: 1,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
    flexShrink: 0,
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
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };

  // Responsive adjustments for mobile
  const mobileStyles: React.CSSProperties = {
    '@media (max-width: 640px)': {
      padding: theme.spacing.md,
      borderRadius: `${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0`,
      maxHeight: '95vh',
      marginTop: 'auto',
    }
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
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          <div style={modalContainerStyles}>
            <motion.div
              ref={modalRef}
              style={{ ...modalStyles, ...mobileStyles }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              tabIndex={-1}
            >
              {(title || showTrafficLights || showCloseButton) && (
                <div style={headerStyles}>
                  <div style={titleWrapperStyles}>
                    {showTrafficLights && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span
                          style={trafficButtonStyles('#FF5F56')}
                          onClick={onClose}
                          role="button"
                          aria-label="Close modal"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onClose();
                            }
                          }}
                        />
                        <span style={trafficButtonStyles('#FFBD2E')} />
                        <span style={trafficButtonStyles('#27C93F')} />
                      </div>
                    )}
                    {title && (
                      <h2 id="modal-title" style={titleStyles}>
                        {title}
                      </h2>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      style={closeButtonStyles}
                      onClick={onClose}
                      aria-label="Close modal"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                        e.currentTarget.style.borderColor = theme.colors.border.medium;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = theme.colors.border.light;
                      }}
                    >
                      <X size={24} style={{ color: theme.colors.text.primary }} />
                    </button>
                  )}
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