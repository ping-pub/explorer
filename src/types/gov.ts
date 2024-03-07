import type { Coin, PaginatedResponse } from './common';

export interface GovParams {
  voting_params: {
    voting_period: string;
    proposal_voting_periods: any[];
    expedited_voting_period: string;
  };
  deposit_params: {
    min_deposit: Coin[];
    max_deposit_period: string;
    min_expedited_deposit: Coin[];
    min_initial_deposit_ratio: string;
  };
  tally_params: {
    quorum: string;
    threshold: string;
    veto_threshold: string;
    expedited_threshold: string;
  };
}

export interface GovProposal {
  title?: string;
  summary?: string;
  proposal_id: string;
  metadata?: string;
  content: {
    '@type': string;
    title?: string;
    description?: string;
    current?: any[];
    changes?: any[];
    params?: any[];
    plan?: {
      height?: string | number;
      time?: string | number;
    };
  };
  status: string;
  final_tally_result: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: Coin[];
  voting_start_time: string;
  voting_end_time: string;
  is_expedited: boolean;
  voterStatus?: string
//   VoteOption[];
}

export interface VoteOption {
  option: string;
  weight: string;
}
export interface Tally {
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
}

export interface GovVote {
  proposal_id: string;
  voter: string;
  option: string;
  options: { option: string; weight: string }[];
}

export interface PaginatedProposals extends PaginatedResponse {
  proposals: GovProposal[];
}

export interface PaginatedProposalDeposit extends PaginatedResponse {
  deposits: {
    amount: Coin[];
    proposal_id: string;
    depositor: string;
  };
}

export interface PaginatedProposalVotes extends PaginatedResponse {
  votes: GovVote[];
}
