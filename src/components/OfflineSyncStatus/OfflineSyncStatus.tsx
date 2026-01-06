import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { offlineQueue } from '../../services/offlineQueue';
import { offlineSync } from '../../services/offlineSync';
import { API_BASE } from '../../services';
import { theme } from '../../styles/theme';

/**
 * OfflineSyncStatus Component
 * 
 * Displays network status and offline queue information.
 * Automatically syncs queued requests when connection is restored.
 */
const OfflineSyncStatus: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus(API_BASE);
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ processed: number; total: number } | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<{ success: number; failed: number } | null>(null);

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = offlineQueue.subscribe((count) => {
      setQueueSize(count);
    });

    return unsubscribe;
  }, []);

  // Subscribe to sync progress
  useEffect(() => {
    const unsubscribe = offlineSync.subscribe((progress) => {
      setSyncProgress({
        processed: progress.processed,
        total: progress.total,
      });
    });

    return unsubscribe;
  }, []);

  // Auto-sync when connection is restored
  useEffect(() => {
    if (isOnline && wasOffline && queueSize > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, wasOffline, queueSize, isSyncing]);

  const handleSync = async () => {
    if (isSyncing || queueSize === 0) return;

    setIsSyncing(true);
    setSyncProgress(null);
    setLastSyncResult(null);

    try {
      const result = await offlineSync.syncAll((progress) => {
        setSyncProgress({
          processed: progress.processed,
          total: progress.total,
        });
      });

      setLastSyncResult({
        success: result.success,
        failed: result.failed,
      });

      // Clear sync result after 3 seconds
      setTimeout(() => {
        setLastSyncResult(null);
      }, 3000);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
      setSyncProgress(null);
    }
  };

  // Don't render if online and no queued items
  if (isOnline && queueSize === 0 && !wasOffline) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: isOnline ? theme.colors.accent.green : theme.colors.accent.red,
    color: theme.colors.text.inverse,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.colors.shadow.large,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    zIndex: 1000,
    minWidth: '280px',
    maxWidth: '400px',
  };

  const textStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
  };

  const progressStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    color: theme.colors.text.inverse,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: theme.typography.fontSize.xs,
    minHeight: '32px',
    transition: `background-color ${theme.animation.duration.fast} ${theme.animation.easing.default}`,
  };

  return (
    <div style={containerStyles}>
      {isOnline ? (
        <Wifi size={20} />
      ) : (
        <WifiOff size={20} />
      )}

      <div style={{ flex: 1 }}>
        <div style={textStyles}>
          {isOnline ? (
            queueSize > 0 ? (
              isSyncing ? (
                `Sincronizando... ${syncProgress ? `${syncProgress.processed}/${syncProgress.total}` : ''}`
              ) : (
                `${queueSize} ${queueSize === 1 ? 'código' : 'códigos'} pendientes`
              )
            ) : lastSyncResult ? (
              lastSyncResult.failed > 0 ? (
                `Sincronizado: ${lastSyncResult.success} OK, ${lastSyncResult.failed} fallidos`
              ) : (
                `Sincronizado: ${lastSyncResult.success} códigos`
              )
            ) : (
              'Conectado'
            )
          ) : (
            `Sin conexión - ${queueSize} ${queueSize === 1 ? 'código guardado' : 'códigos guardados'}`
          )}
        </div>

        {syncProgress && syncProgress.total > 0 && (
          <div style={progressStyles}>
            Procesando {syncProgress.processed} de {syncProgress.total}...
          </div>
        )}

        {lastSyncResult && (
          <div style={progressStyles}>
            {lastSyncResult.success > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                <CheckCircle2 size={12} />
                {lastSyncResult.success} exitosos
              </span>
            )}
            {lastSyncResult.failed > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.xs }}>
                <AlertCircle size={12} />
                {lastSyncResult.failed} fallidos
              </span>
            )}
          </div>
        )}
      </div>

      {queueSize > 0 && isOnline && !isSyncing && (
        <button
          style={buttonStyles}
          onClick={handleSync}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          aria-label="Sincronizar códigos pendientes"
        >
          <RefreshCw size={14} />
          Sincronizar
        </button>
      )}
    </div>
  );
};

export default OfflineSyncStatus;

