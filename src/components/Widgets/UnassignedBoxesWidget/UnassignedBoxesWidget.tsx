import React, { useState, useCallback, useMemo } from 'react';
import { useUnassignedBoxesInPacking } from '../../../hooks/useUnassignedBoxesInPacking';
import { BoxCard } from '../../Cards';
import WidgetCard from '../WidgetCard';
import Modal from '../../Modal';
import { theme } from '../../../styles/theme';
import { Package, AlertTriangle, Search } from 'lucide-react';
import type { UnassignedBox } from '../../../types';

/**
 * UnassignedBoxesWidget
 * 
 * Improved widget for displaying unassigned boxes with better UX:
 * - Uses BoxCard component for consistent, touch-friendly display
 * - Shows visual status indicators
 * - Provides search/filter functionality
 * - Optimized for touchscreen interaction
 * 
 * @rationale Enhances usability for factory operators by providing
 * at-a-glance information and reducing cognitive load
 */
const UnassignedBoxesWidget: React.FC = () => {
  const { data, loading, error } = useUnassignedBoxesInPacking();
  const [open, setOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<UnassignedBox | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter boxes based on search query
  const filteredBoxes = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(box => 
      box.codigo.toLowerCase().includes(query) ||
      box.operario?.toLowerCase().includes(query) ||
      box.calibre?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Show only first 5 boxes in widget, all in modal
  const previewBoxes = filteredBoxes.slice(0, 5);

  const handleBoxSelect = useCallback((box: UnassignedBox) => {
    setSelectedBox(box);
    // Here you could trigger an action like assigning the box to a pallet
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

  const countBadgeStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: data.length > 10 ? theme.colors.accent.orange : theme.colors.accent.blue,
    color: 'white',
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
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

  const boxListStyles: React.CSSProperties = {
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
        title="Cajas Sin Asignar" 
        icon={<Package size={20} />}
        subtitle={loading ? 'Cargando...' : `${data.length} cajas en empaque`}
      >
        <div style={widgetContentStyles}>
          <div style={headerStyles}>
            <span style={countBadgeStyles}>
              {data.length > 10 && <AlertTriangle size={14} />}
              {data.length} {data.length === 1 ? 'caja' : 'cajas'}
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
              Ver todas
            </button>
          </div>

          {loading && (
            <div style={emptyStateStyles}>
              <p>Cargando cajas...</p>
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
              <Package size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
              <p>No hay cajas sin asignar</p>
            </div>
          )}

          {!loading && !error && previewBoxes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
              {previewBoxes.map((box) => (
                <BoxCard
                  key={box.codigo}
                  box={box}
                  variant="compact"
                  onSelect={handleBoxSelect}
                  isSelected={selectedBox?.codigo === box.codigo}
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
        }} 
        title="Todas las Cajas Sin Asignar"
      >
        <div style={modalContentStyles}>
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
              placeholder="Buscar por código, operario o calibre..."
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

          {/* Results count */}
          <div style={{ 
            fontSize: theme.typography.fontSize.sm, 
            color: theme.colors.text.secondary 
          }}>
            Mostrando {filteredBoxes.length} de {data.length} cajas
          </div>

          {/* Box list */}
          <div style={boxListStyles}>
            {filteredBoxes.length === 0 ? (
              <div style={emptyStateStyles}>
                <Search size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
                <p>No se encontraron cajas que coincidan con "{searchQuery}"</p>
              </div>
            ) : (
              filteredBoxes.map((box) => (
                <BoxCard
                  key={box.codigo}
                  box={box}
                  variant="default"
                  onSelect={handleBoxSelect}
                  isSelected={selectedBox?.codigo === box.codigo}
                />
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnassignedBoxesWidget; 