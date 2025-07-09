import React, { useState, useRef, useEffect } from 'react';
import { Button, ToggleSwitch } from '../ui';
import { Play, ScanLine } from 'lucide-react';
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
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // This effect would handle machine input capture when enabled
  useEffect(() => {
    if (!captureEnabled) return;
    
    // In a real implementation, this is where you would set up listeners
    // for barcode scanners, RFID readers, or other input devices
    const handleExternalInput = (event: KeyboardEvent) => {
      // Only handle input when capture is enabled
      if (captureEnabled) {
        // For this demo, we'll simulate that any input not from the input element
        // itself is coming from an external device
        if (document.activeElement !== inputRef.current) {
          // Prevent default to avoid triggering browser shortcuts
          event.preventDefault();
          
          // Only handle alphanumeric and common scanner characters
          if (/^[a-zA-Z0-9\-_]$/.test(event.key)) {
            setValue(prev => prev + event.key);
          } else if (event.key === 'Enter') {
            // Auto-submit on Enter if there's a value
            if (value.trim()) {
              handleSubmit(new Event('submit') as any);
            }
          }
        }
      }
    };
    
    // Add global keyboard listener to capture scanner input
    window.addEventListener('keydown', handleExternalInput);
    
    return () => {
      window.removeEventListener('keydown', handleExternalInput);
    };
  }, [captureEnabled, value]);

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

  // Terminal header styling now handled by MacWindow component

  const terminalBodyStyles: React.CSSProperties = {
    backgroundColor: '#1E1E1E',
    color: '#D4D4D4',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    minHeight: '180px',
    maxHeight: '350px',
    overflowY: 'auto',
    padding: 0,
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  };
  
  const captureToggleStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: theme.borderRadius.sm,
  };
  
  const toggleLabelStyles: React.CSSProperties = {
    color: '#D4D4D4',
    fontSize: theme.typography.fontSize.xs,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
    <div>
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
        
        {/* Machine input capture toggle */}
        <div style={captureToggleStyles}>
          <span style={toggleLabelStyles}>
            <ScanLine size={14} />
            Captura automática
          </span>
          <ToggleSwitch 
            checked={captureEnabled}
            onChange={() => setCaptureEnabled(prev => !prev)}
            label={captureEnabled ? 'Activada' : 'Desactivada'}
            switchSize="small"
          />
        </div>
      </div>
    </div>
  );
};

export default CommandInput; 