import React, { useState } from 'react';
import { usePostIssue } from '../../../hooks/usePostIssue';
import styles from './IssueReporterWidget.module.css';
import WidgetCard from '../WidgetCard';

const IssueReporterWidget: React.FC = () => {
  const { submit, response, loading, error } = usePostIssue();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    submit(value.trim());
    setValue('');
  };

  return (
    <WidgetCard title="Report Issue">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe issue…"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded"
        >
          Send
        </button>
      </form>
      {loading && <p>Sending…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {response && <p className={styles.success}>{response.message}</p>}
    </WidgetCard>
  );
};

export default IssueReporterWidget; 