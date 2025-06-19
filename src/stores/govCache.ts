import type { PaginatedProposals } from '@/types';

export class GovProposalCache {
    // TTL for non-complete proposals (status not 3 or 4); how long to keep the data in cache
    private static readonly NON_COMPLETE_CACHE_TTL = 60 * 1000; // 1 minute cache
    // TTL for requests; how long before retrying lookup requests
    private static readonly REQUEST_CACHE_TTL = 30 * 1000; // 30 seconds cache

    /**
     * Generate a cache key for governance proposals
     */
    static getKey(chainName: string, status: string): string {
        return `gov_proposals_${chainName}_${status}`;
    }

    /**
     * Get the appropriate TTL based on proposal status
     */
    private static getTTL(status: string): number | null {
        // Status 3 = PASSED, Status 4 = REJECTED - these are complete and never expire
        return (status === '3' || status === '4') ? null : this.NON_COMPLETE_CACHE_TTL;
    }

    /**
     * Retrieve cached proposals if they exist and are still valid
     */
    static get(chainName: string, status: string): PaginatedProposals | null {
        try {
            const cacheKey = this.getKey(chainName, status);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp, ttl } = JSON.parse(cached);
                const now = Date.now();

                // If ttl is null, cache never expires (for completed proposals)
                if (ttl === null || now - timestamp < ttl) {
                    console.log(`Using cached proposals for status ${status}`);
                    return data;
                } else {
                    localStorage.removeItem(cacheKey);
                }
            }
        } catch (error) {
            console.warn('Failed to read cached proposals:', error);
        }
        return null;
    }

    /**
     * Store proposals in cache with timestamp and TTL based on status
     */
    static set(chainName: string, status: string, data: PaginatedProposals): void {
        try {
            const cacheKey = this.getKey(chainName, status);
            const cacheData = {
                data,
                timestamp: Date.now(),
                ttl: this.getTTL(status)
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache proposals:', error);
        }
    }

    /**
     * Clear cached proposals for a specific chain and status
     */
    static clear(chainName: string, status: string): void {
        try {
            const cacheKey = this.getKey(chainName, status);
            localStorage.removeItem(cacheKey);
        } catch (error) {
            console.warn('Failed to clear cached proposals:', error);
        }
    }

    /**
     * Clear all cached proposals for a specific chain
     */
    static clearAllCachedProposals(chainName: string): void {
        try {
            const keys = Object.keys(localStorage);
            const chainPrefix = `gov_proposals_${chainName}_`;
            keys.forEach(key => {
                if (key.startsWith(chainPrefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear all cached proposals:', error);
        }
    }

    /**
     * Check if cache is expired and should be refreshed
     */
    static shouldRequest(chainName: string): boolean {
        const cacheKey = this.getKey(chainName, 'request');
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { timestamp } = JSON.parse(cached);
                const now = Date.now();

                // If cache is expired by REQUEST_CACHE_TTL
                if (now - timestamp >= this.REQUEST_CACHE_TTL) {
                    this.updateRequest(cacheKey);
                    return true;
                }

                // Cache is valid and has data
                return false;
            }

            this.updateRequest(cacheKey);
            return true;
        } catch (error) {
            console.warn('Failed to check cache expiration:', error);
        }
        return true; // Consider expired if we can't check or no cache exists
    }

    static updateRequest(cacheKey: string): void {
        localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now()
        }));
    }
} 