
import { defineStore } from 'pinia';

import { useBlockchain } from '@/stores'
import { ChainRegistryClient } from '@chain-registry/client';
import type { IBCData } from '@chain-registry/types/ibc_data.schema';
import router from '@/router';
import fetch from 'cross-fetch';

export const useIBCModule = defineStore('module-ibc', {
  state: () => {
    return {
      info: [] as IBCData[],
      connectionId: "" as string,
      registryConf: {} as IBCData,
    };
  },
  getters: {
    chain() {
      return useBlockchain()
    },
    chainName(): string {
      return this.chain.chainName;
    },
    chainNamePath(): string {
      return this.chainName.match("testnet") ? `testnets/${this.chainName}` : this.chainName;
    },
    ghApiBaseUrl(): string {
      return import.meta.env.VITE_GH_API_BASE_URL || 'https://api.github.com/repos/cosmos/chain-registry';
    },
    ghApiIbcUrl(): string {
      if (this.chainName.match("testnet")) {
        return import.meta.env.VITE_GH_API_TESTNET_IBC_URL || `${this.ghApiBaseUrl}/contents/testnets/_IBC`;
      }
      return import.meta.env.VITE_GH_API_IBC_URL || `${this.ghApiBaseUrl}/contents/_IBC`;
    },
    sourceField(): string {
      return this.registryConf?.chain_1?.chain_name === this.chainName ? 'chain_1' : 'chain_2'
    },
    destField(): string {
      return this.registryConf?.chain_1?.chain_name === this.chainName ? 'chain_2' : 'chain_1'
    },
    registryChannels(): any {
      return this.registryConf.channels
    },
  },
  actions: {
    load() {
      const client = new ChainRegistryClient({
        chainNames: [this.chainNamePath],
      });

      this.fetchIBCUrls().then((res) => {
        res.forEach((element: any) => {
          if (element.download_url) {
            client.urls.push(element.download_url);
          }
        });

        client.fetchUrls().then(() => {
          this.info = client.getChainIbcData(this.chainName)
        })
      });

    },
    async fetchIBCUrls(): Promise<any[]> {
      const entries = await fetch(this.ghApiIbcUrl).then((res) => res.json())
      return entries.filter((x: any) => x.name.match(this.chainName));
    },
    fetchConnection(index: number) {
      const res = this.info[index];
      const isFirstChain = res.chain_1.chain_name === this.chainName;

      const connId = isFirstChain
        ? res.chain_1.connection_id
        : res.chain_2.connection_id;

      this.registryConf = res;
      this.showConnection(connId);
    },
    showConnection(connId?: string | number) {
      if (!connId) {
        this.registryConf = {} as any
      }
      const path = `/${this.chain.chainName}/ibc/connection/${connId || `connection-${this.connectionId || 0}`}`
      router.push(path)
    }
  },
});
