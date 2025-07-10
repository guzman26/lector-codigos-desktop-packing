import React, { useState, useCallback, useMemo } from 'react';
import { useUnassignedBoxesInPacking } from '../../../hooks/useUnassignedBoxesInPacking';
import { BoxCard } from '../../Cards';
import WidgetCard from '../WidgetCard';
import Modal from '../../Modal';
import { theme } from '../../../styles/theme';
import { Package, AlertTriangle, Search, Filter, CheckSquare, Square, ArrowUp, ArrowDown, Calendar, Ruler, User } from 'lucide-react';
import type { UnassignedBox } from '../../../types';

/**
 * UnassignedBoxesWidget - Enhanced
 * 
 * Improvements:
 * - Bulk selection and actions
 * - Advanced sorting options
 * - Filter by caliber, operator, date
 * - Collapsible box cards
 * - Better visual feedback
 * 
 * @rationale Operators need efficient ways to manage multiple boxes
 * and quickly find specific items in the factory environment
 */
const UnassignedBoxesWidget: React.FC = () => {
  const { data, loading, error } = useUnassignedBoxesInPacking();
  const [open, setOpen] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'caliber' | 'operator'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCaliber, setFilterCaliber] = useState<string>('all');
  const [filterOperator, setFilterOperator] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique calibers and operators for filters
  const { calibers, operators } = useMemo(() => {
    const uniqueCalibers = new Set<string>();
    const uniqueOperators = new Set<string>();
    
    data.forEach(box => {
      if (box.calibre) uniqueCalibers.add(box.calibre);
      if (box.operario) uniqueOperators.add(box.operario);
    });
    
    return {
      calibers: Array.from(uniqueCalibers).sort(),
      operators: Array.from(uniqueOperators).sort()
    };
  }, [data]);

  // Filter and sort boxes
  const processedBoxes = useMemo(() => {
    let filtered = data;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(box => 
        box.codigo.toLowerCase().includes(query) ||
        box.operario?.toLowerCase().includes(query) ||
        box.calibre?.toLowerCase().includes(query)
      );
    }
    
    // Apply caliber filter
    if (filterCaliber !== 'all') {
      filtered = filtered.filter(box => box.calibre === filterCaliber);
    }
    
    // Apply operator filter
    if (filterOperator !== 'all') {
      filtered = filtered.filter(box => box.operario === filterOperator);
    }
    
    // Sort boxes
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.fecha_registro || 0).getTime() - new Date(b.fecha_registro || 0).getTime();
          break;
        case 'caliber':
          comparison = (a.calibre || '').localeCompare(b.calibre || '');
          break;
        case 'operator':
          comparison = (a.operario || '').localeCompare(b.operario || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [data, searchQuery, filterCaliber, filterOperator, sortBy, sortOrder]);

  // Show only first 5 boxes in widget
  const previewBoxes = processedBoxes.slice(0, 5);

  const handleBoxSelect = useCallback((box: UnassignedBox) => {
    setSelectedBoxes(prev => {
      const next = new Set(prev);
      if (next.has(box.codigo)) {
        next.delete(box.codigo);
      } else {
        next.add(box.codigo);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedBoxes.size === processedBoxes.length) {
      setSelectedBoxes(new Set());
    } else {
      setSelectedBoxes(new Set(processedBoxes.map(box => box.codigo)));
    }
  }, [selectedBoxes, processedBoxes]);

  const handleBulkAssign = useCallback(() => {
    // Implement bulk assignment logic
    console.log('Assigning boxes:', Array.from(selectedBoxes));
    // Reset selection after action
    setSelectedBoxes(new Set());
  }, [selectedBoxes]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Styles
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

  const modalHeaderStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  };

  const searchBarStyles: React.CSSProperties = {
    position: 'relative',
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

  const filterBarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  };

  const filterSelectStyles: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    paddingRight: '36px',
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    fontSize: theme.typography.fontSize.sm,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2386868B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  const sortButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${isActive ? theme.colors.accent.blue : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: isActive ? theme.colors.accent.blue : 'transparent',
    color: isActive ? 'white' : theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  });

  const bulkActionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent.blue + '10',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: theme.spacing['2xl'],
    color: theme.colors.text.secondary,
  };

  const boxListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    maxHeight: '60vh',
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
                  isSelected={selectedBoxes.has(box.codigo)}
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
          setSelectedBoxes(new Set());
          setShowFilters(false);
        }} 
        title="Todas las Cajas Sin Asignar"
        size="large"
      >
        <div style={modalHeaderStyles}>
          {/* Search bar */}
          <div style={searchBarStyles}>
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

          {/* Filters and sorting */}
          <div style={filterBarStyles}>
            <button
              style={{
                ...sortButtonStyles(false),
                gap: theme.spacing.xs,
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filtros {showFilters ? '▲' : '▼'}
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: theme.spacing.sm }}>
              <button
                style={sortButtonStyles(sortBy === 'date')}
                onClick={() => toggleSort('date')}
              >
                <Calendar size={16} />
                Fecha
                {sortBy === 'date' && (sortOrder === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />)}
              </button>
              <button
                style={sortButtonStyles(sortBy === 'caliber')}
                onClick={() => toggleSort('caliber')}
              >
                <Ruler size={16} />
                Calibre
                {sortBy === 'caliber' && (sortOrder === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />)}
              </button>
              <button
                style={sortButtonStyles(sortBy === 'operator')}
                onClick={() => toggleSort('operator')}
              >
                <User size={16} />
                Operario
                {sortBy === 'operator' && (sortOrder === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />)}
              </button>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div style={{ 
              display: 'flex', 
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.md,
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs
                }}>
                  Calibre
                </label>
                <select
                  value={filterCaliber}
                  onChange={(e) => setFilterCaliber(e.target.value)}
                  style={filterSelectStyles}
                >
                  <option value="all">Todos los calibres</option>
                  {calibers.map(cal => (
                    <option key={cal} value={cal}>{cal}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.xs
                }}>
                  Operario
                </label>
                <select
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value)}
                  style={filterSelectStyles}
                >
                  <option value="all">Todos los operarios</option>
                  {operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results info */}
        <div style={{ 
          fontSize: theme.typography.fontSize.sm, 
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.md,
        }}>
          Mostrando {processedBoxes.length} de {data.length} cajas
          {selectedBoxes.size > 0 && ` • ${selectedBoxes.size} seleccionadas`}
        </div>

        {/* Bulk actions bar */}
        {selectedBoxes.size > 0 && (
          <div style={bulkActionsStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <button
                onClick={handleSelectAll}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  background: 'none',
                  border: 'none',
                  color: theme.colors.accent.blue,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {selectedBoxes.size === processedBoxes.length ? <CheckSquare size={18} /> : <Square size={18} />}
                {selectedBoxes.size === processedBoxes.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
              <span style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm }}>
                {selectedBoxes.size} {selectedBoxes.size === 1 ? 'caja seleccionada' : 'cajas seleccionadas'}
              </span>
            </div>

            <button
              onClick={handleBulkAssign}
              style={{
                ...viewAllButtonStyles,
                backgroundColor: theme.colors.accent.blue,
                color: 'white',
                border: 'none',
              }}
            >
              Asignar a Pallet
            </button>
          </div>
        )}

        {/* Box list */}
        <div style={boxListStyles}>
          {processedBoxes.length === 0 ? (
            <div style={emptyStateStyles}>
              <Search size={32} style={{ opacity: 0.5, marginBottom: theme.spacing.sm }} />
              <p>No se encontraron cajas que coincidan con los filtros</p>
            </div>
          ) : (
            processedBoxes.map((box) => (
              <BoxCard
                key={box.codigo}
                box={box}
                variant="default"
                onSelect={handleBoxSelect}
                isSelected={selectedBoxes.has(box.codigo)}
                defaultExpanded={false}
              />
            ))
          )}
        </div>
      </Modal>
    </>
  );
};

export default UnassignedBoxesWidget; 