import type { PaginatedProposals } from '@/types';

export class GovProposalCache {
    private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day cache

    /**
     * Generate a cache key for governance proposals
     */
    static getKey(chainName: string, status: string): string {
        return `gov_proposals_${chainName}_${status}`;
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
                if (now - timestamp < ttl) {
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
     * Store proposals in cache with timestamp and TTL
     */
    static set(chainName: string, status: string, data: PaginatedProposals): void {
        try {
            const cacheKey = this.getKey(chainName, status);
            const cacheData = {
                data,
                timestamp: Date.now(),
                ttl: this.CACHE_TTL
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
} 