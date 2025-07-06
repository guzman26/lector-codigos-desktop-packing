import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  fullWidth = false,
  className,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: fullWidth ? '100%' : 'auto',
  };

  const inputContainerStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    paddingLeft: icon ? '40px' : theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${error ? theme.colors.accent.red : isFocused ? theme.colors.accent.blue : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    outline: 'none',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
    boxShadow: isFocused ? `0 0 0 3px ${theme.colors.accent.blue}20` : 'none',
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
    left: theme.spacing.md,
    color: theme.colors.text.secondary,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      <div style={inputContainerStyles}>
        {icon && (
          <span style={iconStyles}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          style={{
            ...inputStyles,
            transform: isFocused ? 'scale(1.01)' : 'scale(1)',
          }}
          className={className}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <motion.span
          style={errorStyles}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.span>
      )}
    </div>
  );
});

Input.displayName = 'Input';