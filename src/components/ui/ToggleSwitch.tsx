import React, { forwardRef } from 'react';
import { theme } from '../../styles/theme';

interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  switchSize?: 'small' | 'medium' | 'large';
  onColor?: string;
  offColor?: string;
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(({ 
  label,
  switchSize = 'medium',
  onColor = theme.colors.accent.blue,
  offColor = theme.colors.border.medium,
  style,
  className,
  ...props
}, ref) => {
  const dimensions = {
    small: { width: 32, height: 18, knob: 14 },
    medium: { width: 42, height: 24, knob: 18 },
    large: { width: 52, height: 30, knob: 24 },
  }[switchSize];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    cursor: 'pointer',
    userSelect: 'none',
  };

  const trackStyles = (checked: boolean): React.CSSProperties => ({
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: checked ? onColor : offColor,
    borderRadius: dimensions.height,
    position: 'relative',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  const knobStyles = (checked: boolean): React.CSSProperties => ({
    width: dimensions.knob,
    height: dimensions.knob,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: '50%',
    position: 'absolute',
    top: (dimensions.height - dimensions.knob) / 2,
    left: checked ? dimensions.width - dimensions.knob - (dimensions.height - dimensions.knob) / 2 : (dimensions.height - dimensions.knob) / 2,
    boxShadow: theme.colors.shadow.small,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  return (
    <label style={{ ...containerStyles, ...style }} className={className}>
      <input 
        type="checkbox" 
        ref={ref}
        style={{ display: 'none' }}
        {...props}
      />
      <span style={trackStyles(props.checked ?? false)}>
        <span style={knobStyles(props.checked ?? false)} />
      </span>
      {label && (
        <span style={{ 
          fontFamily: theme.typography.fontFamily.primary,
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.primary,
        }}>
          {label}
        </span>
      )}
    </label>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';