import type { RequestRegistry } from '@/libs/api/registry'
import { CosmosRestClient } from '@/libs/client';
import { useBlockchain } from '@/stores';

// which registry is store
export const store = 'name' // name or version
// Blockchain Name
export const name = 'xion'

// xion custom request
export const requests: Partial<RequestRegistry> = {
  mint_inflation: {
    url: '/xion/mint/v1/inflation',
    adapter: async (data: any): Promise<any> => {
      try {
        // TODO: Implement the adapter for the mint_inflation request this is just example code from nolus,ts
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
};
