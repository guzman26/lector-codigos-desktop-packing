import React from 'react';
import { useUnassignedBoxesInPacking } from '../../../hooks/useUnassignedBoxesInPacking';
import styles from './UnassignedBoxesWidget.module.css';

const UnassignedBoxesWidget: React.FC = () => {
  const { data, loading, error } = useUnassignedBoxesInPacking();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Unassigned Boxes (Packing)</h2>
      {loading && <p>Loading…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {!loading && !error && (
        <ul className={styles.list}>
          {data.map((box) => (
            <li key={box.id}>{box.code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnassignedBoxesWidget; 