
import { defineStore } from 'pinia';

import {useBlockchain} from '@/stores'
import { DEFAULT, NFTRestClient, type PageinatedClasses, type PageinatedNFTs } from './types';

export const useNFTModule = defineStore('module-nft', {
  state: () => {
    return {
      nfts: {} as PageinatedNFTs,
      classes: {} as PageinatedClasses,
    };
  },
  getters: {
    chain() {
      return useBlockchain()
    },
    client() {
      const client = new NFTRestClient("", DEFAULT)
      return client
    }
  },
  actions: {

  }
});
