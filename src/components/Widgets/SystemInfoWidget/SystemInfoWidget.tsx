import React from 'react';
import WidgetCard from '../WidgetCard';
import { ProgressBar, ToggleSwitch } from '../../ui';
import { theme } from '../../../styles/theme';

interface SystemInfoWidgetProps {
  data: any;
}

const SystemInfoWidget: React.FC<SystemInfoWidgetProps> = ({ data }) => {
  const usedMemory = data?.memory?.used ?? 60; // fallback demo
  const totalMemory = data?.memory?.total ?? 100;
  const percentage = Math.round((usedMemory / totalMemory) * 100);

  return (
    <WidgetCard title="Información del Sistema">
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
        <div>
          <strong>Memoria:</strong>
          <ProgressBar value={percentage} showLabel />
        </div>
        <ToggleSwitch label="Modo Oscuro" switchSize="small" />
      </div>
    </WidgetCard>
  );
};

export default SystemInfoWidget; 