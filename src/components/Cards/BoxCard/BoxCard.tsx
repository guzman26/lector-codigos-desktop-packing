import React, { memo } from 'react';
import type { UnassignedBox } from '../../../types';
import { theme } from '../../../styles/theme';
import styles from './BoxCard.module.css';
import { Package, Calendar, Ruler, User, MapPin, Hash } from 'lucide-react';

interface BoxCardProps {
  box: UnassignedBox;
  onSelect?: (box: UnassignedBox) => void;
  isSelected?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
}

/**
 * BoxCard Component
 * 
 * Industrial-grade card component for displaying box information
 * optimized for touchscreen terminals in factory environments.
 * 
 * Design Principles:
 * - Large touch targets (min 44x44px for touchscreens)
 * - High contrast for visibility in bright factory lighting
 * - Clear visual hierarchy with icons for quick scanning
 * - Minimal cognitive load with progressive disclosure
 */
export const BoxCard = memo<BoxCardProps>(({ 
  box, 
  onSelect, 
  isSelected = false,
  variant = 'default',
  showActions = true 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(box);
    }
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

  return (
    <article 
      className={`
        ${styles.boxCard} 
        ${styles[variant]} 
        ${isSelected ? styles.selected : ''} 
        ${onSelect ? styles.clickable : ''}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Caja ${box.codigo}`}
      aria-selected={isSelected}
    >
      {/* Header with code and status */}
      <header className={styles.header}>
        <div className={styles.codeWrapper}>
          <Package size={20} className={styles.icon} />
          <h3 className={styles.code}>{box.codigo}</h3>
        </div>
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
      </header>

      {/* Main content */}
      <div className={styles.content}>
        {variant !== 'compact' && (
          <>
            <div className={styles.infoRow}>
              <Calendar size={16} className={styles.icon} />
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{formatDate(box.fecha_registro)}</span>
            </div>

            {box.calibre && (
              <div className={styles.infoRow}>
                <Ruler size={16} className={styles.icon} />
                <span className={styles.label}>Calibre:</span>
                <span className={styles.value}>{box.calibre}</span>
              </div>
            )}

            {box.operario && (
              <div className={styles.infoRow}>
                <User size={16} className={styles.icon} />
                <span className={styles.label}>Operario:</span>
                <span className={styles.value}>{box.operario}</span>
              </div>
            )}

            {variant === 'detailed' && (
              <>
                {box.ubicacion && (
                  <div className={styles.infoRow}>
                    <MapPin size={16} className={styles.icon} />
                    <span className={styles.label}>Ubicación:</span>
                    <span className={styles.value}>{box.ubicacion}</span>
                  </div>
                )}
                
                {box.formato_caja && (
                  <div className={styles.infoRow}>
                    <Hash size={16} className={styles.icon} />
                    <span className={styles.label}>Formato:</span>
                    <span className={styles.value}>{box.formato_caja}</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Touch-friendly selection indicator */}
      {onSelect && (
        <div className={styles.selectionIndicator} aria-hidden="true">
          <div className={styles.checkmark}>
            {isSelected && '✓'}
          </div>
        </div>
      )}
    </article>
  );
});

BoxCard.displayName = 'BoxCard';