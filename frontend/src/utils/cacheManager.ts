/**
 * Cache Manager
 * In-memory cache with TTL (Time To Live) for API responses
 * Supports pattern-based invalidation for efficient cache management
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private readonly TTL: number;

  /**
   * Initialize cache manager
   * @param ttlMinutes - Time to live in minutes (default: 5)
   */
  constructor(ttlMinutes: number = 5) {
    this.cache = new Map();
    this.TTL = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Get cached data by key
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    if (import.meta.env.DEV) {
      console.log('📦 Cache HIT:', key);
    }

    return cached.data as T;
  }

  /**
   * Set cache data with current timestamp
   * @param key - Cache key
   * @param data - Data to cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    if (import.meta.env.DEV) {
      console.log('💾 Cache SET:', key);
    }
  }

  /**
   * Invalidate cache entries matching a pattern
   * @param pattern - String pattern to match against cache keys
   * @returns Number of entries invalidated
   */
  invalidate(pattern: string): number {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }

    if (import.meta.env.DEV && count > 0) {
      console.log(`🗑️ Cache INVALIDATE: ${count} entries matching "${pattern}"`);
    }

    return count;
  }

  /**
   * Invalidate multiple patterns at once
   * @param patterns - Array of patterns to match
   * @returns Total number of entries invalidated
   */
  invalidateMultiple(patterns: string[]): number {
    let totalCount = 0;
    
    patterns.forEach(pattern => {
      totalCount += this.invalidate(pattern);
    });

    return totalCount;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();

    if (import.meta.env.DEV) {
      console.log(`🗑️ Cache CLEAR: ${size} entries removed`);
    }
  }

  /**
   * Get current cache size
   * @returns Number of cached entries
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if a key exists in cache (regardless of expiration)
   * @param key - Cache key
   * @returns True if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Remove expired entries from cache
   * @returns Number of expired entries removed
   */
  cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
        count++;
      }
    }

    if (import.meta.env.DEV && count > 0) {
      console.log(`🧹 Cache CLEANUP: ${count} expired entries removed`);
    }

    return count;
  }

  /**
   * Get cache statistics
   * @returns Cache statistics object
   */
  getStats(): {
    size: number;
    ttl: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      ttl: this.TTL,
      keys: this.keys(),
    };
  }
}

/**
 * Generate cache key from endpoint and params
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @returns Cache key string
 */
export function generateCacheKey(
  endpoint: string,
  params?: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');

  return `${endpoint}?${sortedParams}`;
}

/**
 * Global cache manager instance
 * TTL: 5 minutes
 */
export const cacheManager = new CacheManager(5);

/**
 * Helper function to wrap API calls with caching
 * @param key - Cache key
 * @param fetchFn - Function that fetches data
 * @param useCache - Whether to use cache (default: true)
 * @returns Cached or fresh data
 */
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  useCache: boolean = true
): Promise<T> {
  if (!useCache) {
    return fetchFn();
  }

  // Try to get from cache
  const cached = cacheManager.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cacheManager.set(key, data);
  
  return data;
}

export default cacheManager;
