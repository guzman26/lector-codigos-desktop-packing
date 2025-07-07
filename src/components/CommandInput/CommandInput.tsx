import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '../ui';
import { Terminal, Play } from 'lucide-react';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';

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

  const terminalHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    backgroundColor: theme.colors.background.tertiary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  };

  const terminalButtonStyles: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    display: 'inline-block',
  };

  const terminalBodyStyles: React.CSSProperties = {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    padding: theme.spacing.lg,
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#D4D4D4',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    padding: `${theme.spacing.xs} 0`,
  };

  const promptStyles: React.CSSProperties = {
    color: '#4EC9B0',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  };

  const resultStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    color: '#D4D4D4',
    whiteSpace: 'pre-wrap',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.sm,
  };

  return (
    <div style={{ marginTop: theme.spacing['2xl'] }}>
      <div style={terminalHeaderStyles}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ ...terminalButtonStyles, backgroundColor: '#FF5F56' }}></span>
          <span style={{ ...terminalButtonStyles, backgroundColor: '#FFBD2E' }}></span>
          <span style={{ ...terminalButtonStyles, backgroundColor: '#27C93F' }}></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginLeft: 'auto' }}>
          <Terminal size={16} color={theme.colors.text.secondary} />
          <span style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            Terminal de Comandos
          </span>
        </div>
      </div>
      
      <div style={terminalBodyStyles}>
        {/* Command result display */}
        {lastResult && (
          <motion.pre 
            style={resultStyles}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {lastResult}
          </motion.pre>
        )}
        
        {/* Command input with terminal styling */}
        <form style={formStyles} onSubmit={handleSubmit}>
          <span style={promptStyles}>$</span>
          <input
            ref={inputRef}
            style={inputStyles}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ingrese comando..."
            spellCheck="false"
            autoComplete="off"
            aria-label="Command input"
          />
          <Button 
            type="submit"
            size="small"
            variant="ghost"
            icon={<Play size={16} />}
          >
            Ejecutar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CommandInput; 