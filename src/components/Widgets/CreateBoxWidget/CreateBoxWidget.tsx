import React, { useState } from 'react';
import { useCreateBox } from '../../../hooks/useCreateBox';
import styles from './CreateBoxWidget.module.css';
import WidgetCard from '../WidgetCard';

const CreateBoxWidget: React.FC = () => {
  const { submit, data, loading, error } = useCreateBox();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    submit(code.trim());
    setCode('');
  };

  return (
    <WidgetCard title="Create Box">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className="w-full px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Box code…"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
        >
          Add
        </button>
      </form>
      {loading && <p>Creating…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {data && <p className={styles.success}>Created: {data.code}</p>}
    </WidgetCard>
  );
};

export default CreateBoxWidget; 