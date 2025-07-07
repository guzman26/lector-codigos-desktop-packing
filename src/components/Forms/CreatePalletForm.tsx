import React, { useState } from 'react';
import {
  CALIBRE_OPTIONS,
  TURNO_OPTIONS,
  FORMATO_OPTIONS,
  EMPRESA_OPTIONS,
} from '../../utils/options';
import { generatePalletCode } from '../../utils/codeUtils';
import { useCreatePallet } from '../../hooks/useCreatePallet';
import { Card, Select, Button, ProgressBar } from '../ui';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { theme } from '../../styles/theme';

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

  const messageStyles = (success: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: success ? theme.colors.accent.green + '20' : theme.colors.accent.red + '20',
    color: success ? theme.colors.accent.green : theme.colors.accent.red,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
  });

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
          <Select
            label="Turno"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            options={[{ value: '', label: 'Seleccionar turno' }, ...TURNO_OPTIONS]}
            fullWidth
          />
          <Select
            label="Calibre"
            value={caliber}
            onChange={(e) => setCaliber(e.target.value)}
            options={[{ value: '', label: 'Seleccionar calibre' }, ...CALIBRE_OPTIONS]}
            fullWidth
          />
          <Select
            label="Formato"
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            options={[{ value: '', label: 'Seleccionar formato' }, ...FORMATO_OPTIONS]}
            fullWidth
          />
          <Select
            label="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            options={[{ value: '', label: 'Seleccionar empresa' }, ...EMPRESA_OPTIONS]}
            fullWidth
          />
        </div>

        {error && (
          <div style={messageStyles(false)}>
            <AlertCircle size={18} />
            <span>{error.message}</span>
          </div>
        )}

        {data && (
          <div style={messageStyles(true)}>
            <CheckCircle size={18} />
            <span>Pallet #{data.code} creado exitosamente</span>
          </div>
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