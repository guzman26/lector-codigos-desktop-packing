import React, { useState } from 'react';
import { useCreatePallet } from '../../../hooks/useCreatePallet';
import styles from './CreatePalletWidget.module.css';
import WidgetCard from '../WidgetCard';

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
    <WidgetCard title="Create Pallet">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="10-digit código…"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
        >
          Create
        </button>
      </form>
      {loading && <p>Creating…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && <p className={styles.success}>Pallet #{data.code} created</p>}
    </WidgetCard>
  );
};

export default CreatePalletWidget; 