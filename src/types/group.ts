import type { PaginatedResponse } from './common';

export interface Group {
  admin: string;
  created_at: string;
  id: string;
  metadata: string;
  total_weight: string;
  version: string;
}

export interface GroupPolicy {}

export interface GroupTallyResult {
  abstain_count: string;
  no_count: string;
  no_with_veto_count: string;
  yes_count: string;
}

export interface GroupProposal {
  executor_result: string;
  final_tally_result: GroupTallyResult;
  group_policy_address: string;
  group_policy_version: string;
  group_version: string;
  id: string;
  messages: any[];
  metadata: string;
  proposers: string[];
  status: string;
  submit_time: string;
  summary: string;
  title: string;
  voting_period_end: string;
}

export interface GroupVote {
  metadata: string;
  option: string;
  proposal_id: string;
  submit_time: string;
  voter: string;
}

export interface PaginatedGroups extends PaginatedResponse {
  groups: Group[];
}

export interface PaginatedGroupProposals extends PaginatedResponse {
  proposals: GroupProposal[];
}
