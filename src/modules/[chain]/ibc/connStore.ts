
import { defineStore } from 'pinia';

import {useBlockchain} from '@/stores'
import ChainRegistryClient from '@ping-pub/chain-registry-client';
import type { IBCPath, IBCInfo,  } from '@ping-pub/chain-registry-client/dist/types';
import type { Channel } from '@/types';
import router from '@/router';

export const useIBCModule = defineStore('module-ibc', {
  state: () => {
    return {
      paths: [] as IBCPath[],
      connectionId: "" as string,
      registryConf: {} as IBCInfo,
    };
  },
  getters: {
    chain() {
      return useBlockchain()
    },
    commonIBCs(): any {
      return this.paths.filter((x: IBCPath) => x.path.search(this.chain.current?.prettyName || this.chain.chainName) > -1)
    },
    sourceField(): string {
      return this.registryConf?.chain_1?.chain_name === this.chain.current?.prettyName || this.chain.chainName ? 'chain_1': 'chain_2'
    },
    destField() : string {
      return this.registryConf?.chain_1?.chain_name === this.chain.current?.prettyName || this.chain.chainName ? 'chain_2': 'chain_1'
    },
    registryChannels(): any {
      return this.registryConf.channels
    }
  },
  actions: {
    load() {
      const client = new ChainRegistryClient();
      client.fetchIBCPaths().then(res => {
        this.paths = res
      });
    },
    fetchConnection(path: string) {
      const client = new ChainRegistryClient();
      client.fetchIBCPathInfo(path).then(res => {
        const isFirstChain = res.chain_1.chain_name === this.chain.current?.prettyName || res.chain_1.chain_name === this.chain.chainName;

        const connId = isFirstChain
          ? res.chain_1.connection_id
          : res.chain_2.connection_id;

        this.registryConf = res;
        this.showConnection(connId);
      })
    },
    showConnection(connId?: string | number) {
      if(!connId) {
        this.registryConf = {} as any
      }
      const path = `/${this.chain.chainName}/ibc/connection/${connId || `connection-${this.connectionId || 0}`}`
      router.push(path)
    }
  },
});
