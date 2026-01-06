/**
 * Offline Queue Service
 * 
 * Manages a queue of API requests that need to be synced when connection is restored.
 * Uses localStorage for persistence across page reloads.
 * 
 * Features:
 * - Automatic queue management
 * - Retry logic with exponential backoff
 * - Duplicate detection
 * - Queue size limits
 */

export interface QueuedRequest {
  id: string;
  url: string;
  options: RequestInit;
  timestamp: number;
  retryCount: number;
  lastRetry?: number;
}

const STORAGE_KEY = 'offline_queue';
const MAX_QUEUE_SIZE = 1000;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds

class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private listeners: Set<(count: number) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        // Validate queue structure
        this.queue = this.queue.filter(item => 
          item.id && item.url && item.timestamp
        );
      }
    } catch (error) {
      console.error('Error loading offline queue from storage:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving offline queue to storage:', error);
      // If storage is full, remove oldest items
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.queue = this.queue.slice(-Math.floor(MAX_QUEUE_SIZE / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
        } catch {
          // If still fails, clear queue
          this.queue = [];
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }

  /**
   * Generate unique ID for request
   */
  private generateId(url: string, options: RequestInit): string {
    const body = options.body ? JSON.stringify(options.body) : '';
    const method = options.method || 'GET';
    return `${method}:${url}:${body}`.substring(0, 100);
  }

  /**
   * Check if request already exists in queue
   */
  private isDuplicate(request: QueuedRequest): boolean {
    return this.queue.some(item => item.id === request.id);
  }

  /**
   * Add request to queue
   */
  add(url: string, options: RequestInit): string {
    // Prevent queue from growing too large
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      // Remove oldest items
      this.queue = this.queue.slice(-Math.floor(MAX_QUEUE_SIZE * 0.9));
    }

    const id = this.generateId(url, options);
    const request: QueuedRequest = {
      id,
      url,
      options,
      timestamp: Date.now(),
      retryCount: 0,
    };

    // Don't add duplicates
    if (this.isDuplicate(request)) {
      return id;
    }

    this.queue.push(request);
    this.saveToStorage();
    return id;
  }

  /**
   * Get all queued requests
   */
  getAll(): QueuedRequest[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Remove request from queue by ID
   */
  remove(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Clear all queued requests
   */
  clear(): void {
    this.queue = [];
    this.saveToStorage();
  }

  /**
   * Get requests ready for retry (respecting backoff)
   */
  getReadyForRetry(): QueuedRequest[] {
    const now = Date.now();
    return this.queue.filter(request => {
      if (request.retryCount >= MAX_RETRIES) {
        return false; // Max retries exceeded
      }

      if (!request.lastRetry) {
        return true; // Never retried
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        INITIAL_RETRY_DELAY * Math.pow(2, request.retryCount),
        MAX_RETRY_DELAY
      );

      return now - request.lastRetry >= delay;
    });
  }

  /**
   * Mark request as retried
   */
  markRetried(id: string): void {
    const request = this.queue.find(item => item.id === id);
    if (request) {
      request.retryCount += 1;
      request.lastRetry = Date.now();
      this.saveToStorage();
    }
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: (count: number) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current count
    listener(this.queue.length);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.queue.length));
  }

  /**
   * Get statistics about the queue
   */
  getStats(): {
    total: number;
    oldest: number | null;
    newest: number | null;
    retries: number;
  } {
    if (this.queue.length === 0) {
      return {
        total: 0,
        oldest: null,
        newest: null,
        retries: 0,
      };
    }

    const timestamps = this.queue.map(r => r.timestamp);
    const retries = this.queue.reduce((sum, r) => sum + r.retryCount, 0);

    return {
      total: this.queue.length,
      oldest: Math.min(...timestamps),
      newest: Math.max(...timestamps),
      retries,
    };
  }
}

// Singleton instance
export const offlineQueue = new OfflineQueue();

