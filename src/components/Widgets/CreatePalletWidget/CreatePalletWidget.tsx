import React, { useState } from 'react';
import { useCreatePallet } from '../../../hooks/useCreatePallet';
import styles from './CreatePalletWidget.module.css';
import WidgetCard from '../WidgetCard';

const CreatePalletWidget: React.FC = () => {
  const { submit, data, loading, error } = useCreatePallet();
  const [codigo, setCodigo] = useState('');
  const [maxBoxes, setMaxBoxes] = useState('48');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(codigo)) {
      alert('El código base debe tener exactamente 11 dígitos');
      return;
    }
    const parsedMax = /^\d+$/.test(maxBoxes) ? Number(maxBoxes) : undefined;
    submit(codigo, parsedMax);
    setCodigo('');
    setMaxBoxes('48');
  };

  return (
    <WidgetCard title="Create Pallet">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código base de 11 dígitos…"
        />
        <input
          className={styles.input}
          type="number"
          min={1}
          step={1}
          value={maxBoxes}
          onChange={(e) => setMaxBoxes(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Máx. cajas (48)"
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
      {data && <p className={styles.success}>Pallet #{data.codigo} created</p>}
    </WidgetCard>
  );
};

export default CreatePalletWidget; 