import React from 'react';
import styles from './Dashboard.module.css';
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
const Dashboard: React.FC = () => (
  <section className={styles.dashboard}>
    <div className={styles.dashboard__grid}>
      {/* Primary Operations Row - Most Used Features */}
      <div className={`${styles.dashboard__widget} ${styles['dashboard__widget--primary']}`}>
        <CodeInputWidget data={{ latestCode: '', history: [] }} />
      </div>
      <div className={`${styles.dashboard__widget} ${styles['dashboard__widget--sidebar']}`}>
        <ActivePalletsWidget />
      </div>
      
      {/* Secondary Operations Row */}
      <div className={`${styles.dashboard__widget} ${styles['dashboard__widget--primary']}`}>
        <UnassignedBoxesWidget />
      </div>
      
      {/* System & Reporting Row */}
      <div className={styles.dashboard__widget}>
        <SystemInfoWidget data={{}} />
      </div>
      <div className={styles.dashboard__widget}>
        <IssueReporterWidget />
      </div>
      <div className={styles.dashboard__widget}>
        <CreatePalletWidget />
      </div>
      
      {/* Additional Features Row */}
      <div className={styles.dashboard__widget}>
        <CreateBoxWidget />
      </div>
      <div className={styles.dashboard__widget}>
        <BoxDetailsWidget />
      </div>
      <div className={styles.dashboard__widget}>
        <AllPalletsWidget />
      </div>
    </div>
  </section>
);

export default Dashboard; 