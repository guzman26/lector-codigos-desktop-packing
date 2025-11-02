import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import CodeInputWidget from '../Widgets/CodeInputWidget/CodeInputWidget';
import { useCreateBox } from '../../hooks/useCreateBox';
import ActivePalletsWidget from '../Widgets/ActivePalletsWidget/ActivePalletsWidget';
import UnassignedBoxesWidget from '../Widgets/UnassignedBoxesWidget/UnassignedBoxesWidget';

/**
 * Dashboard is a pure composition layer; no data-fetching logic.
 * Redesigned for industrial touchscreen use with high-contrast, 
 * minimalistic interface suitable for factory environments.
 */
const Dashboard: React.FC = () => {
  // State for code history and latest code
  const [codeData, setCodeData] = useState<{ latestCode: string; history: string[] }>({ 
    latestCode: '', 
    history: [] 
  });
  
  // Use the createBox hook for processing scanned codes
  const { submit: processCode } = useCreateBox();

  // Handle new code submission
  const handleCodeSubmit = (code: string) => {
    // Update the history and latest code
    setCodeData(prev => ({
      latestCode: code,
      history: [code, ...prev.history].slice(0, 10) // Keep only the last 10 codes
    }));
  };
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing.lg,
    width: '100%',
  };

  const primaryWidgetStyles: React.CSSProperties = {
    gridColumn: 'span 2',
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  };

  return (
    <section>
      {/* Primary Operations Section */}
      <h2 style={sectionTitleStyles}>Operaciones Principales</h2>
      <div style={{ ...gridStyles, marginBottom: theme.spacing['2xl'] }}>
        <div style={primaryWidgetStyles}>
          <CodeInputWidget 
            data={codeData} 
            onCodeSubmit={handleCodeSubmit}
            onProcessCode={processCode}
          />
        </div>
      </div>

      {/* Inventory Management Section */}
      <h2 style={sectionTitleStyles}>Gestión de Inventario</h2>
      <div style={gridStyles}>
        <UnassignedBoxesWidget />
        <div style={primaryWidgetStyles}>
          <ActivePalletsWidget />
        </div>
      </div>
    </section>
  );
};

export default Dashboard; 