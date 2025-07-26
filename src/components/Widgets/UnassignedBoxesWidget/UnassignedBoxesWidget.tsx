import React, { useState, useMemo } from 'react';
import { useUnassignedBoxesInPacking } from '../../../hooks/useUnassignedBoxesInPacking';
import { BoxCard } from '../../Cards';
import WidgetCard from '../WidgetCard';
import Modal from '../../ui/Modal';
import { Package, AlertTriangle, Search, Filter, ArrowUp, ArrowDown, Calendar, Ruler, User } from 'lucide-react';

/**
 * UnassignedBoxesWidget - macOS-styled with enhanced UX
 * 
 * Features:
 * - Clean macOS-inspired design
 * - Advanced sorting and filtering
 * - Touch-optimized interactions
 * - Elegant visual hierarchy
 * 
 * @rationale Operators need efficient ways to manage multiple boxes
 * and quickly find specific items in the factory environment
 */
const UnassignedBoxesWidget: React.FC = () => {
  const { data, loading, error, refresh } = useUnassignedBoxesInPacking();
  const [open, setOpen] = useState(false);
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

  // Show first 6 boxes in widget for better density
  const previewBoxes = processedBoxes.slice(0, 6);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setSearchQuery('');
    setShowFilters(false);
  };

  // macOS-style components
  const MacOSSearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) => (
    <div style={{
      position: 'relative',
      marginBottom: '16px',
    }}>
      <Search size={16} style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9CA3AF',
      }} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px 10px 36px',
          fontSize: '14px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#1F2937',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3B82F6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );

  const MacOSButton = ({ 
    children, 
    onClick, 
    variant = 'secondary', 
    isActive = false,
    style = {}
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    variant?: 'primary' | 'secondary'; 
    isActive?: boolean;
    style?: React.CSSProperties;
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        border: variant === 'primary' ? 'none' : `1px solid ${isActive ? '#3B82F6' : 'rgba(0, 0, 0, 0.1)'}`,
        borderRadius: '8px',
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
          : isActive 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        color: variant === 'primary' ? 'white' : isActive ? '#3B82F6' : '#6B7280',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: variant === 'primary' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
          e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        } else {
          e.currentTarget.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)';
        }
      }}
    >
      {children}
    </button>
  );

  const MacOSSelect = ({ value, onChange, options, placeholder }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: '13px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        color: '#1F2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <option value="all">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );

  return (
    <>
      <WidgetCard 
        title="Cajas Sin Asignar" 
        icon={<Package size={20} />}
        subtitle={loading ? 'Cargando...' : `${data.length} cajas en empaque`}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: data.length > 10 ? '#FEF3C7' : '#DBEAFE',
              color: data.length > 10 ? '#92400E' : '#1E40AF',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: '700',
              border: `1px solid ${data.length > 10 ? '#FCD34D' : '#93C5FD'}`,
            }}>
              {data.length > 10 && <AlertTriangle size={10} />}
              {data.length} {data.length === 1 ? 'caja' : 'cajas'}
            </div>
            
            <MacOSButton
              onClick={() => setOpen(true)}
              variant="primary"
              style={{ 
                opacity: data.length === 0 ? 0.5 : 1,
                padding: '6px 12px',
                fontSize: '11px',
              }}
            >
              Ver todas
            </MacOSButton>
          </div>

          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#6B7280',
              fontSize: '12px',
            }}>
              <p style={{ margin: 0 }}>Cargando cajas...</p>
            </div>
          )}

          {error && (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(220, 38, 38, 0.2)',
            }}>
              <AlertTriangle size={20} style={{ marginBottom: '6px' }} />
              <p style={{ margin: 0, fontSize: '12px' }}>Error: {error.message}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '24px 20px',
              color: '#6B7280',
            }}>
              <Package size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
              <p style={{ fontSize: '12px', margin: 0, fontWeight: '500' }}>No hay cajas sin asignar</p>
            </div>
          )}

          {!loading && !error && previewBoxes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {previewBoxes.map((box) => (
                <BoxCard
                  key={box.codigo}
                  box={box}
                  variant="compact"
                  showActions={false} // Hide actions in preview
                  onActionComplete={() => {
                    refresh();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </WidgetCard>

      <Modal 
        isOpen={open} 
        onClose={handleModalClose} 
        title="Todas las Cajas Sin Asignar"
        size="large"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '100%',
        }}>
          {/* Search and Controls */}
          <div style={{
            padding: '16px 20px 0 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            paddingBottom: '16px',
          }}>
            <MacOSSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, operario o calibre..."
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                <MacOSButton
                  onClick={() => setShowFilters(!showFilters)}
                  isActive={showFilters}
                >
                  <Filter size={14} />
                  Filtros
                </MacOSButton>

                <MacOSButton
                  onClick={() => toggleSort('date')}
                  isActive={sortBy === 'date'}
                >
                  <Calendar size={14} />
                  Fecha
                  {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </MacOSButton>

                <MacOSButton
                  onClick={() => toggleSort('caliber')}
                  isActive={sortBy === 'caliber'}
                >
                  <Ruler size={14} />
                  Calibre
                  {sortBy === 'caliber' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </MacOSButton>

                <MacOSButton
                  onClick={() => toggleSort('operator')}
                  isActive={sortBy === 'operator'}
                >
                  <User size={14} />
                  Operario
                  {sortBy === 'operator' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </MacOSButton>
              </div>
            </div>

            {showFilters && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '6px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Calibre
                  </label>
                  <MacOSSelect
                    value={filterCaliber}
                    onChange={setFilterCaliber}
                    options={calibers.map(cal => ({ value: cal, label: cal }))}
                    placeholder="Todos los calibres"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '6px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Operario
                  </label>
                  <MacOSSelect
                    value={filterOperator}
                    onChange={setFilterOperator}
                    options={operators.map(op => ({ value: op, label: op }))}
                    placeholder="Todos los operarios"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results info */}
          <div style={{
            padding: '0 20px',
            fontSize: '13px',
            color: '#6B7280',
            fontWeight: '500',
          }}>
            Mostrando {processedBoxes.length} de {data.length} cajas
          </div>

          {/* Box list */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '0 20px 20px 20px',
          }}>
            {processedBoxes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '64px 32px',
                color: '#6B7280',
              }}>
                <Search size={32} style={{ opacity: 0.5, marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', margin: 0 }}>No se encontraron cajas que coincidan con los filtros</p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {processedBoxes.map((box) => (
                  <BoxCard
                    key={box.codigo}
                    box={box}
                    variant="default"
                    defaultExpanded={false}
                    showActions={true}
                    onActionComplete={() => {
                      refresh();
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnassignedBoxesWidget; 