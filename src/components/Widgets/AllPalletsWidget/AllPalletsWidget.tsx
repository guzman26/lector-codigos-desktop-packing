import React, { useState, useCallback, useMemo } from 'react';
import { useAllPallets } from '../../../hooks/useAllPallets';
import { PalletCard } from '../../Cards';
import WidgetCard from '../WidgetCard';
import Modal from '../../Modal';
import { theme } from '../../../styles/theme';
import { Package2, AlertCircle, Search, Filter } from 'lucide-react';
import type { Pallet } from '../../../types';

/**
 * AllPalletsWidget
 * 
 * Enhanced widget for displaying all pallets with improved UX:
 * - Uses PalletCard component for rich, visual display
 * - Shows capacity indicators and status
 * - Provides search and filter functionality
 * - Optimized for quick status assessment
 * 
 * @rationale Helps operators quickly identify pallet status
 * and capacity at a glance, reducing decision-making time
 */
const AllPalletsWidget: React.FC = () => {
  const { data, loading, error } = useAllPallets();
  const [open, setOpen] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState<Pallet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter pallets based on search and status
  const filteredPallets = useMemo(() => {
    let filtered = data;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pallet => 
        pallet.codigo.toLowerCase().includes(query) ||
        pallet.ubicacion.toLowerCase().includes(query) ||
        pallet.id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pallet => 
        pallet.estado.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    return filtered;
  }, [data, searchQuery, statusFilter]);

  // Get unique statuses for filter
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(data.map(p => p.estado));
    return Array.from(statuses);
  }, [data]);

  // Show only first 3 pallets in widget
  const previewPallets = filteredPallets.slice(0, 3);

  // Get status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(pallet => {
      counts[pallet.estado] = (counts[pallet.estado] || 0) + 1;
    });
    return counts;
  }, [data]);

  const handlePalletSelect = useCallback((pallet: Pallet) => {
    setSelectedPallet(pallet);
    // Here you could navigate to pallet details or trigger an action
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

  const statsStyles: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  };

  const statBadgeStyles = (status: string): React.CSSProperties => ({
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    backgroundColor: getStatusBackgroundColor(status),
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  });

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
      case 'en proceso':
        return theme.colors.accent.blue;
      case 'completo':
      case 'cerrado':
        return theme.colors.accent.green;
      case 'pausado':
        return theme.colors.accent.orange;
      case 'error':
      case 'problema':
        return theme.colors.accent.red;
      default:
        return theme.colors.text.secondary;
    }
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

  const searchInputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    paddingLeft: '44px',
    fontSize: theme.typography.fontSize.base,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  const filterButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    border: `1px solid ${isActive ? theme.colors.accent.blue : theme.colors.border.light}`,
    backgroundColor: isActive ? theme.colors.accent.blue : 'transparent',
    color: isActive ? 'white' : theme.colors.text.primary,
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing['2xl'],
    color: theme.colors.text.secondary,
  };

  const modalContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
    maxHeight: '70vh',
    overflow: 'hidden',
  };

  const palletListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    overflow: 'auto',
    padding: theme.spacing.xs,
    marginRight: `-${theme.spacing.xs}`,
  };

  return (
    <>
      <WidgetCard 
        title="Todos los Pallets" 
        icon={<Package2 size={20} />}
        subtitle={loading ? 'Cargando...' : `${data.length} pallets en total`}
      >
        <div style={widgetContentStyles}>
          {/* Status summary */}
          {!loading && !error && Object.keys(statusCounts).length > 0 && (
            <div style={statsStyles}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <span key={status} style={statBadgeStyles(status)}>
                  {status}: {count}
                </span>
              ))}
            </div>
          )}

          <div style={headerStyles}>
            <span style={{ 
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary 
            }}>
              {filteredPallets.length} pallets
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
              <p>Cargando pallets...</p>
            </div>
          )}

          {error && (
            <div style={{ ...emptyStateStyles, color: theme.colors.accent.red }}>
              <AlertCircle size={24} style={{ marginBottom: theme.spacing.sm }} />
              <p>Error: {error.message}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div style={emptyStateStyles}>
              <Package2 size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
              <p>No hay pallets registrados</p>
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
          setSearchQuery('');
          setStatusFilter('all');
        }} 
        title="Todos los Pallets"
      >
        <div style={modalContentStyles}>
          {/* Search and filter controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {/* Search bar */}
            <div style={{ position: 'relative' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: theme.spacing.md, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: theme.colors.text.secondary 
                }} 
              />
              <input
                type="text"
                placeholder="Buscar por código, ID o ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyles}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.accent.blue;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.colors.accent.blue}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border.light;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status filters */}
            <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <Filter size={16} style={{ color: theme.colors.text.secondary }} />
              <button
                style={filterButtonStyles(statusFilter === 'all')}
                onClick={() => setStatusFilter('all')}
              >
                Todos
              </button>
              {uniqueStatuses.map(status => (
                <button
                  key={status}
                  style={filterButtonStyles(statusFilter === status)}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.text.secondary 
          }}>
            Mostrando {filteredPallets.length} de {data.length} pallets
          </div>

          {/* Pallet list */}
          <div style={palletListStyles}>
            {filteredPallets.length === 0 ? (
              <div style={emptyStateStyles}>
                <Search size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
                <p>No se encontraron pallets que coincidan con los filtros</p>
              </div>
            ) : (
              filteredPallets.map((pallet) => (
                <PalletCard
                  key={pallet.id}
                  pallet={pallet}
                  variant="default"
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

export default AllPalletsWidget; 