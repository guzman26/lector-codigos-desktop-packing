import React, { useState } from 'react';
import {
  CALIBRE_OPTIONS,
  TURNO_OPTIONS,
  FORMATO_OPTIONS,
  EMPRESA_OPTIONS,
} from '../../utils/options';
import { generatePalletCode } from '../../utils/codeUtils';
import { useCreatePallet } from '../../hooks/useCreatePallet';
import { Card, Select, Button, ProgressBar, Alert, Input } from '../ui';
import { theme } from '../../styles/theme';

const CreatePalletForm: React.FC = () => {
  const { submit, data, loading, error } = useCreatePallet();
  const [createdAt] = useState(() => new Date());

  const [shifts, setShifts] = useState<string[]>([]);
  const [caliber, setCaliber] = useState('');
  const [formatId, setFormatId] = useState('');
  const [company, setCompany] = useState('');
  const [maxBoxes, setMaxBoxes] = useState<string>('');

  const isValid = shifts.length > 0 && caliber && formatId && company && (maxBoxes === '' || (/^\d+$/.test(maxBoxes) && Number(maxBoxes) > 0));

  const handleShiftToggle = (shiftValue: string) => {
    setShifts((prev) => {
      if (prev.includes(shiftValue)) {
        return prev.filter((s) => s !== shiftValue);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, shiftValue];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Usar el primer turno para el código base
    const codigo = generatePalletCode(createdAt, shifts[0], caliber, formatId, company);
    // codigo is the 11-digit base code; backend will append 3-digit suffix
    submit(codigo, maxBoxes === '' ? undefined : Number(maxBoxes), shifts);
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  };

  const badgeStyles: React.CSSProperties = {
    backgroundColor: theme.colors.accent.green,
    color: theme.colors.text.inverse,
    borderRadius: theme.borderRadius.full,
    padding: `0 ${theme.spacing.sm}`,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  const fieldGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
  };

  return (
    <Card variant="elevated" padding="large">
      <div style={headerStyles}>
        <h2 style={{
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.semibold,
          margin: 0,
        }}>Crear Pallet</h2>
        <span style={badgeStyles}>Nuevo</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={fieldGridStyles}>
          {/* Turnos (Checkboxes) */}
          <div>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              Turnos (máximo 3)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {TURNO_OPTIONS.map((option) => (
                <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={shifts.includes(option.value)}
                    onChange={() => handleShiftToggle(option.value)}
                    disabled={!shifts.includes(option.value) && shifts.length >= 3}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: theme.typography.fontSize.sm }}>{option.label}</span>
                </label>
              ))}
            </div>
            {shifts.length >= 3 && (
              <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                Máximo 3 turnos seleccionados
              </p>
            )}
          </div>

          <Select
            label="Calibre"
            value={caliber}
            onChange={(e) => setCaliber(e.target.value)}
            options={CALIBRE_OPTIONS}
            fullWidth
          />
          <Select
            label="Formato"
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            options={FORMATO_OPTIONS}
            fullWidth
          />
          <Select
            label="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            options={EMPRESA_OPTIONS}
            fullWidth
          />
          <Input
            label="Máx. cajas por pallet"
            type="number"
            min={1}
            step={1}
            value={maxBoxes}
            onChange={(e) => setMaxBoxes(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="Opcional (vacío usa 60)"
            fullWidth
          />
        </div>

        {error && (
          <Alert variant="error" dismissible onClose={() => { /* optional */ }}>
            {error.message}
          </Alert>
        )}

        {data && (
          <Alert variant="success">
            Pallet #{data.codigo} creado exitosamente
          </Alert>
        )}

        {loading && (
          <ProgressBar value={75} striped showLabel />
        )}

        <div style={{ marginTop: theme.spacing['2xl'], display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="large" disabled={!isValid || loading} type="submit">
            {loading ? 'Creando...' : 'Crear Pallet'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePalletForm; 