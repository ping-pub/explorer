
import { defineStore } from 'pinia';

import {useBlockchain} from '@/stores'
import ChainRegistryClient from '@ping-pub/chain-registry-client';
import type { IBCPath } from '@ping-pub/chain-registry-client/dist/types';
import type { Channel } from '@/types';
import router from '@/router';

export const useIBCModule = defineStore('module-ibc', {
  state: () => {
    return {
      paths: [] as IBCPath[],
      connectionId: "",
      registryConf: {},
    };
  },
  getters: {
    chain() {
      return useBlockchain()
    },
    commonIBCs() {
      return this.paths.filter(x => x.path.search(this.chain.current?.prettyName || this.chain.chainName) > -1)
    },
    sourceField() {
      return this.registryConf?.chain_1?.chain_name === this.chain.current?.prettyName || this.chain.chainName ? 'chain_1': 'chain_2'
    },
    destField() {
      return this.registryConf?.chain_1?.chain_name === this.chain.current?.prettyName || this.chain.chainName ? 'chain_2': 'chain_1'
    },
    registryChannels() {
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
        const connId = res.chain_1.chain_name === this.chain.current?.prettyName || this.chain.chainName ?
          res.chain_1.connection_id : res.chain_2.connection_id
        this.registryConf = res
        this.showConnection(connId)
      })
    },
    showConnection(connId?: string | number) {
      if(!connId) {
        this.registryConf = {}
      }
      const path = `/${this.chain.chainName}/ibc/connection/${connId || `connection-${this.connectionId || 0}`}`
      router.push(path)
    }
  },
});
