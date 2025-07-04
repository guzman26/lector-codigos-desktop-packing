import React from 'react';
import styles from './SystemInfoWidget.module.css';

interface SystemInfoWidgetProps {
  data: any;
}

const SystemInfoWidget: React.FC<SystemInfoWidgetProps> = ({ data }) => (
  <div className={styles.widget}>System Info: {JSON.stringify(data)}</div>
);

export default SystemInfoWidget; 