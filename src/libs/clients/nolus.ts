import type { RequestRegistry } from '@/libs/registry'
import type { GovProposal, PaginatedProposals } from '@/types'
import { CosmosRestClient } from '@/libs/client';
import { useBlockchain } from '@/stores';
import { adapter } from '@/libs/registry'

// Blockchain Name
export const name = 'nolus';

function proposalAdapter(p: any): GovProposal {
  if (p) {
    if (p.messages && p.messages.length >= 1) p.content = p.messages[0].content || p.messages[0]
    p.proposal_id = p.id
    p.final_tally_result = {
      yes: p.final_tally_result?.yes_count,
      no: p.final_tally_result?.no_count,
      no_with_veto: p.final_tally_result?.no_with_veto_count,
      abstain: p.final_tally_result?.abstain_count,
    }
  }
  return p
}

// nolus custom request
export const requests: Partial<RequestRegistry> = {
  mint_inflation: {
    url: '/nolus/mint/v1beta1/annual_inflation',
    adapter: async (data: any): Promise<any> => {
      try {
        const client = CosmosRestClient.newDefault(useBlockchain().endpoint.address)
        const staking = await client.getStakingPool()
        const inflation = Number(data.annual_inflation) / Number(staking.pool.bonded_tokens) || 0;
        return { inflation: inflation.toString() };
      } catch (error) {
        console.log("Error in adapter:", error);
        return { inflation: "0" };
      }
    }
  },
  gov_proposals: {
    url: '/cosmos/gov/v1/proposals', adapter: async (source: any): Promise<PaginatedProposals> => {
      const proposals = source.proposals.map((p: any) => proposalAdapter(p))
      return {
        proposals,
        pagination: source.pagination
      }
    }
  },
  gov_proposals_proposal_id: {
    url: '/cosmos/gov/v1/proposals/{proposal_id}',
    adapter: async (source: any): Promise<{ proposal: GovProposal }> => {
      return {
        proposal: proposalAdapter(source.proposal)
      }
    },
  },
  gov_params_voting: { url: '/cosmos/gov/v1/params/voting', adapter },
  gov_params_tally: { url: '/cosmos/gov/v1/params/tallying', adapter },
  gov_params_deposit: { url: '/cosmos/gov/v1/params/deposit', adapter },
  gov_proposals_deposits: { url: '/cosmos/gov/v1/proposals/{proposal_id}/deposits', adapter },
  gov_proposals_tally: { url: '/cosmos/gov/v1/proposals/{proposal_id}/tally', adapter },
  gov_proposals_votes: { url: '/cosmos/gov/v1/proposals/{proposal_id}/votes', adapter },
  gov_proposals_votes_voter: { url: '/cosmos/gov/v1/proposals/{proposal_id}/votes/{voter}', adapter },
  bank_supply_by_denom: { url: "/cosmos/bank/v1beta1/supply/by_denom?denom={denom}", adapter }
};
