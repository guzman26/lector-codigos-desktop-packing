import React from 'react';
import { Link } from 'react-router-dom';
import CreatePalletForm from '../../components/Forms/CreatePalletForm';
import { Container, Button } from '../../components/ui';
import { ArrowLeft } from 'lucide-react';
import { theme } from '../../styles/theme';

const CreatePallet: React.FC = () => {
  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
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
    marginBottom: theme.spacing['3xl'],
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

  return (
    <div style={pageStyles}>
      <header style={headerStyles}>
        <Container maxWidth="lg" padding={false}>
          <div style={headerContentStyles}>
            <h1 style={titleStyles}>Crear Pallet</h1>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" icon={<ArrowLeft size={20} />}>
                Volver al Terminal
              </Button>
            </Link>
          </div>
        </Container>
      </header>
      
      <Container maxWidth="lg">
        <CreatePalletForm />
      </Container>
    </div>
  );
};

export default CreatePallet; 