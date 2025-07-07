import React from 'react';
import { theme } from '../../styles/theme';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  padding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  centered = true,
  padding = true,
  className,
  style,
}) => {
  const maxWidthStyles = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: maxWidthStyles[maxWidth],
    margin: centered ? '0 auto' : '0',
    padding: padding ? `${theme.spacing['2xl']} ${theme.spacing.xl}` : '0',
    ...style,
  };

  return (
    <div className={className} style={containerStyles}>
      {children}
    </div>
  );
};