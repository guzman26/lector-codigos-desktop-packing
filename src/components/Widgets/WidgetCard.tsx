import type { ReactNode } from 'react';
import { Card } from '../ui';
import { theme } from '../../styles/theme';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

/**
 * Enhanced WidgetCard
 * 
 * Improvements:
 * - Icon support for visual identification
 * - Subtitle for additional context
 * - Action slot for widget-specific actions
 * - Better typography hierarchy
 * 
 * @rationale Provides consistent widget structure with improved
 * visual hierarchy for factory terminal interface
 */
const WidgetCard: React.FC<WidgetCardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  children, 
  action 
}) => {
  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  };

  const titleWrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    flex: 1,
  };

  const titleContentStyles: React.CSSProperties = {
    flex: 1,
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
  };

  const subtitleStyles: React.CSSProperties = {
    margin: 0,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  };

  const iconStyles: React.CSSProperties = {
    color: theme.colors.text.secondary,
    marginTop: '2px', // Align with text baseline
    flexShrink: 0,
  };

  return (
    <Card variant="blur" padding="large">
      <div style={headerStyles}>
        <div style={titleWrapperStyles}>
          {icon && <div style={iconStyles}>{icon}</div>}
          <div style={titleContentStyles}>
            <h2 style={titleStyles}>{title}</h2>
            {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </Card>
  );
};

export default WidgetCard; 