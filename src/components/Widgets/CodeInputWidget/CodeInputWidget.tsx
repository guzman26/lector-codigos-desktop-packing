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
 * Widget for code input with automatic capture and submission.
 * Input is always focused and ready to receive barcode scanner input.
 * Automatically submits codes when they reach 16 or 126 digits.
 * Global key capture is always active for seamless barcode scanning.
 */
const CodeInputWidget: React.FC<CodeInputWidgetProps> = ({ data, onCodeSubmit, onProcessCode }) => {
  const { latestCode, history } = data;
  const [inputValue, setInputValue] = useState('');
  const [captureEnabled, setCaptureEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const processingTimeoutRef = useRef<number | null>(null);
  const autoSubmitTimeoutRef = useRef<number | null>(null);
  
  // Enfoca el input al montar el componente y cuando se activa la captura automática
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Mantener el input siempre enfocado para captura automática
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Verificar periodicamente que el input sigue enfocado
      const focusInterval = setInterval(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
      
      return () => clearInterval(focusInterval);
    }
  }, []);
  
  // Manejador de envío del formulario
  const handleSubmit = useCallback(async () => {
    const trimmedCode = inputValue.trim();
    if (!trimmedCode || isProcessing) return;
    
    // Limpiar cualquier timeout pendiente
    if (processingTimeoutRef.current) {
      window.clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    
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
      // Usar un timeout mínimo para evitar conflictos con códigos rápidos
      processingTimeoutRef.current = window.setTimeout(() => {
        setIsProcessing(false);
        
        // Re-enfocar el input después del envío para escaneo continuo
        if (inputRef.current) {
          inputRef.current.focus();
        }
        
        processingTimeoutRef.current = null;
      }, 200);
    }
  }, [inputValue, isProcessing, onProcessCode, onCodeSubmit]);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
      if (autoSubmitTimeoutRef.current) {
        window.clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, []);
  
  // Manejador de cambios en el input manual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (hasError) setHasError(false);
  };

  // Auto-envío cuando el código alcanza 16 dígitos (cajas) o 126 dígitos (otros códigos)
  // Siempre activo, independientemente del estado del toggle
  useEffect(() => {
    // Limpiar timeout anterior
    if (autoSubmitTimeoutRef.current) {
      window.clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }
    
    const shouldAutoSubmit = (inputValue.length === 16 || inputValue.length === 126) && !isProcessing;
    
    if (shouldAutoSubmit) {
      // Delay para asegurar que el scanner haya terminado
      autoSubmitTimeoutRef.current = window.setTimeout(() => {
        handleSubmit();
        autoSubmitTimeoutRef.current = null;
      }, 150);
    }
    
    return () => {
      if (autoSubmitTimeoutRef.current) {
        window.clearTimeout(autoSubmitTimeoutRef.current);
        autoSubmitTimeoutRef.current = null;
      }
    };
  }, [inputValue.length, isProcessing, handleSubmit]);

  // Listener global para Enter - envía el código desde cualquier parte de la página
  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      // Solo procesar si hay contenido y no estamos procesando
      if (e.key === 'Enter' && inputValue.trim() && !isProcessing) {
        // Verificar que no estemos en inputs que manejan modales o formularios críticos
        const target = e.target as HTMLElement;
        const isInModal = target.closest('[role="dialog"]') !== null;
        const isInSearchInput = target.closest('[data-search-input]') !== null;
        
        // Solo interceptar Enter si no estamos en un modal o input de búsqueda crítico
        if (!isInModal && !isInSearchInput) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalEnter);
    return () => document.removeEventListener('keydown', handleGlobalEnter);
  }, [inputValue, isProcessing, handleSubmit]);
  
  // Manejador de teclas en el campo de entrada
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isProcessing) {
      handleSubmit();
    }
  };
  
  // Este efecto maneja la captura automática global - siempre activa
  useEffect(() => {
    // Función para manejar teclas cuando el input no está enfocado o para capturar input global
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignorar teclas de modificación, funciones, etc.
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
        return;
      }
      
      // Si estamos procesando, ignorar nuevas entradas
      if (isProcessing) {
        e.preventDefault();
        return;
      }
      
      // Captura global siempre activa para escáneres automáticos
      // El toggle ahora solo controla la visualización, no la funcionalidad
      
      // Expandir el patrón para incluir más caracteres que los escáneres pueden enviar
      // Incluir números, letras, guiones, guiones bajos, puntos, espacios, y otros símbolos comunes
      if (/^[a-zA-Z0-9\-_\.\s\+\=\/\\\|]$/.test(e.key)) {
        // Asegurar que el input esté enfocado
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
        
        // Si el input no está enfocado, capturar la tecla y agregarla manualmente
        if (document.activeElement !== inputRef.current && inputRef.current) {
          e.preventDefault();
          
          // Usar el valor actual del input desde el DOM para evitar problemas de estado stale
          const currentValue = inputRef.current.value || '';
          const newValue = currentValue + e.key;
          
          // Actualizar el valor directamente y disparar evento
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(inputRef.current, newValue);
            // Disparar un evento input para que React actualice su estado
            const inputEvent = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(inputEvent);
          }
        }
      }
    };
    
    // Usar keydown en lugar de keypress para mejor captura de caracteres
    document.addEventListener('keydown', handleGlobalKeyDown, true);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [isProcessing]);
  
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
          placeholder="Siempre listo para escanear - envío automático a 16/126 dígitos"
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
      
      {/* Status indicator - capture is always active for barcode scanning */}
      <div style={toggleContainerStyles}>
        <span style={toggleLabelStyles}>
          <ScanLine size={24} color={captureEnabled ? theme.colors.accent.blue : theme.colors.text.primary} />
          Modo activo
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