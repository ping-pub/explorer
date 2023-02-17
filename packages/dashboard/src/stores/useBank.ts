import { ref, computed, type ComputedRef } from "vue";
import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";

import { osmosis } from 'osmojs';
import { LCDClient } from '@osmonauts/lcd'
import { LCDQueryClient } from 'osmojs/main/codegen/cosmos/bank/v1beta1/query.lcd.js'
import type { QueryTotalSupplyRequest, QueryTotalSupplyResponseSDKType } from "osmojs/types/codegen/cosmos/bank/v1beta1/query";

export const useBank = defineStore("usebank", () => {
  const totalSupply = ref({} as QueryTotalSupplyResponseSDKType);

  const client = computed(() => {
    const blockchain = useBlockchain()
    return new LCDQueryClient(new LCDClient({restEndpoint: blockchain.availableEndpoint}))
})

  async function fetchTotalSupply({}) {
    console.log(client)
    totalSupply.value = await client.value.totalSupply({})
    return totalSupply.value;
  }

  return { totalSupply, fetchTotalSupply };
});
