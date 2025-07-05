import React, { useState } from 'react';
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
    <div className="bg-charcoal-800 rounded-lg shadow-lg border border-charcoal-700 overflow-hidden w-full max-w-lg">
      {/* Header with high-visibility title */}
      <div className="bg-charcoal-700 border-b border-charcoal-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-wide">Crear Pallet</h2>
        <span className="bg-accent-500 text-charcoal-900 px-3 py-1 rounded-full text-sm font-medium">Nuevo</span>
      </div>
      
      <form 
        className="flex flex-col gap-6 p-6"
        onSubmit={handleSubmit}
      >
        {/* Form fields with improved touch targets */}
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide text-gray-300 font-medium">Turno</label>
          <select
            className="bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600 text-lg cursor-pointer"
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

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide text-gray-300 font-medium">Calibre</label>
          <select
            className="bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600 text-lg cursor-pointer"
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

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide text-gray-300 font-medium">Formato</label>
          <select
            className="bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600 text-lg cursor-pointer"
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

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide text-gray-300 font-medium">Empresa</label>
          <select
            className="bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600 text-lg cursor-pointer"
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
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error.message}</span>
          </div>
        )}
        
        {data && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Pallet #{data.code} creado exitosamente</span>
          </div>
        )}

        {/* Large, finger-friendly submit button */}
        <button
          className="bg-accent-500 hover:bg-accent-600 text-charcoal-900 font-bold py-5 px-6 rounded-lg transition-colors mt-2 text-lg disabled:opacity-50 disabled:bg-charcoal-600 disabled:text-charcoal-400"
          disabled={!isValid || loading}
          type="submit"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-charcoal-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creando...</span>
            </div>
          ) : (
            'Crear Pallet'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePalletForm; 