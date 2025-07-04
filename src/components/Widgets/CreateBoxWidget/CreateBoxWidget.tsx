import React, { useState } from 'react';
import { useCreateBox } from '../../../hooks/useCreateBox';
import styles from './CreateBoxWidget.module.css';

const CreateBoxWidget: React.FC = () => {
  const { submit, data, loading, error } = useCreateBox();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    submit({ code: code.trim() });
    setCode('');
  };

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Create Box</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Box code…"
        />
        <button type="submit" disabled={loading} className={styles.button}>
          Add
        </button>
      </form>
      {loading && <p>Creating…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && <p className={styles.success}>Created: {data.code}</p>}
    </div>
  );
};

export default CreateBoxWidget; 