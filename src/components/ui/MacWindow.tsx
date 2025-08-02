import React from 'react';
import { theme } from '../../styles/theme';

interface MacWindowProps {
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  minHeight?: number | string;
  resizable?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
}

export const MacWindow: React.FC<MacWindowProps> = ({
  title,
  children,
  width = 600,
  height = 400,
  minHeight,
  resizable = false,
  footer,
  onClose,
}) => {
  const containerStyles: React.CSSProperties = {
    width,
    height,
    minHeight,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.colors.shadow.large,
    overflow: 'hidden',
    resize: resizable ? 'both' : undefined,
  };

  const titleBarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    backgroundColor: theme.colors.background.blur,
    backdropFilter: `blur(${theme.blur.md})`,
    WebkitBackdropFilter: `blur(${theme.blur.md})`,
  };

  const trafficButtonStyles = (color: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
    cursor: 'pointer',
  });

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing.lg,
  };

  const footerStyles: React.CSSProperties = {
    borderTop: `1px solid ${theme.colors.border.light}`,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
  };

  return (
    <div style={containerStyles}>
      <div style={titleBarStyles}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={trafficButtonStyles('#FF5F56')} onClick={onClose} />
          <span style={trafficButtonStyles('#FFBD2E')} />
          <span style={trafficButtonStyles('#27C93F')} />
        </div>
        {title && (
          <span style={{
            marginLeft: theme.spacing.sm,
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
          }}>
            {title}
          </span>
        )}
      </div>

      <div style={contentStyles}>{children}</div>
      {footer && <div style={footerStyles}>{footer}</div>}
    </div>
  );
};