import React from 'react';
import { theme } from '../../styles/theme';

interface ProgressBarProps {
  value: number; // 0 - 100
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  striped?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = theme.colors.accent.blue,
  size = 'medium',
  showLabel = false,
  striped = false,
}) => {
  const heights = {
    small: 6,
    medium: 10,
    large: 14,
  };

  const containerStyles: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.border.light,
    borderRadius: heights[size],
    overflow: 'hidden',
  };

  const progressStyles: React.CSSProperties = {
    width: `${Math.min(Math.max(value, 0), 100)}%`,
    height: heights[size],
    backgroundColor: color,
    transition: `width ${theme.animation.duration.normal} ${theme.animation.easing.default}`,
    backgroundImage: striped
      ? `repeating-linear-gradient(45deg, ${color} 0, ${color} 10px, ${color}33 10px, ${color}33 20px)`
      : undefined,
  };

  const labelStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  };

  return (
    <div>
      <div style={containerStyles}>
        <div style={progressStyles} />
      </div>
      {showLabel && <div style={labelStyles}>{value}%</div>}
    </div>
  );
};