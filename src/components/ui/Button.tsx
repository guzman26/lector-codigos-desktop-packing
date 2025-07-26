import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  children,
  disabled,
  className,
  style,
  onClick,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  };

  const sizeStyles = {
    small: {
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      fontSize: theme.typography.fontSize.sm,
      borderRadius: theme.borderRadius.md,
      height: '28px',
    },
    medium: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: theme.typography.fontSize.base,
      borderRadius: theme.borderRadius.md,
      height: '36px',
    },
    large: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.lg,
      borderRadius: theme.borderRadius.lg,
      height: '44px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.accent.blue,
      color: theme.colors.text.inverse,
      boxShadow: theme.colors.shadow.small,
    },
    secondary: {
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.light}`,
      boxShadow: theme.colors.shadow.small,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.accent.blue,
    },
    danger: {
      backgroundColor: theme.colors.accent.red,
      color: theme.colors.text.inverse,
      boxShadow: theme.colors.shadow.small,
    },
  };

  const hoverStyles = {
    primary: { backgroundColor: theme.colors.accent.blueHover },
    secondary: { backgroundColor: theme.colors.background.tertiary },
    ghost: { backgroundColor: theme.colors.background.tertiary },
    danger: { backgroundColor: '#FF453A' },
  };

  const { 
    onDrag, 
    onDragEnd, 
    onDragStart,
    onAnimationStart,
    ...safeProps
  } = props;

  return (
    <motion.button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      whileHover={!disabled ? {
        ...hoverStyles[variant],
        scale: 1.02,
      } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      className={className}
      onClick={onClick}
      {...safeProps}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </motion.button>
  );
};