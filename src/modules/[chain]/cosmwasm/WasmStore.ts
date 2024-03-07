import { defineStore } from 'pinia';
import { useBlockchain } from '@/stores';
import { DEFAULT_VERSION, WasmRestClient } from './WasmClient';
import { get, post } from '@/libs';

export const useWasmStore = defineStore('module-wasm', {
  state: () => {
    return {};
  },
  getters: {
    wasmClient() {
      const blockchain = useBlockchain();
      return new WasmRestClient(blockchain.endpoint.address, DEFAULT_VERSION);
    },
    // fetchVerification() {
    //   get("https://prod.neutron.compiler.welldonestudio.io/neutron-deploy-histories/pion-1?contract=neutron1gesll6lepas7xzt22pg7r07v9vd652md82z8m2fqp5zt43rznu5sl42s74")
    // },
    // requestVerification() {
    //   post("https://prod.neutron.compiler.welldonestudio.io/verification/neutron", {"contractAddress": address, "chainId": baseStore.latest?.block.header.chain_id}).then(res => {
    //     console.log("verification:", res)
    // })
    // }
  },
});
