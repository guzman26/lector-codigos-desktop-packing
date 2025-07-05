import React, { useState } from 'react';
import { useBoxByCode } from '../../../hooks/useBoxByCode';
import styles from './BoxDetailsWidget.module.css';
import WidgetCard from '../WidgetCard';

const BoxDetailsWidget: React.FC = () => {
  const { fetchByCode, data, loading, error } = useBoxByCode();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    fetchByCode(code.trim());
  };

  return (
    <WidgetCard title="Box Details">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Box code…"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
        >
          Fetch
        </button>
      </form>
      {loading && <p>Searching…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && (
        <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </WidgetCard>
  );
};

export default BoxDetailsWidget; 