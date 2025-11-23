/**
 * Hook para optimizar peticiones de red en mobile
 */

import { useCallback, useRef, useEffect } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry>();
const ttl = 5 * 60 * 1000; // 5 minutos

/**
 * Hook para fetch con caché
 */
export function useNetworkOptimized() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWithCache = useCallback(
    async (url: string, options: RequestInit = {}) => {
      // Verificar caché
      const cached = requestCache.get(url);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }

      // Abortar peticiones previas
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(url, {
          ...options,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Guardar en caché
        requestCache.set(url, {
          data,
          timestamp: Date.now(),
        });

        return data;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch aborted');
        }
        throw error;
      }
    },
    []
  );

  // Limpiar en unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearCache = useCallback(() => {
    requestCache.clear();
  }, []);

  return { fetchWithCache, clearCache };
}

/**
 * Hook para batch de peticiones
 */
export function useBatchRequests() {
  const requests = useRef<Array<() => Promise<any>>>([]);
  const isProcessing = useRef(false);

  const addRequest = useCallback((request: () => Promise<any>) => {
    requests.current.push(request);
  }, []);

  const processBatch = useCallback(async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const results = await Promise.all(
        requests.current.map((req) => req().catch((e) => e))
      );
      requests.current = [];
      return results;
    } finally {
      isProcessing.current = false;
    }
  }, []);

  return { addRequest, processBatch };
}

