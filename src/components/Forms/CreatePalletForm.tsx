import React, { useState } from 'react';
import styles from './CreatePalletForm.module.css';
import {
  CALIBRE_OPTIONS,
  TURNO_OPTIONS,
  FORMATO_OPTIONS,
  EMPRESA_OPTIONS,
} from '../../utils/options';
import { generatePalletCode } from '../../utils/codeUtils';
import { useCreatePallet } from '../../hooks/useCreatePallet';

const CreatePalletForm: React.FC = () => {
  const { submit, data, loading, error } = useCreatePallet();
  const [createdAt] = useState(() => new Date());

  const [shift, setShift] = useState('');
  const [caliber, setCaliber] = useState('');
  const [formatId, setFormatId] = useState('');
  const [company, setCompany] = useState('');

  const isValid = shift && caliber && formatId && company;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const codigo = generatePalletCode(createdAt, shift, caliber, formatId, company);
    submit(codigo);
  };

  return (
    <div className={styles.form}>
      {/* Header with high-visibility title */}
      <div className={styles.form__header}>
        <h2 className={styles.form__title}>Crear Pallet</h2>
        <span className={styles.form__badge}>Nuevo</span>
      </div>
      
      <form 
        className={styles.form__body}
        onSubmit={handleSubmit}
      >
        {/* Form fields with improved touch targets */}
        <div className={styles.form__field}>
          <label className={styles.form__label}>Turno</label>
          <select
            className={styles.form__select}
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            <option value="" disabled>Seleccionar turno</option>
            {TURNO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label className={styles.form__label}>Calibre</label>
          <select
            className={styles.form__select}
            value={caliber}
            onChange={(e) => setCaliber(e.target.value)}
          >
            <option value="" disabled>Seleccionar calibre</option>
            {CALIBRE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label className={styles.form__label}>Formato</label>
          <select
            className={styles.form__select}
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
          >
            <option value="" disabled>Seleccionar formato</option>
            {FORMATO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.form__field}>
          <label className={styles.form__label}>Empresa</label>
          <select
            className={styles.form__select}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="" disabled>Seleccionar empresa</option>
            {EMPRESA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status messages with clear feedback */}
        {error && (
          <div className={`${styles.form__message} ${styles['form__message--error']}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles['form__message-icon']} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error.message}</span>
          </div>
        )}
        
        {data && (
          <div className={`${styles.form__message} ${styles['form__message--success']}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles['form__message-icon']} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Pallet #{data.code} creado exitosamente</span>
          </div>
        )}

        {/* Large, finger-friendly submit button */}
        <button
          className={styles.form__submit}
          disabled={!isValid || loading}
          type="submit"
        >
          {loading ? (
            <>
              <svg className={styles.form__spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creando...</span>
            </>
          ) : (
            'Crear Pallet'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePalletForm; 