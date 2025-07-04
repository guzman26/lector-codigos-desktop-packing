import React from 'react';
import { useAllPallets } from '../../../hooks/useAllPallets';
import styles from './AllPalletsWidget.module.css';

const AllPalletsWidget: React.FC = () => {
  const { data, loading, error } = useAllPallets();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>All Pallets</h2>
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

export default AllPalletsWidget; 