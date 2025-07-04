import React, { useState } from 'react';
import {
  CALIBRE_OPTIONS,
  TURNO_OPTIONS,
  FORMATO_OPTIONS,
  EMPRESA_OPTIONS,
} from '../../utils/options';
import { generatePalletCode } from '../../utils/codeUtils';
import { useCreatePallet } from '../../hooks/useCreatePallet';
import styles from './CreatePalletForm.module.css';

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Crear Pallet</h2>

      <label className={styles.label}>
        Turno
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          {TURNO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Calibre
        <select value={caliber} onChange={(e) => setCaliber(e.target.value)}>
          {CALIBRE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Formato
        <select value={formatId} onChange={(e) => setFormatId(e.target.value)}>
          {FORMATO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Empresa
        <select value={company} onChange={(e) => setCompany(e.target.value)}>
          {EMPRESA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <button className={styles.button} disabled={!isValid || loading}>
        {loading ? 'Creando…' : 'Crear'}
      </button>

      {error && <p className={styles.error}>{error.message}</p>}
      {data && <p className={styles.success}>Pallet #{data.code} creado</p>}
    </form>
  );
};

export default CreatePalletForm; 