import type { Asset as RegistryAsset, DenomUnit as RegistryDenomUnit } from '@chain-registry/types';
import type { Chain as RegistryChain, Endpoint as RegistryEndPoint } from '@chain-registry/types/chain.schema';

export enum NetworkType {
  Mainnet,
  Testnet,
}

export enum ConfigSource {
  MainnetCosmosDirectory = 'https://chains.cosmos.directory',
  TestnetCosmosDirectory = 'https://chains.testcosmos.directory',
  Local = 'local',
}

export enum EndpointType {
  rpc,
  rest,
  grpc,
  // webgrpc
}

export interface Chain extends RegistryChain {}
export interface Asset extends RegistryAsset {}
export interface Endpoint extends RegistryEndPoint {}
export interface DenomUnit extends RegistryDenomUnit {}

export interface LocalChainConfig {
  addr_prefix: string;
  consensus_prefix?: string;
  alias: string;
  api: string[] | Endpoint[];
  grpc: Endpoint[];
  provider_chain: {
    api: string[] | Endpoint[];
  };
  assets: {
    base: string;
    coingecko_id: string;
    exponent: string;
    logo: string;
    symbol: string;
  }[];
  chain_name: string;
  coin_type: string;
  logo: string;
  theme_color?: string;
  min_tx_fee: string;
  rpc: string[] | Endpoint[];
  sdk_version: string;
  registry_name?: string;
  features?: string[];
  keplr_price_step?: {
    low: number;
    average: number;
    high: number;
  };
  keplr_features: string[];
  faucet?: {
    amount: string;
    ip_limit: number;
    address_limit: number;
    fees: string;
  };
}

// Chain config structure of cosmos.directory
export interface DirectoryChainConfig {
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
