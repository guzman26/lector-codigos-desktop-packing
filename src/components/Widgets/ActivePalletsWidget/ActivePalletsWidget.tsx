import React, { useState, useCallback, useMemo } from 'react';
import { useActivePallets } from '../../../hooks/useActivePallets';
import { PalletCard } from '../../Cards';
import WidgetCard from '../WidgetCard';
import Modal from '../../ui/Modal';
import { theme } from '../../../styles/theme';
import { Package2, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Pallet } from '../../../types';

/**
 * ActivePalletsWidget
 * 
 * Real-time display of active pallets with visual indicators:
 * - Live capacity tracking
 * - Fill rate metrics
 * - Visual warnings for near-full pallets
 * - Quick actions for pallet management
 * 
 * @rationale Operators need immediate visibility of active pallets
 * to prevent overflow and optimize production flow
 */
const ActivePalletsWidget: React.FC = () => {
  const { data, loading, error } = useActivePallets();
  const [open, setOpen] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState<Pallet | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'capacity' | 'rate'>('recent');

  // Calculate metrics for active pallets
  const metrics = useMemo(() => {
    if (!data.length) return null;

    const totalCapacity = data.reduce((sum, p) => sum + p.cantidadCajas, 0);
    const avgCapacity = totalCapacity / data.length;
    const nearFull = data.filter(p => (p.cantidadCajas / 100) >= 0.8).length;
    const criticalPallets = data.filter(p => (p.cantidadCajas / 100) >= 0.95);

    return {
      total: data.length,
      avgCapacity,
      nearFull,
      criticalPallets
    };
  }, [data]);

  // Sort pallets based on selection
  const sortedPallets = useMemo(() => {
    const sorted = [...data];
    
    switch (sortBy) {
      case 'capacity':
        return sorted.sort((a, b) => b.cantidadCajas - a.cantidadCajas);
      case 'rate':
        // Sort by fill rate (boxes per hour)
        return sorted.sort((a, b) => {
          const rateA = a.cantidadCajas / Math.max(1, (new Date().getTime() - new Date(a.fechaCreacion).getTime()) / (1000 * 60 * 60));
          const rateB = b.cantidadCajas / Math.max(1, (new Date().getTime() - new Date(b.fechaCreacion).getTime()) / (1000 * 60 * 60));
          return rateB - rateA;
        });
      default:
        // Recent first
        return sorted.sort((a, b) => 
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
    }
  }, [data, sortBy]);

  // Show preview of most critical pallets
  const previewPallets = sortedPallets.slice(0, 2);

  const handlePalletSelect = useCallback((pallet: Pallet) => {
    setSelectedPallet(pallet);
    // Could trigger navigation or action here
  }, []);

  const widgetContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  };

  const viewAllButtonStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.border.light}`,
    color: theme.colors.accent.blue,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  const sortControlsStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  };

  const sortButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    backgroundColor: isActive ? theme.colors.accent.blue : 'transparent',
    color: isActive ? 'white' : theme.colors.text.secondary,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing['2xl'],
    color: theme.colors.text.secondary,
  };

  const warningBannerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent.orange + '20',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.accent.orange}`,
    marginBottom: theme.spacing.md,
  };

  return (
    <>
      <WidgetCard 
        title="Pallets Activos" 
        icon={<Activity size={20} />}
        subtitle={loading ? 'Cargando...' : `${data.length} en proceso`}
      >
        <div style={widgetContentStyles}>

          {/* Critical pallets warning */}
          {metrics?.criticalPallets && metrics.criticalPallets.length > 0 && (
            <div style={warningBannerStyles}>
              <AlertTriangle size={20} style={{ color: theme.colors.accent.orange }} />
              <span style={{ 
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium 
              }}>
                {metrics.criticalPallets.length} pallet{metrics.criticalPallets.length > 1 ? 's' : ''} requiere{metrics.criticalPallets.length > 1 ? 'n' : ''} atención inmediata
              </span>
            </div>
          )}

          <div style={headerStyles}>
            <span style={{ 
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary 
            }}>
              Vista previa
            </span>
            <button
              type="button"
              style={viewAllButtonStyles}
              onClick={() => setOpen(true)}
              disabled={data.length === 0}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                e.currentTarget.style.borderColor = theme.colors.accent.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = theme.colors.border.light;
              }}
            >
              Ver todos
            </button>
          </div>

          {loading && (
            <div style={emptyStateStyles}>
              <p>Cargando pallets activos...</p>
            </div>
          )}

          {error && (
            <div style={{ ...emptyStateStyles, color: theme.colors.accent.red }}>
              <AlertTriangle size={24} style={{ marginBottom: theme.spacing.sm }} />
              <p>Error: {error.message}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div style={emptyStateStyles}>
              <Package2 size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
              <p>No hay pallets activos</p>
            </div>
          )}

          {!loading && !error && previewPallets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {previewPallets.map((pallet) => (
                <PalletCard
                  key={pallet.id}
                  pallet={pallet}
                  variant="compact"
                  onSelect={handlePalletSelect}
                  isSelected={selectedPallet?.id === pallet.id}
                  showProgress={true}
                />
              ))}
            </div>
          )}
        </div>
      </WidgetCard>

      <Modal 
        isOpen={open} 
        onClose={() => {
          setOpen(false);
          setSortBy('recent');
        }} 
        title="Pallets Activos"
        size="large"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
          {/* Sort controls */}
          <div style={sortControlsStyles}>
            <span style={{ 
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginRight: theme.spacing.sm 
            }}>
              Ordenar por:
            </span>
            <button
              style={sortButtonStyles(sortBy === 'recent')}
              onClick={() => setSortBy('recent')}
            >
              <TrendingUp size={14} style={{ marginRight: '4px', display: 'inline' }} />
              Más reciente
            </button>
            <button
              style={sortButtonStyles(sortBy === 'capacity')}
              onClick={() => setSortBy('capacity')}
            >
              <Package2 size={14} style={{ marginRight: '4px', display: 'inline' }} />
              Capacidad
            </button>
            <button
              style={sortButtonStyles(sortBy === 'rate')}
              onClick={() => setSortBy('rate')}
            >
              <Activity size={14} style={{ marginRight: '4px', display: 'inline' }} />
              Tasa de llenado
            </button>
          </div>

          {/* Pallet list */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: theme.spacing.md,
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: theme.spacing.xs,
            marginRight: `-${theme.spacing.xs}`,
          }}>
            {sortedPallets.length === 0 ? (
              <div style={emptyStateStyles}>
                <Package2 size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
                <p>No hay pallets activos en este momento</p>
              </div>
            ) : (
              sortedPallets.map((pallet) => (
                <PalletCard
                  key={pallet.id}
                  pallet={pallet}
                  variant="compact"
                  onSelect={handlePalletSelect}
                  isSelected={selectedPallet?.id === pallet.id}
                  showProgress={true}
                />
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ActivePalletsWidget; 