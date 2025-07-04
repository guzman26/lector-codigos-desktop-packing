import React, { useState } from 'react';
import { usePostIssue } from '../../../hooks/usePostIssue';
import styles from './IssueReporterWidget.module.css';

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
    <div className={styles.widget}>
      <h2 className={styles.title}>Report Issue</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe issue…"
        />
        <button type="submit" disabled={loading} className={styles.button}>
          Send
        </button>
      </form>
      {loading && <p>Sending…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {response && <p className={styles.success}>{response.message}</p>}
    </div>
  );
};

export default IssueReporterWidget; 