import React from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import CommandInput from '../../components/CommandInput/CommandInput';
import { Link } from 'react-router-dom';
import { useCommandHandler } from '../../hooks/useCommandHandler';
import { Container, Button, MacWindow } from '../../components/ui';
import { Plus } from 'lucide-react';
import { theme } from '../../styles/theme';

/**
 * MainTerminal is the single entry point for the "terminal" UI. It composes
 * the real-time Dashboard with a CommandInput so operators never have to
 * leave this screen.
 *
 * Clean Code rationale:
 * – Keeps render logic declarative and side-effect free.
 * – Delegates data retrieval and business logic to dedicated hooks.
 * – Keeps JSX minimal by extracting helper hooks and components.
 */
const MainTerminal: React.FC = () => {

  const mainStyles: React.CSSProperties = {
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

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
  };

  const actionBarStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  };

  return (
    <main style={mainStyles}>
      <header style={headerStyles}>
        <Container maxWidth="xl" padding={false}>
          <h1 style={{ 
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            margin: 0,
          }}>
            Terminal de Control
          </h1>
        </Container>
      </header>

      <Container maxWidth="xl" style={contentStyles}>
        <MacWindow
          title="Dashboard de Control"
          width="100%"
          height="auto"
          resizable={false}
          footer={
            <div style={actionBarStyles}>
              <Link to="/create-pallet" style={{ textDecoration: 'none' }}>
                <Button icon={<Plus size={20} />} size="large">
                  Crear Pallet
                </Button>
              </Link>
            </div>
          }
        >
          <Dashboard />
        </MacWindow>

      </Container>
    </main>
  );
};

export default MainTerminal; 