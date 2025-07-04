import React from 'react';
import CodeInputWidget from '../Widgets/CodeInputWidget/CodeInputWidget';
import ActivePalletsWidget from '../Widgets/ActivePalletsWidget/ActivePalletsWidget';
import AllPalletsWidget from '../Widgets/AllPalletsWidget/AllPalletsWidget';
import BoxesWithoutPalletWidget from '../Widgets/BoxesWithoutPalletWidget/BoxesWithoutPalletWidget';
import SystemInfoWidget from '../Widgets/SystemInfoWidget/SystemInfoWidget';
import IssueReporterWidget from '../Widgets/IssueReporterWidget/IssueReporterWidget';
import CreateBoxWidget from '../Widgets/CreateBoxWidget/CreateBoxWidget';
import BoxDetailsWidget from '../Widgets/BoxDetailsWidget/BoxDetailsWidget';
import UnassignedBoxesWidget from '../Widgets/UnassignedBoxesWidget/UnassignedBoxesWidget';
import CreatePalletWidget from '../Widgets/CreatePalletWidget/CreatePalletWidget';

import styles from './Dashboard.module.css';

/**
 * Dashboard is a pure composition layer; no data-fetching logic.
 */
const Dashboard: React.FC = () => (
  <section className={styles.grid}>
    <CodeInputWidget data={{ latestCode: '', history: [] }} />
    <ActivePalletsWidget />
    <AllPalletsWidget />
    <BoxesWithoutPalletWidget />
    <SystemInfoWidget data={{}} />
    <IssueReporterWidget />
    <CreateBoxWidget />
    <BoxDetailsWidget />
    <UnassignedBoxesWidget />
    <CreatePalletWidget />
  </section>
);

export default Dashboard; 