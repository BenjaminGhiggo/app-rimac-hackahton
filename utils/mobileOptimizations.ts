/**
 * Utilidades de optimización para Mobile
 */

import { useCallback, useRef } from 'react';

/**
 * Debounce para eventos táctiles
 * Evita múltiples triggers en corto tiempo
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay) as any;
    },
    [callback, delay]
  );
}

/**
 * Throttle para scroll events
 * Limita la frecuencia de actualización
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
) {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            lastCallRef.current = Date.now();
            callback(...args);
          },
          delay - (now - lastCallRef.current)
        ) as any;
      }
    },
    [callback, delay]
  );
}

/**
 * Configuración para listas virtualizadas (FlatList)
 * Mejora performance en listas largas
 */
export const VIRTUALIZED_LIST_CONFIG = {
  removeClippedSubviews: true,
  initialNumToRender: 10,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  windowSize: 21,
};

/**
 * Configuración para imágenes optimizadas
 */
export const IMAGE_CONFIG = {
  priority: 'high' as const,
  cache: 'force-cache' as const,
};

/**
 * Tamaños responsivos basados en pantalla
 */
export function useResponsiveSize(baseSize: number, maxSize: number) {
  const { width } = require('react-native').useWindowDimensions();
  const scale = Math.min(width / 375, 1.2); // 375 es ancho estándar de móvil
  return Math.min(baseSize * scale, maxSize);
}

/**
 * Caché simple para datos
 */
export class SimpleCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number;

  constructor(ttlSeconds: number = 300) {
    this.ttl = ttlSeconds * 1000;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Lazy loading de componentes
 */
import React from 'react';

export function createLazyComponent(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  return React.lazy(importFunc);
}
