import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean; // True if we just came back online
}

/**
 * Hook to monitor network status
 * 
 * Uses both navigator.onLine and a more reliable fetch-based check
 * to detect actual connectivity to the API server.
 */
export const useNetworkStatus = (apiUrl?: string): NetworkStatus => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Update state when browser online/offline events fire
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      // Reset wasOffline after a short delay
      setTimeout(() => setWasOffline(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(false);
    };

    // Verify actual connectivity with a lightweight request
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        // Try to fetch a small resource or ping the API
        if (apiUrl) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          await fetch(`${apiUrl}/health`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-cache',
          });
          
          clearTimeout(timeoutId);
          setIsOnline(true);
        } else {
          // Fallback to navigator.onLine if no API URL
          setIsOnline(navigator.onLine);
        }
      } catch (error) {
        // Network error or timeout
        setIsOnline(false);
      }
    };

    // Initial check
    checkConnectivity();

    // Listen to browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check (every 10 seconds)
    const intervalId = setInterval(checkConnectivity, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [apiUrl]);

  return { isOnline, wasOffline };
};

