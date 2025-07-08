import { defineStore } from 'pinia';
import { useBlockchain } from './useBlockchain';
import { loadFromLocal, loadFromRegistry, loadFromDirectory } from '@/libs/chaindata';
import { type ChainConfig, ConfigSource, NetworkType } from '@/types/chaindata';
import type { CoinGeckoPrices } from '@/libs/chaindata';

export enum LoadingStatus {
  Empty,
  Loading,
  Loaded,
}

export const useDashboard = defineStore('dashboard', {
  state: () => {
    const favMap = JSON.parse(
      localStorage.getItem('favoriteMap') || '{}'
    );
    return {
      status: LoadingStatus.Empty,
      source: (ConfigSource[import.meta.env.VITE_CONFIG_SOURCE as keyof typeof ConfigSource]) || ConfigSource.Local,
      networkType: (NetworkType[import.meta.env.VITE_NETWORK_TYPE as keyof typeof NetworkType]) || NetworkType.Mainnet,
      favoriteMap: favMap as Record<string, boolean>,
      chains: {} as Record<string, ChainConfig>,
      prices: {} as Record<string, any>,
      coingecko: {} as CoinGeckoPrices,
    };
  },
  getters: {
    length(): number {
      return Object.keys(this.chains).length;
    },
    chainList(): string[] | undefined {
      const chainListString = import.meta.env.VITE_CHAIN_LIST
      console.log(`Chain list from env: ${chainListString}`);
      if (chainListString) {
        const chainList = chainListString.split(',');
        chainList.forEach((chain: string) => {
          this.favoriteMap[chain] = true;
        });
        return chainList
      }
      return undefined
    }
  },
  actions: {
    async initial() {
      if (window.location.hostname.search("testnet") > -1) {
        this.networkType = NetworkType.Testnet
      }
      if (import.meta.env.MODE === 'mainnet') {
        this.networkType = NetworkType.Mainnet
      } else if (import.meta.env.MODE === 'testnet') {
        this.networkType = NetworkType.Testnet
      }

      if (this.status === LoadingStatus.Empty) {
        this.status = LoadingStatus.Loading
        if (this.source === ConfigSource.Local) {
          this.chains = await loadFromLocal(this.networkType);
        } else if (this.source === ConfigSource.ChainRegistry) {
          this.chains = await loadFromRegistry(this.networkType, this.chainList);
        } else {
          console.log(`Loading chains from directory for network: ${this.networkType}`);
          this.chains = await loadFromDirectory(this.networkType);
        }
      }
      // this.prices = await loadPrices(this.chains)
      this.setupDefault();
      this.status = LoadingStatus.Loaded;
    },

    setupDefault() {
      if (this.length > 0) {
        const blockchain = useBlockchain();
        const favoriteChainName = Object.keys(this.favoriteMap).find(
          (key) => this.chains[key] && this.favoriteMap[key]
        );

        if (!blockchain.chainName && favoriteChainName) {
          blockchain.setCurrent(favoriteChainName);
        } else if (!blockchain.chainName) {
          const [first] = Object.keys(this.chains);
          blockchain.setCurrent(first);
        }
      }
    },

    setConfigSource(newSource: ConfigSource) {
      this.source = newSource;
      this.initial();
    },
  },
});
