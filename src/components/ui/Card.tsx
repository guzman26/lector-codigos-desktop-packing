import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'blur' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  className,
  style,
  onClick,
  hoverable = false,
}) => {
  const paddingStyles = {
    none: '0',
    small: theme.spacing.md,
    medium: theme.spacing.xl,
    large: theme.spacing['2xl'],
  };

  const variantStyles = {
    default: {
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.light}`,
      boxShadow: theme.colors.shadow.small,
    },
    blur: {
      backgroundColor: theme.colors.background.blur,
      backdropFilter: `blur(${theme.blur.lg})`,
      WebkitBackdropFilter: `blur(${theme.blur.lg})`,
      border: `1px solid ${theme.colors.border.light}`,
    },
    elevated: {
      backgroundColor: theme.colors.background.secondary,
      boxShadow: theme.colors.shadow.large,
    },
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: theme.borderRadius.xl,
    padding: paddingStyles[padding],
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.default}`,
    cursor: onClick ? 'pointer' : 'default',
    ...variantStyles[variant],
    ...style,
  };

  const hoverStyles = hoverable || onClick ? {
    transform: 'translateY(-2px)',
    boxShadow: theme.colors.shadow.xlarge,
  } : {};

  return (
    <motion.div
      className={className}
      style={baseStyles}
      whileHover={hoverStyles}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};