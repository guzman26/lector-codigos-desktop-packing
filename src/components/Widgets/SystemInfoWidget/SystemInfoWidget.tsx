import React from 'react';
import WidgetCard from '../WidgetCard';

interface SystemInfoWidgetProps {
  data: any;
}

const SystemInfoWidget: React.FC<SystemInfoWidgetProps> = ({ data }) => (
  <WidgetCard title="System Info">
    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
  </WidgetCard>
);

export default SystemInfoWidget; 