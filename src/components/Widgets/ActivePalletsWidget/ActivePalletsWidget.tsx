import React from 'react';
import { useActivePallets } from '../../../hooks/useActivePallets';
import styles from './ActivePalletsWidget.module.css';

const ActivePalletsWidget: React.FC = () => {
  const { data, loading, error } = useActivePallets();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Active Pallets</h2>
      {loading && <p>Loading…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {!loading && !error && (
        <ul className={styles.list}>
          {data.map((pallet) => (
            <li key={pallet.id}>{pallet.code}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivePalletsWidget; 