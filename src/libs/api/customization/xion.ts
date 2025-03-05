import type { RequestRegistry } from '@/libs/api/registry';
import { CosmosRestClient } from '@/libs/client';
import { useBlockchain } from '@/stores';

// which registry is store
export const store = 'name'; // name or version
// Blockchain Name
export const name = 'xion-mainnet-1';

// xion custom request
export const requests: Partial<RequestRegistry> = {
  mint_inflation: {
    url: '/xion/mint/v1/inflation',
    adapter: async (): Promise<{ inflation: string }> => {
      try {
        const client = CosmosRestClient.newDefault(
          useBlockchain().endpoint.address
        );

        // Get inflation rate
        const { inflation } = await client.getMintInflation().catch((e) => {
          console.error('[Xion Adapter] Failed to fetch inflation rate:', {
            error: e instanceof Error ? e.message : e,
            endpoint: '/xion/mint/v1/inflation',
          });
          return { inflation: '0' };
        });

        // Get distribution params to fetch community tax
        const { params } = await client.getDistributionParams().catch((e) => {
          console.error('[Xion Adapter] Failed to fetch distribution params:', {
            error: e instanceof Error ? e.message : e,
            endpoint: '/distribution/params',
          });
          return { params: { community_tax: '0' } };
        });

        const communityTax = params.community_tax;

        // apr calcuation is inflation * (1 - communityTax)
        const adjustedInflation =
          parseFloat(inflation) * (1 - parseFloat(communityTax));

        return { inflation: adjustedInflation.toString() };
      } catch (e) {
        console.error('[Xion Adapter] Error calculating inflation:', {
          error: e instanceof Error ? e.message : e,
          timestamp: new Date().toISOString(),
          endpoint: useBlockchain().endpoint.address,
        });
        return { inflation: '0' };
      }
    },
  },
};
