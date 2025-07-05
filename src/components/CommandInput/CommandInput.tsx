import React, { useState, useRef, useEffect } from 'react';
import styles from './CommandInput.module.css';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  lastResult: string | null;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, lastResult }) => {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    // Add to history and reset
    const trimmedValue = value.trim();
    setHistory((prev) => [trimmedValue, ...prev.slice(0, 9)]);
    onSubmit(trimmedValue);
    setValue('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle command history navigation with arrow keys
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      if (nextIndex >= 0 && history[nextIndex]) {
        setValue(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      if (nextIndex === -1) {
        setValue('');
      } else if (history[nextIndex]) {
        setValue(history[nextIndex]);
      }
    }
  };

  return (
    <div className={styles.terminal}>
      <div className={styles.terminal__header}>
        <div className={styles.terminal__buttons}>
          <div className={`${styles.terminal__button} ${styles['terminal__button--close']}`}></div>
          <div className={`${styles.terminal__button} ${styles['terminal__button--minimize']}`}></div>
          <div className={`${styles.terminal__button} ${styles['terminal__button--maximize']}`}></div>
        </div>
        <h3 className={styles.terminal__title}>Terminal</h3>
      </div>
      
      <div className={styles.terminal__body}>
        {/* Command result display */}
        {lastResult && (
          <pre className={styles.terminal__result}>
            {lastResult}
          </pre>
        )}
        
        {/* Command input with terminal styling */}
        <form className={styles.terminal__form} onSubmit={handleSubmit}>
          <span className={styles.terminal__prompt}>$</span>
          <input
            ref={inputRef}
            className={styles.terminal__input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            spellCheck="false"
            autoComplete="off"
            aria-label="Command input"
          />
          <button 
            type="submit" 
            className={styles.terminal__submit}>
            Run
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommandInput; 