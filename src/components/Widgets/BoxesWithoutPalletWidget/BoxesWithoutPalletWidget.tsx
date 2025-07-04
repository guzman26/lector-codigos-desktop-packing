import React from 'react';
import { useUnassignedBoxes } from '../../../hooks/useUnassignedBoxes';
import styles from './BoxesWithoutPalletWidget.module.css';

const BoxesWithoutPalletWidget: React.FC = () => {
  const { data, loading, error } = useUnassignedBoxes();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Unassigned Boxes</h2>
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

export default BoxesWithoutPalletWidget; 