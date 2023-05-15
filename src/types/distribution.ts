import type { Coin, PaginatedResponse } from './common';

export interface DistributionParams {
  params: {
    community_tax: string;
    base_proposer_reward: string;
    bonus_proposer_reward: string;
    withdraw_addr_enabled: boolean;
  };
}

export interface DelegatorRewards {
  rewards: {
    validator_address: string;
    reward: Coin[];
  }[];
  total: Coin[];
}

export interface PaginatedSlashes extends PaginatedResponse {
  slashes: any[];
}

export interface WalletConnected {
  wallet: string;
  cosmosAddress: string;
  hdPath: string;
}
