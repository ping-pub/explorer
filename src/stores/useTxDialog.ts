import { defineStore } from 'pinia';
import { useWalletStore } from './useWalletStore';
import { useBlockchain } from './useBlockchain';
import router from '@/router'

let CALLBACK: any = null

export const useTxDialog = defineStore('txDialogStore', {
  state: () => {
    return {
      sender: "",
      type: "send",
      endpoint: "",
      params: "",
    };
  },
  getters: {
    walletAddress() {
      return useWalletStore().currentAddress
    },
    currentEndpoint() {
      return useBlockchain().endpoint?.address
    },
    blockchain() {
      return useBlockchain()
    },
    hdPaths() {
      return useBlockchain().defaultHDPath
    },
  },
  actions: {
    setParams(param: any) {
      this.params = JSON.stringify(param)
    },
    openWithArgument(type: string, sender: string, endpoint: string, param: any) {
      this.type = type;
      this.sender = sender;
      this.endpoint = endpoint;
      this.params = JSON.stringify(param)
    },
    open(type: string, param: any, callback?: Function) {
      this.type = type;
      this.sender = this.walletAddress;
      this.endpoint = this.currentEndpoint || "";
      this.params = JSON.stringify(param)
      if(callback) {
        CALLBACK = callback
      }else {
        CALLBACK = undefined
      }
    },
    view(tx: {
      detail: {
        eventType: string,
        hash: string
      }
    }) {
      console.log(tx.detail)
      if (tx.detail && tx.detail.hash) router.push({ path: `/${this.blockchain.chainName}/tx/${tx.detail.hash}` })
    },
    confirmed(tx: any) {
      console.log("confirmed:", tx)
      if(CALLBACK) {
        CALLBACK()
      }
    }
  },
});
