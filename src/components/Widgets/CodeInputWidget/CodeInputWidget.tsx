import React, { useState, useRef, useEffect, useCallback } from 'react';
import WidgetCard from '../WidgetCard';
import { Button, ToggleSwitch } from '../../ui';
import { ScanLine } from 'lucide-react';
import { theme } from '../../../styles/theme';

export interface CodeInputWidgetProps {
  data: {
    latestCode: string;
    history: string[];
  };
  onCodeSubmit?: (code: string) => void;
  onProcessCode?: (code: unknown) => Promise<void>;
}

/**
 * Widget for code input with automatic capture capability.
 * Allows users to manually input codes or toggle automatic capture from scanners.
 */
const CodeInputWidget: React.FC<CodeInputWidgetProps> = ({ data, onCodeSubmit, onProcessCode }) => {
  const { latestCode, history } = data;
  const [inputValue, setInputValue] = useState('');
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Enfoca el input al montar el componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Manejador de envío del formulario
  const handleSubmit = useCallback(async () => {
    const trimmedCode = inputValue.trim();
    if (!trimmedCode || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Procesar el código con el servicio si está disponible
      if (onProcessCode) {
        await onProcessCode(trimmedCode);
      }
      
      // Llamar al callback de envío si está disponible
      if (onCodeSubmit) {
        onCodeSubmit(trimmedCode);
      }
      
      // Limpiar el input después de un envío exitoso
      setInputValue('');
      setHasError(false);
    } catch (error) {
      console.error('Error al procesar código:', error);
      setHasError(true);
    } finally {
      setIsProcessing(false);
      
      // Re-enfocar el input después del envío para escaneo continuo
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [inputValue, isProcessing, onProcessCode, onCodeSubmit]);
  
  // Manejador de cambios en el input manual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (hasError) setHasError(false);
  };

  // Auto-envío cuando el código alcanza exactamente 126 dígitos
  useEffect(() => {
    if (inputValue.length === 126 && !isProcessing) {
      // Pequeño delay para asegurar que el scanner haya terminado
      const timer = setTimeout(() => {
        handleSubmit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [inputValue.length, isProcessing, handleSubmit]);
  
  // Manejador de teclas en el campo de entrada
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isProcessing) {
      handleSubmit();
    }
  };
  
  // Este efecto maneja la captura automática cuando está activada
  useEffect(() => {
    // Solo configurar el listener global si la captura está activada
    if (!captureEnabled) return;
    
    // Función para manejar teclas cuando el input no está enfocado
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Si el input ya está enfocado, dejar que el manejo normal funcione
      if (document.activeElement === inputRef.current) {
        return;
      }
      
      // Manejar caracteres alfanuméricos y símbolos comunes de escáner
      if (/^[a-zA-Z0-9\-_]$/.test(e.key)) {
        // Enfocar el input y agregar el carácter
        if (inputRef.current) {
          inputRef.current.focus();
          // En lugar de modificar el estado directamente, simular entrada de teclado
          // insertando el carácter en el campo de texto enfocado
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
            const newValue = inputValue + e.key;
            nativeInputValueSetter.call(inputRef.current, newValue);
            // Disparar un evento input para que React actualice su estado
            const inputEvent = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(inputEvent);
          }
        }
      }
    };
    
    // Agregar listener global de teclado
    window.addEventListener('keypress', handleGlobalKeyPress);
    
    return () => {
      window.removeEventListener('keypress', handleGlobalKeyPress);
    };
  }, [captureEnabled, inputValue]);
  
  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };
  
  const buttonStyles: React.CSSProperties = {
    marginLeft: theme.spacing.sm,
  };
  
  const inputContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    width: '100%',
  };
  
  const toggleContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.tertiary,
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.lg,
    border: `2px solid ${captureEnabled ? theme.colors.accent.blue : theme.colors.border.light}`,
    boxShadow: captureEnabled ? `0 0 0 2px ${theme.colors.accent.blue}20` : 'none',
    transition: 'all 0.2s ease',
  };
  
  const toggleLabelStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: captureEnabled ? theme.colors.accent.blue : theme.colors.text.primary,
    transition: 'color 0.2s ease',
  };

  return (
    <WidgetCard title="Code Input">
      {/* Input field and submit button */}
      <div style={inputContainerStyles}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Escanee o ingrese código..."
          style={{
            ...inputStyles,
            borderColor: hasError ? '#FF3B30' : theme.colors.border.light
          }}
          autoComplete="off"
          // Ensure keyboard is shown on mobile devices
          autoFocus
          // Allow brute force focus
          onClick={() => inputRef.current?.focus()}
        />
        <Button 
          onClick={handleSubmit} 
          style={buttonStyles}
          disabled={!inputValue.trim()}
        >
          Enviar
        </Button>
      </div>
      
      {/* Automatic capture toggle */}
      <div style={toggleContainerStyles}>
        <span style={toggleLabelStyles}>
          <ScanLine size={24} color={captureEnabled ? theme.colors.accent.blue : theme.colors.text.primary} />
          Captura automática
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: theme.spacing.xs }}>
          <ToggleSwitch
            checked={captureEnabled}
            onChange={() => setCaptureEnabled(prev => !prev)}
            label=""
            switchSize="large"
          />
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: captureEnabled ? theme.colors.accent.blue : theme.colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {captureEnabled ? 'ACTIVADA' : 'DESACTIVADA'}
          </span>
        </div>
      </div>
      
      {/* Display latest code and history */}
      {latestCode && (
        <div>
          <div style={{ 
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            marginBottom: theme.spacing.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border.light}`,
          }}>
            {latestCode}
          </div>
          
          {history.length > 0 && (
            <div>
              <h4 style={{ 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}>
                Historial reciente
              </h4>
              <ul style={{ 
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}>
                {history.map((code, idx) => (
                  <li key={`${code}-${idx}`} style={{
                    padding: `${theme.spacing.xs} 0`,
                    borderBottom: idx !== history.length - 1 ? `1px solid ${theme.colors.border.light}` : 'none',
                    fontSize: theme.typography.fontSize.sm,
                    fontFamily: theme.typography.fontFamily.mono,
                  }}>
                    {code}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </WidgetCard>
  );
};

export default CodeInputWidget; 