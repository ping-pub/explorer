import { defineStore } from 'pinia';
import { useWalletStore } from './useWalletStore';
import { useBlockchain } from './useBlockchain';

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
    }
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
    open(type: string, param: any) {
        this.type = type;
        this.sender = this.walletAddress;
        this.endpoint = this.currentEndpoint || "";
        this.params = JSON.stringify(param)

        // console.log("dialog:", this.$state)
    }
  },
});
