import type { Asset as RegistryAsset, DenomUnit as RegistryDenomUnit } from '@chain-registry/types';
import type { Chain, Endpoint as RegistryEndPoint } from '@chain-registry/types/chain.schema';

export enum NetworkType {
  Mainnet,
  Testnet,
}

export enum ConfigSource {
  CosmosDirectory = 'https://chains.cosmos.directory',
  MainnetCosmosDirectory = 'https://chains.cosmos.directory',
  TestnetCosmosDirectory = 'https://chains.testcosmos.directory',
  ChainRegistry = 'chain-registry',
  Local = 'local',
}

export enum EndpointType {
  rpc,
  rest,
  grpc,
  // webgrpc
}

export interface Asset extends RegistryAsset {}
export interface Endpoint extends RegistryEndPoint {}
export interface RegistryChain extends Chain {}
export interface DenomUnit extends RegistryDenomUnit {}

// Chain config structure of cosmos.directory
export interface DirectoryChain {
  assets: Asset[];
  bech32_prefix: string;
  best_apis: {
    rest: Endpoint[];
    rpc: Endpoint[];
  };
  chain_id: string;
  chain_name: string;
  pretty_name: string;
  coingecko_id: string;
  cosmwasm_enabled: boolean;
  decimals: number;
  denom: string;
  display: string;
  explorers:
    | {
        name?: string | undefined;
        kind?: string | undefined;
        url?: string | undefined;
        tx_page?: string | undefined;
        account_page?: string | undefined;
      }[]
    | undefined;
  height: number;
  image: string;
  name: string;
  network_type: string;
  symbol: string;
  versions?: {
    application_version: string;
    cosmos_sdk_version: string;
    tendermint_version: string;
  };
}

export interface ChainConfig {
  chainName: string;
  prettyName: string;
  bech32Prefix: string;
  bech32ConsensusPrefix: string;
  chainId: string;
  coinType: string;
  assets: Asset[];
  themeColor?: string;
  features?: string[];
  endpoints: {
    rest?: Endpoint[];
    rpc?: Endpoint[];
    grpc?: Endpoint[];
  };
  logo: string;
  versions: {
    application?: string;
    cosmosSdk?: string;
    tendermint?: string;
  };
  exponent: string;
  excludes?: string;
  providerChain: {
    api: Endpoint[];
  };
  // keplr config
  keplrFeatures?: string[];
  keplrPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
  faucet?: {
    amount: string;
    ip_limit: number;
    address_limit: number;
    fees: string;
  };
}
