import type { RequestRegistry } from '@/libs/registry'
import { CosmosRestClient } from '@/libs/client';
import { useBlockchain } from '@/stores';
import { adapter } from '@/libs/registry'

// Blockchain Name
export const name = 'nolus';

// nolus custom request
export const requests: Partial<RequestRegistry> = {
  mint_inflation: {
    url: '/nolus/mint/v1beta1/annual_inflation',
    adapter: async (data: any): Promise<any> => {
      try {
        const client = CosmosRestClient.newDefault(useBlockchain().endpoint.address)
        const staking = await client.getStakingPool()
        const inflation = Number(data.annual_inflation) / Number(staking.pool.bonded_tokens) || 0;
        return { inflation: inflation.toString() };
      } catch (error) {
        console.log("Error in adapter:", error);
        return { inflation: "0" };
      }
    }
  },
  bank_supply_by_denom: { url: "/cosmos/bank/v1beta1/supply/by_denom?denom={denom}", adapter }
};
