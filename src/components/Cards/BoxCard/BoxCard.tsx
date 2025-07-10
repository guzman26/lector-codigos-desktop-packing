import React, { memo, useState } from 'react';
import type { UnassignedBox } from '../../../types';
import { theme } from '../../../styles/theme';
import styles from './BoxCard.module.css';
import { Package, Calendar, Ruler, User, MapPin, Hash, ChevronDown, ChevronRight, Clock, BarChart, Plus, ArrowRight } from 'lucide-react';
import { useCreateSingleBoxPallet } from '../../../hooks/useCreateSingleBoxPallet';
import { useAssignBoxToCompatiblePallet } from '../../../hooks/useAssignBoxToCompatiblePallet';

interface BoxCardProps {
  box: UnassignedBox;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  defaultExpanded?: boolean;
  onActionComplete?: () => void; // Callback to refresh data after successful action
}

/**
 * BoxCard Component - Compact macOS-styled with enhanced density
 * 
 * Optimized for showing maximum information in minimal space
 * while maintaining readability and touch-friendly interactions.
 */
export const BoxCard = memo<BoxCardProps>(({ 
  box, 
  variant = 'default',
  showActions = true,
  defaultExpanded = false,
  onActionComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || variant === 'detailed');
  const createSinglePallet = useCreateSingleBoxPallet();
  const assignToCompatible = useAssignBoxToCompatiblePallet();
  
  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCreateSinglePallet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ubicacion = box.ubicacion || 'PACKING';
    await createSinglePallet.submit(box.codigo, ubicacion);
    if (createSinglePallet.response?.success && onActionComplete) {
      onActionComplete();
    }
  };

  const handleAssignToCompatible = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await assignToCompatible.submit(box.codigo);
    if (assignToCompatible.response?.success && onActionComplete) {
      onActionComplete();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getStatusColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
      case 'disponible':
        return '#10B981';
      case 'asignado':
        return '#3B82F6';
      case 'inactivo':
      case 'procesado':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  // Determine if we should show expand button
  const hasAdditionalInfo = box.ubicacion || box.formato_caja || box.semana || box.año || box.horario_proceso;
  const showExpandButton = variant !== 'compact' && hasAdditionalInfo;

  // Compact variant - ultra-dense layout
  if (variant === 'compact') {
    return (
      <article 
        className={`${styles.boxCard} ${styles.compact}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '6px',
          padding: '8px 12px',
          marginBottom: '4px',
          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease',
        }}
        aria-label={`Caja ${box.codigo}`}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}>
          {/* Left: Icon + Code + Essential Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            minWidth: 0,
          }}>
            <Package size={14} color="#6B7280" style={{ flexShrink: 0 }} />
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              flex: 1,
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}>
                {box.codigo}
              </h3>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                color: '#9CA3AF',
                marginTop: '1px',
              }}>
                <Clock size={9} />
                <span>{formatDate(box.fecha_registro)}</span>
                {formatTime(box.fecha_registro) && (
                  <span>{formatTime(box.fecha_registro)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Key Info in Compact Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            flexShrink: 0,
          }}>
            {box.calibre && (
              <span style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '9px',
              }}>
                {box.calibre}
              </span>
            )}
            
            {box.operario && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '9px',
              }}>
                {box.operario}
              </span>
            )}
          </div>

          {/* Right: Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
          }}>
            {box.estado && (
              <span style={{
                backgroundColor: getStatusColor(box.estado),
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '8px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}>
                {box.estado}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Default and detailed variants
  return (
    <article 
      className={`${styles.boxCard} ${styles[variant]} ${isExpanded ? styles.expanded : ''}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: variant === 'detailed' ? '12px' : '8px',
        padding: variant === 'detailed' ? '16px' : '12px',
        marginBottom: '8px',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
      aria-label={`Caja ${box.codigo}`}
      aria-expanded={isExpanded}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: hasAdditionalInfo ? '8px' : showActions ? '12px' : '0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          flex: 1,
        }}>
          {showExpandButton && (
            <button
              className={`${styles.expandButton} expand-button`}
              onClick={handleExpand}
              aria-label={isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
              type="button"
              style={{
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isExpanded ? <ChevronDown size={14} color="#6B7280" /> : <ChevronRight size={14} color="#6B7280" />}
            </button>
          )}
          
          <Package size={16} color="#6B7280" style={{ marginTop: '1px' }} />
          
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 3px 0',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
              {box.codigo}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#6B7280',
              fontSize: '11px',
              fontWeight: '500',
            }}>
              <Clock size={10} />
              <span>{formatDate(box.fecha_registro)}</span>
              {formatTime(box.fecha_registro) && (
                <span style={{ color: '#9CA3AF' }}>{formatTime(box.fecha_registro)}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Status badge */}
        <div>
          {box.estado && (
            <span style={{
              backgroundColor: getStatusColor(box.estado),
              color: 'white',
              padding: '3px 6px',
              borderRadius: '4px',
              fontSize: '9px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}>
              {box.estado}
            </span>
          )}
        </div>
      </header>

      {/* Essential info - Compact grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '8px',
        marginBottom: hasAdditionalInfo && isExpanded ? '12px' : showActions ? '12px' : '0',
      }}>
        {box.calibre && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 6px',
            background: 'rgba(59, 130, 246, 0.08)',
            borderRadius: '4px',
          }}>
            <Ruler size={11} color="#3B82F6" />
            <span style={{ color: '#3B82F6', fontSize: '11px', fontWeight: '600' }}>{box.calibre}</span>
          </div>
        )}

        {box.operario && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 6px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderRadius: '4px',
          }}>
            <User size={11} color="#10B981" />
            <span style={{ color: '#10B981', fontSize: '11px', fontWeight: '600' }}>{box.operario}</span>
          </div>
        )}

        {box.contador && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 6px',
            background: 'rgba(245, 158, 11, 0.08)',
            borderRadius: '4px',
          }}>
            <BarChart size={11} color="#F59E0B" />
            <span style={{ color: '#F59E0B', fontSize: '11px', fontWeight: '600' }}>{box.contador}</span>
          </div>
        )}
      </div>

      {/* Collapsible additional details */}
      {isExpanded && hasAdditionalInfo && (
        <div style={{
          marginBottom: showActions ? '12px' : '0',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '6px',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '6px',
          }}>
            {box.ubicacion && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <MapPin size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Ubicación:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.ubicacion}</span>
              </div>
            )}
            
            {box.formato_caja && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <Hash size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Formato:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.formato_caja}</span>
              </div>
            )}

            {box.semana && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <Calendar size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Semana:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.semana}</span>
              </div>
            )}

            {box.año && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <Calendar size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Año:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.año}</span>
              </div>
            )}

            {box.horario_proceso && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <Clock size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Horario:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.horario_proceso}</span>
              </div>
            )}

            {box.empacador_id && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
              }}>
                <User size={10} color="#6B7280" />
                <span style={{ color: '#6B7280' }}>Empacador ID:</span>
                <span style={{ color: '#1F2937', fontWeight: '600' }}>{box.empacador_id}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons - More compact */}
      {showActions && (
        <div className={styles.actionsSection}>
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
          }}>
            <button
              className={`${styles.actionButton} action-button`}
              onClick={handleCreateSinglePallet}
              disabled={createSinglePallet.loading}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: createSinglePallet.loading ? 'not-allowed' : 'pointer',
                opacity: createSinglePallet.loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                flex: 1,
                minWidth: '120px',
                justifyContent: 'center',
              }}
              title="Crear Pallet Individual"
            >
              <Plus size={12} />
              {createSinglePallet.loading ? 'Creando...' : 'Crear Pallet'}
            </button>

            <button
              className={`${styles.actionButton} action-button`}
              onClick={handleAssignToCompatible}
              disabled={assignToCompatible.loading}
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: assignToCompatible.loading ? 'not-allowed' : 'pointer',
                opacity: assignToCompatible.loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                flex: 1,
                minWidth: '120px',
                justifyContent: 'center',
              }}
              title="Asignar a Pallet Compatible"
            >
              <ArrowRight size={12} />
              {assignToCompatible.loading ? 'Asignando...' : 'Asignar a Pallet'}
            </button>
          </div>

          {/* Status messages - More compact */}
          {(createSinglePallet.response || createSinglePallet.error) && (
            <div style={{
              marginTop: '8px',
              padding: '6px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              backgroundColor: createSinglePallet.response?.success 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              color: createSinglePallet.response?.success 
                ? '#059669' 
                : '#DC2626',
              border: `1px solid ${createSinglePallet.response?.success 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)'}`,
            }}>
              {createSinglePallet.response?.message || createSinglePallet.error?.message}
            </div>
          )}

          {(assignToCompatible.response || assignToCompatible.error) && (
            <div style={{
              marginTop: '8px',
              padding: '6px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              backgroundColor: assignToCompatible.response?.success 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              color: assignToCompatible.response?.success 
                ? '#059669' 
                : '#DC2626',
              border: `1px solid ${assignToCompatible.response?.success 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)'}`,
            }}>
              {assignToCompatible.response?.message || assignToCompatible.error?.message}
            </div>
          )}
        </div>
      )}
    </article>
  );
});

BoxCard.displayName = 'BoxCard';