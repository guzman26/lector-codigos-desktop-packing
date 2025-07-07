import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { theme } from '../../styles/theme';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  fullWidth = false,
  options,
  className,
  style,
  ...props
}, ref) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: fullWidth ? '100%' : 'auto',
  };

  const selectContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const selectStyles: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    paddingRight: '40px',
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${error ? theme.colors.accent.red : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
    ...style,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const errorStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.accent.red,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    right: theme.spacing.md,
    pointerEvents: 'none',
    color: theme.colors.text.secondary,
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      <div style={selectContainerStyles}>
        <select
          ref={ref}
          style={selectStyles}
          className={className}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span style={iconStyles}>
          <ChevronDown size={16} />
        </span>
      </div>
      {error && (
        <span style={errorStyles}>
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';