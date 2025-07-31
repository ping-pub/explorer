import { defineStore } from 'pinia';
import { get } from '@/libs/http';
import type { ChainConfig, DirectoryChainConfig, Endpoint, LocalChainConfig } from '@/types/chaindata';
import { ConfigSource, NetworkType } from '@/types/chaindata';
import { useBlockchain } from './useBlockchain';
import { coingeckoUrl } from '@/stores';

function apiConverter(api: any[]) {
  if (!api) return [];
  const array = typeof api === 'string' ? [api] : api;
  return array.map((x) => {
    if (typeof x === 'string') {
      const parts = String(x).split('.');
      return {
        address: x,
        provider: parts.length >= 2 ? parts[parts.length - 2] : x,
      };
    } else {
      return x as Endpoint;
    }
  });
}

export function convertFromLocal(lc: LocalChainConfig): ChainConfig {
  const conf = {} as ChainConfig;
  if (lc.assets && Array.isArray(lc.assets)) {
    conf.assets = lc.assets.map((x) => ({
      name: x.base,
      base: x.base,
      display: x.symbol,
      symbol: x.symbol,
      logo_URIs: { svg: x.logo },
      coingecko_id: x.coingecko_id,
      exponent: x.exponent,
      denom_units: [
        { denom: x.base, exponent: 0 },
        { denom: x.symbol.toLowerCase(), exponent: Number(x.exponent) },
      ],
      type_asset: 'sdk.coin',
    }));
  }
  conf.versions = {
    cosmosSdk: lc.sdk_version,
  };
  conf.bech32Prefix = lc.addr_prefix;
  conf.bech32ConsensusPrefix = lc.consensus_prefix ?? lc.addr_prefix + 'valcons';
  conf.chainName = lc.chain_name;
  conf.coinType = lc.coin_type;
  conf.prettyName = lc.registry_name || lc.chain_name;
  conf.endpoints = {
    rest: apiConverter(lc.api),
    rpc: apiConverter(lc.rpc),
    grpc: apiConverter(lc.grpc),
  };
  if (lc.provider_chain) {
    conf.providerChain = {
      api: apiConverter(lc.provider_chain.api),
    };
  }
  conf.features = lc.features;
  conf.logo = lc.logo.startsWith('http') ? lc.logo : `https://ping.pub${lc.logo}`;
  conf.keplrFeatures = lc.keplr_features;
  conf.keplrPriceStep = lc.keplr_price_step;
  conf.themeColor = lc.theme_color;
  conf.faucet = lc.faucet;
  return conf;
}

export function convertFromDirectory(source: DirectoryChainConfig): ChainConfig {
  const conf = {} as ChainConfig;
  (conf.assets = source.assets),
    (conf.bech32Prefix = source.bech32_prefix),
    (conf.bech32ConsensusPrefix = source.bech32_prefix + 'valcons'),
    (conf.chainId = source.chain_id),
    (conf.chainName = source.chain_name),
    (conf.prettyName = source.pretty_name),
    (conf.versions = {
      application: source.versions?.application_version || '',
      cosmosSdk: source.versions?.cosmos_sdk_version || '',
      tendermint: source.versions?.tendermint_version || '',
    }),
    (conf.logo = pathConvert(source.image));
  conf.endpoints = source.best_apis;
  return conf;
}

function pathConvert(path: string | undefined) {
  if (path) {
    path = path.replace('https://raw.githubusercontent.com/cosmos/chain-registry/master', 'https://registry.ping.pub');
  }
  return path || '';
}

export function getLogo(
  conf:
    | {
        svg?: string;
        png?: string;
        jpeg?: string;
      }
    | undefined
) {
  if (conf) {
    return pathConvert(conf.svg || conf.png || conf.jpeg);
  }
  return undefined;
}

// Unused function, kept for reference
// function createChainFromDirectory(source: DirectoryChain): ChainConfig {
//   const conf = {} as ChainConfig;
//   conf.apis = source.best_apis;
//   conf.bech32_prefix = source.bech32_prefix;
//   conf.chain_id = source.chain_id;
//   conf.chain_name = source.chain_name;
//   conf.explorers = source.explorers;
//   conf.pretty_name = source.pretty_name;
//   if (source.versions) {
//     conf.codebase = {
//       recommended_version: source.versions.application_version,
//       cosmos_sdk_version: source.versions.cosmos_sdk_version,
//       tendermint_version: source.versions.tendermint_version,
//     };
//   }
//   if (source.image) {
//     conf.logo_URIs = {
//       svg: source.image,
//     };
//   }
//   return conf;
// }

export enum LoadingStatus {
  Empty,
  Loading,
  Loaded,
}

export const useDashboard = defineStore('dashboard', {
  state: () => {
    const favMap = JSON.parse(localStorage.getItem('favoriteMap') || '{"cosmos":true, "osmosis":true}');
    return {
      status: LoadingStatus.Empty,
      source: ConfigSource.MainnetCosmosDirectory,
      networkType: NetworkType.Mainnet,
      favoriteMap: favMap as Record<string, boolean>,
      chains: {} as Record<string, ChainConfig>,
      prices: {} as Record<string, any>,
      coingecko: {} as Record<string, { coinId: string; exponent: number; symbol: string }>,
    };
  },
  getters: {
    length(): number {
      return Object.keys(this.chains).length;
    },
  },
  actions: {
    async initial() {
      await this.loadingFromLocal();
      //await this.loadingFromRegistry()
    },
    loadingPrices() {
      const coinIds = [] as string[];
      const keys = Object.keys(this.chains); // load all blockchain
      // Object.keys(this.favoriteMap) //only load favorite once it has too many chains
      keys.forEach((k) => {
        if (Array.isArray(this.chains[k]?.assets))
          this.chains[k].assets.forEach((a) => {
            if (a.coingecko_id !== undefined && a.coingecko_id.length > 0) {
              coinIds.push(a.coingecko_id);
              a.denom_units.forEach((u) => {
                this.coingecko[u.denom] = {
                  coinId: a.coingecko_id || '',
                  exponent: u.exponent,
                  symbol: a.symbol,
                };
              });
            }
          });
      });

      const currencies = ['usd, cny']; // usd,cny,eur,jpy,krw,sgd,hkd
      get(
        `${coingeckoUrl}/api/v3/simple/price?include_24hr_change=true&vs_currencies=${currencies.join(
          ','
        )}&ids=${coinIds.join(',')}`
      ).then((x) => {
        this.prices = x;
      });
    },
    async loadingFromRegistry() {
      if (this.status === LoadingStatus.Empty) {
        this.status = LoadingStatus.Loading;
        get(this.source).then((res: { chains: DirectoryChainConfig[] }) => {
          res.chains.forEach((x: DirectoryChainConfig) => {
            this.chains[x.chain_name] = convertFromDirectory(x);
          });
          this.status = LoadingStatus.Loaded;
        });
      }
    },
    async loadingFromLocal() {
      if (window.location.hostname.search('testnet') > -1) {
        this.networkType = NetworkType.Testnet;
      }
      const source: Record<string, LocalChainConfig> =
        this.networkType === NetworkType.Mainnet
          ? import.meta.glob('../../chains/mainnet/*.json', { eager: true })
          : import.meta.glob('../../chains/testnet/*.json', { eager: true });
      Object.values<LocalChainConfig>(source).forEach((x: LocalChainConfig) => {
        this.chains[x.chain_name] = convertFromLocal(x);
      });
      this.setupDefault();
      this.status = LoadingStatus.Loaded;
    },
    async loadLocalConfig(network: NetworkType) {
      const config: Record<string, ChainConfig> = {};
      const source: Record<string, LocalChainConfig> =
        network === NetworkType.Mainnet
          ? import.meta.glob('../../chains/mainnet/*.json', { eager: true })
          : import.meta.glob('../../chains/testnet/*.json', { eager: true });
      Object.values<LocalChainConfig>(source).forEach((x: LocalChainConfig) => {
        config[x.chain_name] = convertFromLocal(x);
      });
      return config;
    },
    setupDefault() {
      if (this.length > 0) {
        const blockchain = useBlockchain();
        const keys = Object.keys(this.favoriteMap);
        for (let i = 0; i < keys.length; i++) {
          if (!blockchain.chainName && this.chains[keys[i]] && this.favoriteMap[keys[i]]) {
            blockchain.setCurrent(keys[i]);
            break;
          }
        }
        if (!blockchain.chainName) {
          const [first] = Object.keys(this.chains);
          blockchain.setCurrent(first);
        }
        this.loadingPrices();
      }
    },
    setConfigSource(newSource: ConfigSource) {
      this.source = newSource;
      this.initial();
    },
  },
});
