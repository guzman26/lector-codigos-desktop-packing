import React, { useState } from 'react';
import { useCreatePallet } from '../../../hooks/useCreatePallet';
import styles from './CreatePalletWidget.module.css';

const CreatePalletWidget: React.FC = () => {
  const { submit, data, loading, error } = useCreatePallet();
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(codigo)) {
      alert('Código must be exactly 10 digits');
      return;
    }
    submit(codigo);
    setCodigo('');
  };

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Create Pallet</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="10-digit código…"
        />
        <button type="submit" disabled={loading} className={styles.button}>
          Create
        </button>
      </form>
      {loading && <p>Creating…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && <p className={styles.success}>Pallet #{data.code} created</p>}
    </div>
  );
};

export default CreatePalletWidget; 