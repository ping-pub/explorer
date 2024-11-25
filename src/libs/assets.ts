import { assets } from 'chain-registry';
import type { AssetDenomUnit } from '@chain-registry/types/types/assets';
import { Decimal } from '@cosmjs/math';
import {useFormatter} from '@/stores';

export function getDenomDetails(denom: string) {
  return assets.find(
    (assetList) => assetList.assets.find(
      (asset) => asset.base === denom)
  )?.assets.find((asset) => asset.base === denom);
}

export function findNonZeroExponent(denomUnits: AssetDenomUnit[]): AssetDenomUnit {
  const unit = denomUnits.find((unit) => unit.exponent !== 0);
  return unit ?? { exponent: 0, denom: '' };
}

export async function formatIbcToken(
  input: { amount: string, denom: string },
  withIBCHash: boolean = true
) {
  const coin = { ...input };
  const formatter = useFormatter();
  if (coin.denom.startsWith('ibc/')) {
    try {
      const data = await formatter.fetchDenomTrace(coin.denom)
      const assetDetail = getDenomDetails(data.base_denom)

      if (assetDetail && assetDetail.denom_units) {
        const units = findNonZeroExponent(assetDetail.denom_units)
        coin.denom = withIBCHash
          ? `${coin.denom} (${units.denom.toUpperCase()})`
          : units.denom.toUpperCase()
        coin.amount = Decimal.fromAtomics(coin.amount, units.exponent).toString()
      } else {
        coin.denom = withIBCHash  ?
          `${coin.denom} (${data.base_denom})`
          : data.base_denom
      }
    } catch (error) {
      console.error('Failed to fetch denom trace:', error);
      return coin; // Return original coin on error
    }
  }
  return coin;
}
