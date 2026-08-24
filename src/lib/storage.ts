/**
 * Safe, type-safe LocalStorage helper for resilient caching and offline-first state sync.
 */

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`[storage] Error reading key "${key}":`, error);
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] Error writing key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Error removing key "${key}":`, error);
  }
}
