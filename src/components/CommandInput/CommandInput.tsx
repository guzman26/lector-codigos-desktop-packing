import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, ToggleSwitch } from '../ui';
import { Play, ScanLine, History, Terminal } from 'lucide-react';
import { theme } from '../../styles/theme';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  lastResult: string | null;
}

/**
 * Enhanced CommandInput Component
 * 
 * Improvements for factory touchscreen terminals:
 * - Larger touch targets for gloved hands
 * - Visual feedback for scanner input mode
 * - Quick access to command history
 * - Auto-submit option for scanner input
 * - Clear visual states and feedback
 * 
 * @rationale Factory operators need quick, reliable input methods
 * that work with barcode scanners and manual entry
 */
const CommandInput: React.FC<CommandInputProps> = ({ onSubmit, lastResult }) => {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current && !captureEnabled) {
      inputRef.current.focus();
    }
  }, [captureEnabled]);
  
  // Handle machine input capture
  useEffect(() => {
    if (!captureEnabled) return;
    
    const handleExternalInput = (event: KeyboardEvent) => {
      if (captureEnabled) {
        if (document.activeElement !== inputRef.current) {
          event.preventDefault();
          
          if (/^[a-zA-Z0-9\-_]$/.test(event.key)) {
            setValue(prev => prev + event.key);
          } else if (event.key === 'Enter' && autoSubmit) {
            if (value.trim()) {
              handleSubmit(new Event('submit') as any);
            }
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleExternalInput);
    return () => window.removeEventListener('keydown', handleExternalInput);
  }, [captureEnabled, value, autoSubmit]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    const trimmedValue = value.trim();
    setHistory((prev) => [trimmedValue, ...prev.filter(h => h !== trimmedValue).slice(0, 9)]);
    onSubmit(trimmedValue);
    setValue('');
    setHistoryIndex(-1);
    setShowHistory(false);
  }, [value, onSubmit]);

  // Auto-envío cuando el código alcanza 16 dígitos (cajas) o 126 dígitos (otros códigos)
  useEffect(() => {
    const shouldAutoSubmit = value.length === 16 || value.length === 126;
    
    if (shouldAutoSubmit) {
      // Pequeño delay para asegurar que el scanner haya terminado
      const timer = setTimeout(() => {
        handleSubmit(new Event('submit') as any);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value.length, handleSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const selectFromHistory = (command: string) => {
    setValue(command);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const terminalContainerStyles: React.CSSProperties = {
    backgroundColor: '#1E1E1E',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  };

  const terminalHeaderStyles: React.CSSProperties = {
    backgroundColor: '#2D2D2D',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderBottom: '1px solid #3E3E3E',
  };

  const terminalBodyStyles: React.CSSProperties = {
    color: '#D4D4D4',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.base,
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: theme.spacing.md,
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    border: captureEnabled ? '2px solid #4EC9B0' : '1px solid transparent',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  const captureIndicatorStyles: React.CSSProperties = {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: '#4EC9B0',
    color: '#1E1E1E',
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    animation: captureEnabled ? 'pulse 2s infinite' : 'none',
  };
  
  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: theme.borderRadius.md,
    borderTop: '1px solid #3E3E3E',
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#D4D4D4',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.base,
    padding: `${theme.spacing.sm} 0`,
    minHeight: '44px',
  };

  const promptStyles: React.CSSProperties = {
    color: '#4EC9B0',
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  };

  const resultStyles: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    color: '#D4D4D4',
    whiteSpace: 'pre-wrap',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.sm,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const historyButtonStyles: React.CSSProperties = {
    padding: theme.spacing.sm,
    backgroundColor: 'transparent',
    border: '1px solid #3E3E3E',
    borderRadius: theme.borderRadius.sm,
    color: '#D4D4D4',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  const historyDropdownStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: theme.spacing.sm,
    backgroundColor: '#2D2D2D',
    border: '1px solid #3E3E3E',
    borderRadius: theme.borderRadius.md,
    maxHeight: '240px',
    overflowY: 'auto',
    zIndex: 10,
    boxShadow: theme.colors.shadow.large,
  };

  const historyItemStyles: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    cursor: 'pointer',
    transition: `background-color ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    borderBottom: '1px solid #3E3E3E',
  };

  return (
    <div style={terminalContainerStyles}>
      {/* Terminal header */}
      <div style={terminalHeaderStyles}>
        <Terminal size={16} style={{ color: '#4EC9B0' }} />
        <span style={{ fontSize: theme.typography.fontSize.sm, color: '#888' }}>
          Terminal de Comandos
        </span>
      </div>

      {/* Capture indicator */}
      <AnimatePresence>
        {captureEnabled && (
          <motion.div
            style={captureIndicatorStyles}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <ScanLine size={14} />
            ESCÁNER ACTIVO
          </motion.div>
        )}
      </AnimatePresence>

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
        
        {/* Command input form */}
        <div style={{ position: 'relative' }}>
          <form style={formStyles} onSubmit={handleSubmit}>
            <span style={promptStyles}>$</span>
            <input
              ref={inputRef}
              style={inputStyles}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={captureEnabled ? "Esperando entrada del escáner..." : "Ingrese comando..."}
              spellCheck="false"
              autoComplete="off"
              aria-label="Command input"
              disabled={captureEnabled}
            />
            <button
              type="button"
              style={historyButtonStyles}
              onClick={() => setShowHistory(!showHistory)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#4EC9B0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#3E3E3E';
              }}
              aria-label="Command history"
              title="Historial de comandos"
            >
              <History size={20} />
            </button>
            <Button 
              type="submit"
              size="medium"
              variant="primary"
              icon={<Play size={18} />}
              disabled={!value.trim()}
            >
              Ejecutar
            </Button>
          </form>

          {/* History dropdown */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div
                style={historyDropdownStyles}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {history.map((cmd, index) => (
                  <div
                    key={index}
                    style={historyItemStyles}
                    onClick={() => selectFromHistory(cmd)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {cmd}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scanner controls */}
        <div style={controlsStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flex: 1 }}>
            <ScanLine size={20} style={{ color: captureEnabled ? '#4EC9B0' : '#888' }} />
            <span style={{ 
              color: '#D4D4D4', 
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium 
            }}>
              Captura de Escáner
            </span>
            <ToggleSwitch 
              checked={captureEnabled}
              onChange={() => setCaptureEnabled(prev => !prev)}
              label=""
              switchSize="medium"
            />
          </div>
          
          {captureEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <span style={{ color: '#888', fontSize: theme.typography.fontSize.xs }}>
                Auto-enviar:
              </span>
              <ToggleSwitch 
                checked={autoSubmit}
                onChange={() => setAutoSubmit(prev => !prev)}
                label=""
                switchSize="small"
              />
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default CommandInput; 