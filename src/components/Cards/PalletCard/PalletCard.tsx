import { memo } from 'react';
import type { Pallet } from '../../../types';
import { theme } from '../../../styles/theme';
import styles from './PalletCard.module.css';
import { Package2, Calendar, MapPin, Boxes, AlertCircle, Clock, Activity, Ruler } from 'lucide-react';
import { getCalibreText } from '../../../utils/codeUtils';

interface PalletCardProps {
  pallet: Pallet;
  onSelect?: (pallet: Pallet) => void;
  isSelected?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  maxBoxes?: number;
}

/**
 * PalletCard Component
 * 
 * Industrial-grade card component for displaying pallet information
 * optimized for touchscreen terminals in factory environments.
 * 
 * Design Principles:
 * - Visual capacity indicators for quick status assessment
 * - Color-coded states for at-a-glance monitoring
 * - Progressive disclosure of detailed information
 * - Touch-optimized interaction areas
 */
export const PalletCard = memo<PalletCardProps>(({ 
  pallet, 
  onSelect, 
  isSelected = false,
  variant = 'default',
  showProgress = true,
  maxBoxes = 100 
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(pallet);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
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

  const getCapacityStatus = () => {
    const percentage = (pallet.cantidadCajas / maxBoxes) * 100;
    if (percentage >= 95) return { color: theme.colors.accent.red, label: 'Casi lleno' };
    if (percentage >= 80) return { color: theme.colors.accent.orange, label: 'Alto' };
    if (percentage >= 50) return { color: theme.colors.accent.blue, label: 'Medio' };
    return { color: theme.colors.accent.green, label: 'Bajo' };
  };

  const capacityPercentage = Math.min((pallet.cantidadCajas / maxBoxes) * 100, 100);
  const capacityStatus = getCapacityStatus();

  return (
    <article 
      className={`
        ${styles.palletCard} 
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
      aria-label={`Pallet ${pallet.codigo}`}
      aria-selected={isSelected}
    >
      {/* Header with code and status */}
      <header className={styles.header}>
        <div className={styles.codeWrapper}>
          <Package2 size={variant === 'compact' ? 18 : 20} className={styles.icon} />
          <h3 className={styles.code}>{pallet.codigo}</h3>
        </div>
        <span 
          className={styles.status}
          style={{ backgroundColor: getStatusColor(pallet.estado) }}
          role="status"
          aria-label={`Estado: ${pallet.estado}`}
        >
          {pallet.estado}
        </span>
      </header>

      {/* Main content */}
      <div className={styles.content}>
        {/* Box count with visual indicator */}
        <div className={styles.boxCountSection}>
          <div className={styles.infoRow}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Boxes size={variant === 'compact' ? 14 : 16} className={styles.icon} />
              <span className={styles.label}>Cajas:</span>
            </div>
            <span className={styles.value}>
              <strong>{pallet.cantidadCajas}</strong>/{maxBoxes}
              {capacityPercentage >= 80 && (
                <AlertCircle 
                  size={variant === 'compact' ? 12 : 14} 
                  style={{ color: capacityStatus.color, marginLeft: '4px' }}
                  aria-label={capacityStatus.label}
                />
              )}
            </span>
          </div>

          {showProgress && (
            <div className={styles.progressWrapper}>
              <div 
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={capacityPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Capacidad: ${capacityPercentage.toFixed(0)}%`}
              >
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${capacityPercentage}%`,
                    backgroundColor: capacityStatus.color
                  }}
                />
              </div>
              <span className={styles.capacityLabel} style={{ color: capacityStatus.color }}>
                {capacityStatus.label} ({capacityPercentage.toFixed(0)}%)
              </span>
            </div>
          )}
        </div>

        {/* Basic info combined in more compact way */}
        <div className={styles.infoRow}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MapPin size={variant === 'compact' ? 14 : 16} className={styles.icon} />
            <span className={styles.label}>Ubicación:</span>
          </div>
          <span className={styles.value}>{pallet.ubicacion}</span>
        </div>

        <div className={styles.infoRow}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Calendar size={variant === 'compact' ? 14 : 16} className={styles.icon} />
            <span className={styles.label}>Creado:</span>
          </div>
          <span className={styles.value}>{formatDate(pallet.fechaCreacion)}</span>
        </div>
        
        {pallet.fechaCalibreFormato && (
          <div className={styles.infoRow}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Ruler size={variant === 'compact' ? 14 : 16} className={styles.icon} />
              <span className={styles.label}>Calibre:</span>
            </div>
            <span className={styles.value}>{getCalibreText(pallet.fechaCalibreFormato)}</span>
          </div>
        )}

        {/* Extra stats for detailed variant - more compact layout */}
        {variant === 'detailed' && (
          <footer className={styles.footer}>
            <div className={styles.stat}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} className={styles.icon} />
                <span className={styles.statLabel}>Tiempo activo</span>
              </div>
              <span className={styles.statValue}>
                {(() => {
                  const created = new Date(pallet.fechaCreacion);
                  const now = new Date();
                  const hours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
                  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
                })()}
              </span>
            </div>
            <div className={styles.stat}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={14} className={styles.icon} />
                <span className={styles.statLabel}>Tasa llenado</span>
              </div>
              <span className={styles.statValue}>
                {pallet.cantidadCajas > 0 
                  ? `${(pallet.cantidadCajas / ((new Date().getTime() - new Date(pallet.fechaCreacion).getTime()) / (1000 * 60 * 60))).toFixed(1)} cajas/h`
                  : '0 cajas/h'
                }
              </span>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
});

PalletCard.displayName = 'PalletCard';