import React, { useState } from 'react';
import styles from './CommandInput.module.css';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  lastResult: string | null;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, lastResult }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter command..."
      />
      {lastResult && <pre className={styles.result}>{lastResult}</pre>}
    </form>
  );
};

export default CommandInput; 