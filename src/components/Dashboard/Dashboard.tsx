import React from 'react';
import { Card } from '../ui';
import { theme } from '../../styles/theme';
import CodeInputWidget from '../Widgets/CodeInputWidget/CodeInputWidget';
import ActivePalletsWidget from '../Widgets/ActivePalletsWidget/ActivePalletsWidget';
import AllPalletsWidget from '../Widgets/AllPalletsWidget/AllPalletsWidget';
import SystemInfoWidget from '../Widgets/SystemInfoWidget/SystemInfoWidget';
import IssueReporterWidget from '../Widgets/IssueReporterWidget/IssueReporterWidget';
import CreateBoxWidget from '../Widgets/CreateBoxWidget/CreateBoxWidget';
import BoxDetailsWidget from '../Widgets/BoxDetailsWidget/BoxDetailsWidget';
import UnassignedBoxesWidget from '../Widgets/UnassignedBoxesWidget/UnassignedBoxesWidget';
import CreatePalletWidget from '../Widgets/CreatePalletWidget/CreatePalletWidget';

/**
 * Dashboard is a pure composition layer; no data-fetching logic.
 * Redesigned for industrial touchscreen use with high-contrast, 
 * minimalistic interface suitable for factory environments.
 */
const Dashboard: React.FC = () => {
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing.xl,
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
      <div style={{ ...gridStyles, marginBottom: theme.spacing['3xl'] }}>
        <Card variant="elevated" style={primaryWidgetStyles}>
          <CodeInputWidget data={{ latestCode: '', history: [] }} />
        </Card>
        <Card variant="elevated">
          <ActivePalletsWidget />
        </Card>
      </div>

      {/* Inventory Management Section */}
      <h2 style={sectionTitleStyles}>Gestión de Inventario</h2>
      <div style={{ ...gridStyles, marginBottom: theme.spacing['3xl'] }}>
        <Card variant="default" style={primaryWidgetStyles}>
          <UnassignedBoxesWidget />
        </Card>
        <Card variant="default">
          <AllPalletsWidget />
        </Card>
      </div>

      {/* System & Operations Section */}
      <h2 style={sectionTitleStyles}>Sistema y Operaciones</h2>
      <div style={gridStyles}>
        <Card variant="blur">
          <SystemInfoWidget data={{}} />
        </Card>
        <Card variant="blur">
          <IssueReporterWidget />
        </Card>
        <Card variant="blur">
          <CreatePalletWidget />
        </Card>
        <Card variant="blur">
          <CreateBoxWidget />
        </Card>
        <Card variant="blur">
          <BoxDetailsWidget />
        </Card>
      </div>
    </section>
  );
};

export default Dashboard; 