import React, { memo, useState } from 'react';
import type { UnassignedBox } from '../../../types';
import { theme } from '../../../styles/theme';
import styles from './BoxCard.module.css';
import { Package, Calendar, Ruler, User, MapPin, Hash, ChevronDown, ChevronRight, Clock, BarChart } from 'lucide-react';

interface BoxCardProps {
  box: UnassignedBox;
  onSelect?: (box: UnassignedBox) => void;
  isSelected?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  defaultExpanded?: boolean;
}

/**
 * BoxCard Component - Enhanced with collapsible details
 * 
 * Industrial-grade card component for displaying box information
 * optimized for touchscreen terminals in factory environments.
 * 
 * Improvements:
 * - Collapsible/expandable details
 * - Better visual hierarchy
 * - Status badge positioning
 * - Touch-optimized expand/collapse
 */
export const BoxCard = memo<BoxCardProps>(({ 
  box, 
  onSelect, 
  isSelected = false,
  variant = 'default',
  showActions = true,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || variant === 'detailed');
  
  const handleClick = (e: React.MouseEvent) => {
    // If clicking on the expand button, don't trigger selection
    if ((e.target as HTMLElement).closest('.expand-button')) {
      return;
    }
    if (onSelect) {
      onSelect(box);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
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
        return theme.colors.accent.green;
      case 'asignado':
        return theme.colors.accent.blue;
      case 'inactivo':
      case 'procesado':
        return theme.colors.accent.orange;
      case 'error':
        return theme.colors.accent.red;
      default:
        return theme.colors.text.secondary;
    }
  };

  // Determine if we should show expand button
  const hasAdditionalInfo = box.ubicacion || box.formato_caja || box.semana || box.año || box.horario_proceso;
  const showExpandButton = variant !== 'compact' && hasAdditionalInfo;

  return (
    <article 
      className={`
        ${styles.boxCard} 
        ${styles[variant]} 
        ${isSelected ? styles.selected : ''} 
        ${onSelect ? styles.clickable : ''}
        ${isExpanded ? styles.expanded : ''}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      aria-label={`Caja ${box.codigo}`}
      aria-selected={isSelected}
      aria-expanded={isExpanded}
    >
      {/* Header with code and status - Always visible */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {showExpandButton && (
            <button
              className={`${styles.expandButton} expand-button`}
              onClick={handleExpand}
              aria-label={isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
              type="button"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
          <Package size={20} className={styles.icon} />
          <div className={styles.codeInfo}>
            <h3 className={styles.code}>{box.codigo}</h3>
            <div className={styles.timestamp}>
              <Clock size={14} className={styles.icon} />
              <span>{formatDate(box.fecha_registro)}</span>
              {formatTime(box.fecha_registro) && (
                <span className={styles.time}>{formatTime(box.fecha_registro)}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Status badge and selection in header */}
        <div className={styles.headerRight}>
          {box.estado && (
            <span 
              className={styles.status}
              style={{ backgroundColor: getStatusColor(box.estado) }}
              role="status"
              aria-label={`Estado: ${box.estado}`}
            >
              {box.estado}
            </span>
          )}
          
          {/* Selection indicator */}
          {onSelect && (
            <div className={styles.selectionIndicator} aria-hidden="true">
              <div className={styles.checkmark}>
                {isSelected && '✓'}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Essential info - Always visible in non-compact mode */}
      {variant !== 'compact' && (
        <div className={styles.essentialInfo}>
          <div className={styles.infoGrid}>
            {box.calibre && (
              <div className={styles.infoItem}>
                <Ruler size={16} className={styles.icon} />
                <span className={styles.label}>Calibre:</span>
                <span className={styles.value}>{box.calibre}</span>
              </div>
            )}

            {box.operario && (
              <div className={styles.infoItem}>
                <User size={16} className={styles.icon} />
                <span className={styles.label}>Operario:</span>
                <span className={styles.value}>{box.operario}</span>
              </div>
            )}

            {box.contador && (
              <div className={styles.infoItem}>
                <BarChart size={16} className={styles.icon} />
                <span className={styles.label}>Contador:</span>
                <span className={styles.value}>{box.contador}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsible additional details */}
      {isExpanded && hasAdditionalInfo && (
        <div className={styles.expandedContent}>
          <div className={styles.detailsGrid}>
            {box.ubicacion && (
              <div className={styles.detailItem}>
                <MapPin size={16} className={styles.icon} />
                <span className={styles.label}>Ubicación:</span>
                <span className={styles.value}>{box.ubicacion}</span>
              </div>
            )}
            
            {box.formato_caja && (
              <div className={styles.detailItem}>
                <Hash size={16} className={styles.icon} />
                <span className={styles.label}>Formato:</span>
                <span className={styles.value}>{box.formato_caja}</span>
              </div>
            )}

            {box.semana && (
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.icon} />
                <span className={styles.label}>Semana:</span>
                <span className={styles.value}>{box.semana}</span>
              </div>
            )}

            {box.año && (
              <div className={styles.detailItem}>
                <Calendar size={16} className={styles.icon} />
                <span className={styles.label}>Año:</span>
                <span className={styles.value}>{box.año}</span>
              </div>
            )}

            {box.horario_proceso && (
              <div className={styles.detailItem}>
                <Clock size={16} className={styles.icon} />
                <span className={styles.label}>Horario:</span>
                <span className={styles.value}>{box.horario_proceso}</span>
              </div>
            )}

            {box.empacador_id && (
              <div className={styles.detailItem}>
                <User size={16} className={styles.icon} />
                <span className={styles.label}>Empacador ID:</span>
                <span className={styles.value}>{box.empacador_id}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
});

BoxCard.displayName = 'BoxCard';