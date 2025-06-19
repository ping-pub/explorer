import type { GovProposal, PaginatedProposals } from '@/types';
import { reactive } from 'vue';
import { GovProposalCache } from './govCache';

// Proposal status mapping for API calls
const PROPOSAL_STATUS_MAP: Record<string, string> = {
    '2': 'PROPOSAL_STATUS_VOTING_PERIOD',
    '3': 'PROPOSAL_STATUS_PASSED',
    '4': 'PROPOSAL_STATUS_REJECTED',
};

export interface FallbackConfig {
    maxConsecutiveFailures: number;
}

export interface FallbackResult extends PaginatedProposals {
    usingFallback: boolean;
}

export class GovFallback {
    private static readonly DEFAULT_CONFIG: FallbackConfig = {
        maxConsecutiveFailures: 3,
    };

    /**
 * Fetch proposals sequentially when batch requests fail
 */
    static async fetchProposalsSequentially(
        blockchain: any,
        status: string,
        config: Partial<FallbackConfig> = {}
    ): Promise<FallbackResult> {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

        // Check cache first
        const cached = GovProposalCache.get(blockchain.chainName, status);
        let proposals: PaginatedProposals;
        let lastKnownProposalId = 0;
        let isUsingFallback = true; // Always true when this method is called

        // Initialize with cache or empty structure
        proposals = this.initializeProposalsFromCache(cached);
        lastKnownProposalId = this.getLastKnownProposalId(cached);

        // Determine if we need sequential search based on cache freshness
        if (GovProposalCache.shouldRequest(blockchain.chainName)) {
            const allProposals = await this.performSequentialSearch(
                blockchain,
                lastKnownProposalId,
                finalConfig,
                proposals.proposals || []
            );

            // Distribute proposals to all status caches
            this.distributeProposalsToStatusCaches(blockchain.chainName, allProposals);

            // Mark all statuses as having been searched to prevent redundant searches
            Object.keys(PROPOSAL_STATUS_MAP).forEach(statusKey => {
                GovProposalCache.updateRequest(GovProposalCache.getKey(blockchain.chainName, 'request'));
            });

            // Return proposals for the requested status
            const filteredProposals = this.filterProposalsByStatus(allProposals, status);
            proposals = reactive({
                proposals: filteredProposals,
                pagination: {
                    next_key: undefined,
                    total: filteredProposals.length.toString()
                }
            });
        }

        return {
            ...proposals,
            usingFallback: isUsingFallback
        };
    }

    /**
     * Initialize proposals structure from cache or create empty structure
     */
    private static initializeProposalsFromCache(cached: PaginatedProposals | null): PaginatedProposals {
        if (cached && cached.proposals.length > 0) {
            console.log('Using cached proposals as fallback base');
            return cached;
        }

        return reactive({
            proposals: [],
            pagination: {
                next_key: undefined,
                total: '0'
            }
        });
    }

    /**
     * Get the highest proposal ID from cached data
     */
    private static getLastKnownProposalId(cached: PaginatedProposals | null): number {
        if (cached && cached.proposals.length > 0) {
            const lastId = Math.max(...cached.proposals.map(p => parseInt(p.proposal_id)));
            console.log(`Resuming from proposal ${lastId + 1} using cached data`);
            return lastId;
        }
        return 0;
    }

    /**
     * Perform sequential search for proposals
     */
    private static async performSequentialSearch(
        blockchain: any,
        startId: number,
        config: FallbackConfig,
        existingProposals: GovProposal[]
    ): Promise<GovProposal[]> {
        const allProposals: GovProposal[] = [...existingProposals];
        let consecutiveFailures = 0;

        console.log(`Starting sequential search from proposal ${startId + 1}`);

        // Sequentially check proposals starting from last known + 1
        for (let i = startId + 1; consecutiveFailures < config.maxConsecutiveFailures; i++) {
            try {
                const proposal = await blockchain.rpc?.getGovProposal(i.toString());

                if (proposal?.proposal) {
                    consecutiveFailures = 0; // Reset counter on successful request
                    allProposals.push(proposal.proposal);
                    console.log(`Found proposal ${i} with status ${proposal.proposal.status}`);
                } else {
                    consecutiveFailures++;
                    console.log(`No proposal found at ${i}, consecutive failures: ${consecutiveFailures}`);
                }
            } catch (err) {
                consecutiveFailures++;
                console.log(`Error fetching proposal ${i}, consecutive failures: ${consecutiveFailures}`);
            }
        }

        // Sort by proposal_id in descending order to match the original behavior
        allProposals.sort((a, b) => parseInt(b.proposal_id) - parseInt(a.proposal_id));

        console.log(`Sequential search completed, found ${allProposals.length} total proposals`);
        return allProposals;
    }

    /**
     * Distribute proposals to all status caches
     */
    private static distributeProposalsToStatusCaches(chainName: string, allProposals: GovProposal[]): void {
        const proposalsByStatus: Record<string, GovProposal[]> = {};

        // Group proposals by status
        allProposals.forEach(proposal => {
            const status = proposal.status;
            if (!proposalsByStatus[status]) {
                proposalsByStatus[status] = [];
            }
            proposalsByStatus[status].push(proposal);
        });

        // Cache proposals for each status they map to
        Object.entries(PROPOSAL_STATUS_MAP).forEach(([statusKey, statusString]) => {
            const proposalsForStatus = proposalsByStatus[statusString] || [];
            const paginatedProposals: PaginatedProposals = {
                proposals: proposalsForStatus,
                pagination: {
                    next_key: undefined,
                    total: proposalsForStatus.length.toString()
                }
            };

            GovProposalCache.set(chainName, statusKey, paginatedProposals);
            console.log(`Cached ${proposalsForStatus.length} proposals for status ${statusKey} (${statusString})`);
        });
    }

    /**
     * Filter proposals by requested status
     */
    private static filterProposalsByStatus(allProposals: GovProposal[], status: string): GovProposal[] {
        const statusString = PROPOSAL_STATUS_MAP[status] || status;
        const filtered = allProposals.filter(proposal => proposal.status === statusString);
        console.log(`Filtered ${filtered.length} proposals for status ${status} (${statusString}) from ${allProposals.length} total proposals`);
        return filtered;
    }
} 
