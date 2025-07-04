import React, { useState } from 'react';
import { useBoxByCode } from '../../../hooks/useBoxByCode';
import styles from './BoxDetailsWidget.module.css';

const BoxDetailsWidget: React.FC = () => {
  const { fetchByCode, data, loading, error } = useBoxByCode();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    fetchByCode(code.trim());
  };

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Box Details</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Box code…"
        />
        <button type="submit" disabled={loading} className={styles.button}>
          Fetch
        </button>
      </form>
      {loading && <p>Searching…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && (
        <pre className={styles.result}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
};

export default BoxDetailsWidget; 