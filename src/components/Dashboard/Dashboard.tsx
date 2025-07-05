import React from 'react';
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
  <section className="flex-1 overflow-auto p-6 bg-charcoal-900">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Primary Operations Row - Most Used Features */}
      <div className="lg:col-span-2">
        <CodeInputWidget data={{ latestCode: '', history: [] }} />
      </div>
      <div className="lg:row-span-2">
        <ActivePalletsWidget />
      </div>
      
      {/* Secondary Operations Row */}
      <div className="lg:col-span-2">
        <UnassignedBoxesWidget />
      </div>
      
      {/* System & Reporting Row */}
      <div>
        <SystemInfoWidget data={{}} />
      </div>
      <div>
        <IssueReporterWidget />
      </div>
      <div>
        <CreatePalletWidget />
      </div>
      
      {/* Additional Features Row */}
      <div>
        <CreateBoxWidget />
      </div>
      <div>
        <BoxDetailsWidget />
      </div>
      <div>
        <AllPalletsWidget />
      </div>
    </div>
  </section>
);

export default Dashboard; 