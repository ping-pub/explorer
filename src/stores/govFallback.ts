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
    ): Promise<PaginatedProposals> {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };

        // Check cache first
        const cached = GovProposalCache.get(blockchain.chainName, status);
        let proposals: PaginatedProposals;
        let lastKnownProposalId = 0;

        // Initialize with cache or empty structure
        proposals = this.initializeProposalsFromCache(cached);
        lastKnownProposalId = this.getLastKnownProposalId(cached);

        // Determine if we need sequential search based on cache freshness
        if (GovProposalCache.shouldRequest(blockchain.chainName)) {
            const sequentialProposals = await this.performSequentialSearch(
                blockchain,
                status,
                lastKnownProposalId,
                finalConfig,
                proposals.proposals || []
            );

            proposals = reactive({
                proposals: sequentialProposals,
                pagination: {
                    next_key: undefined,
                    total: sequentialProposals.length.toString()
                }
            });
        }

        return proposals;
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
        status: string,
        startId: number,
        config: FallbackConfig,
        existingProposals: GovProposal[]
    ): Promise<GovProposal[]> {
        const individualProposals: GovProposal[] = [...existingProposals];
        let consecutiveFailures = 0;
        const statusString = PROPOSAL_STATUS_MAP[status] || status;

        console.log(`Starting sequential search from proposal ${startId + 1}`);

        // Sequentially check proposals starting from last known + 1
        for (let i = startId + 1; consecutiveFailures < config.maxConsecutiveFailures; i++) {
            try {
                const proposal = await blockchain.rpc?.getGovProposal(i.toString());

                if (proposal?.proposal) {
                    consecutiveFailures = 0; // Reset counter on successful request

                    if (proposal.proposal.status === statusString) {
                        individualProposals.push(proposal.proposal);
                        console.log(`Found matching proposal ${i} with status ${statusString}`);
                    }
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
        individualProposals.sort((a, b) => parseInt(b.proposal_id) - parseInt(a.proposal_id));

        console.log(`Sequential search completed, found ${individualProposals.length} proposals`);
        return individualProposals;
    }
} 
