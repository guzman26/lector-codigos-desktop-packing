/**
 * Offline Sync Service
 * 
 * Handles automatic synchronization of queued requests when connection is restored.
 * Processes queue with retry logic and exponential backoff.
 */

import { offlineQueue, type QueuedRequest } from './offlineQueue';
import { fetchJson, type ApiEnvelope } from './fetchJson';

export interface SyncResult {
  success: number;
  failed: number;
  total: number;
}

export interface SyncProgress {
  processed: number;
  total: number;
  current?: QueuedRequest;
}

class OfflineSyncService {
  private isSyncing = false;
  private syncListeners: Set<(progress: SyncProgress) => void> = new Set();
  private abortController: AbortController | null = null;

  /**
   * Subscribe to sync progress updates
   */
  subscribe(listener: (progress: SyncProgress) => void): () => void {
    this.syncListeners.add(listener);
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  /**
   * Notify listeners of sync progress
   */
  private notifyProgress(progress: SyncProgress): void {
    this.syncListeners.forEach(listener => listener(progress));
  }

  /**
   * Check if currently syncing
   */
  isActive(): boolean {
    return this.isSyncing;
  }

  /**
   * Cancel ongoing sync
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.isSyncing = false;
  }

  /**
   * Sync all queued requests
   * 
   * @param onProgress Optional callback for progress updates
   * @returns Promise with sync results
   */
  async syncAll(onProgress?: (progress: SyncProgress) => void): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    this.isSyncing = true;
    this.abortController = new AbortController();

    const queue = offlineQueue.getAll();
    const total = queue.length;
    let success = 0;
    let failed = 0;

    // Process requests that are ready for retry
    const readyRequests = offlineQueue.getReadyForRetry();

    for (let i = 0; i < readyRequests.length; i++) {
      // Check if sync was cancelled
      if (this.abortController.signal.aborted) {
        break;
      }

      const request = readyRequests[i];
      const progress: SyncProgress = {
        processed: i,
        total: readyRequests.length,
        current: request,
      };

      this.notifyProgress(progress);
      if (onProgress) {
        onProgress(progress);
      }

      try {
        // Attempt to process the request
        await fetchJson(request.url, {
          ...request.options,
          signal: this.abortController.signal,
        });

        // Success - remove from queue
        offlineQueue.remove(request.id);
        success++;
      } catch (error) {
        // Failed - mark as retried
        offlineQueue.markRetried(request.id);
        failed++;

        // If max retries exceeded, remove from queue
        if (request.retryCount >= 4) {
          offlineQueue.remove(request.id);
          console.error(`Max retries exceeded for request ${request.id}`, error);
        }
      }

      // Small delay between requests to avoid overwhelming the server
      if (i < readyRequests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.isSyncing = false;
    this.abortController = null;

    const result: SyncResult = {
      success,
      failed,
      total,
    };

    // Final progress update
    const finalProgress: SyncProgress = {
      processed: readyRequests.length,
      total: readyRequests.length,
    };
    this.notifyProgress(finalProgress);
    if (onProgress) {
      onProgress(finalProgress);
    }

    return result;
  }

  /**
   * Sync a single request by ID
   */
  async syncOne(id: string): Promise<boolean> {
    const request = offlineQueue.getAll().find(r => r.id === id);
    if (!request) {
      return false;
    }

    try {
      await fetchJson(request.url, request.options);
      offlineQueue.remove(id);
      return true;
    } catch (error) {
      offlineQueue.markRetried(id);
      return false;
    }
  }
}

// Singleton instance
export const offlineSync = new OfflineSyncService();

