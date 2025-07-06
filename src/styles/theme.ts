export const theme = {
  colors: {
    // macOS-inspired color palette
    background: {
      primary: '#F5F5F7',
      secondary: '#FFFFFF',
      tertiary: '#FAFAFA',
      blur: 'rgba(255, 255, 255, 0.72)',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#86868B',
      tertiary: '#515154',
      inverse: '#F5F5F7',
    },
    accent: {
      blue: '#0071E3',
      blueHover: '#0077ED',
      green: '#34C759',
      red: '#FF3B30',
      orange: '#FF9500',
      purple: '#AF52DE',
      pink: '#FF2D55',
      teal: '#5AC8FA',
    },
    border: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(0, 0, 0, 0.2)',
    },
    shadow: {
      small: '0 1px 3px rgba(0, 0, 0, 0.12)',
      medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
      large: '0 8px 32px rgba(0, 0, 0, 0.12)',
      xlarge: '0 12px 48px rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '15px',
      lg: '17px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '34px',
      '5xl': '48px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '96px',
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  blur: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
};

export type Theme = typeof theme;