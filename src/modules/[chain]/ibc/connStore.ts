
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
        chainNames: [this.chainName],
      });
      this.fetchIBCUrls().then((res) => {
        res.forEach((element: any) => {
          if (element.download_url) {
            client.urls.push(element.download_url);
          }
        });

        client.fetchUrls().then(() => {
          const info = client.getChainIbcData(this.chainName)
          this.info = info.sort((a, b) => {
            // Sort by remote chain name (not equal to this.chainName)
            const getRemote = (x: any) => x.chain_1.chain_name === this.chainName ? x.chain_2.chain_name : x.chain_1.chain_name;
            return getRemote(a).localeCompare(getRemote(b));
          });

        })
      });

    },
    async fetchIBCUrls(): Promise<any[]> {
      let ibcEndpoint = 'https://api.github.com/repos/cosmos/chain-registry/contents/_IBC'
      if (this.chainName.includes("testnet")) {
        console.log(this.chainName)
        ibcEndpoint = 'https://api.github.com/repos/cosmos/chain-registry/contents/testnets/_IBC'
      }
      const entries = await fetch(ibcEndpoint).then((res) => res.json())
      return entries.filter((x: any) => x.name.match(this.chainName));
    },
    fetchConnection(index: number) {
      const res = this.info[index];
      const isFirstChain = res.chain_1.chain_name === this.chain.current?.prettyName || res.chain_1.chain_name === this.chain.chainName;

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
