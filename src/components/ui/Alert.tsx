import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { theme } from '../../styles/theme';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  dismissible = false,
  onClose,
  className,
  style,
}) => {
  const variants = {
    success: {
      bg: theme.colors.accent.green + '1A',
      color: theme.colors.accent.green,
      icon: <CheckCircle size={18} />,
    },
    error: {
      bg: theme.colors.accent.red + '1A',
      color: theme.colors.accent.red,
      icon: <XCircle size={18} />,
    },
    warning: {
      bg: theme.colors.accent.orange + '1A',
      color: theme.colors.accent.orange,
      icon: <AlertTriangle size={18} />,
    },
    info: {
      bg: theme.colors.accent.blue + '1A',
      color: theme.colors.accent.blue,
      icon: <Info size={18} />,
    },
  }[variant];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: variants.bg,
    color: variants.color,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    ...style,
  };

  const closeButtonStyles: React.CSSProperties = {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: variants.color,
    fontSize: '16px',
    lineHeight: 1,
    padding: 0,
  };

  return (
    <div style={containerStyles} className={className} role="alert">
      {variants.icon}
      <span style={{ flex: 1 }}>{children}</span>
      {dismissible && (
        <button aria-label="Close" style={closeButtonStyles} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};