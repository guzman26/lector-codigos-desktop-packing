import React from 'react';
import { theme } from '../../styles/theme';
import { Container } from './Container';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerContent?: React.ReactNode;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  headerContent,
  fullWidth = false,
}) => {
  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.blur,
    backdropFilter: `blur(${theme.blur.xl})`,
    WebkitBackdropFilter: `blur(${theme.blur.xl})`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: `${theme.spacing.lg} 0`,
  };

  const headerContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: 0,
  };

  const mainStyles: React.CSSProperties = {
    flex: 1,
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
  };

  return (
    <div style={pageStyles}>
      {(title || headerContent) && (
        <header style={headerStyles}>
          <Container maxWidth={fullWidth ? 'full' : 'xl'} padding={false}>
            <div style={headerContentStyles}>
              {title && <h1 style={titleStyles}>{title}</h1>}
              {headerContent}
            </div>
          </Container>
        </header>
      )}
      
      <main style={mainStyles}>
        {fullWidth ? (
          children
        ) : (
          <Container maxWidth="xl">
            {children}
          </Container>
        )}
      </main>
    </div>
  );
};