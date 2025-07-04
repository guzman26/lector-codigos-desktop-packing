import React from 'react';
import styles from './CodeInputWidget.module.css';

export interface CodeInputWidgetProps {
  data: {
    latestCode: string;
    history: string[];
  };
}

/**
 * Pure presentational component that displays scanned code data.
 * Business logic lives in hooks; here we simply render.
 */
const CodeInputWidget: React.FC<CodeInputWidgetProps> = ({ data }) => {
  const { latestCode, history } = data;

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Code Input</h2>
      <p className={styles.latest}>{latestCode ?? '—'}</p>
      <ul className={styles.history}>
        {history.map((code, idx) => (
          <li key={`${code}-${idx}`}>{code}</li>
        ))}
      </ul>
    </div>
  );
};

export default CodeInputWidget; 