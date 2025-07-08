import type { Asset, DenomUnit as AssetDenomUnit } from '@chain-registry/types';
import type { ChainConfig } from '@/types/chaindata';
import { get } from '../http';

export interface CoinGeckoPrice {
    [currency: string]: number;
    [currency: `${string}_24h_change`]: number;
}

export interface CoinGeckoPrices {
    [coinId: string]: CoinGeckoPrice;
}

type DenomUnitData = {
    coinId: string;
    exponent: number;
    symbol: string;
};

const coingeckoPriceApi = import.meta.env.VITE_COINGECKO_PRICE_API || 'https://api.coingecko.com/api/v3/simple/price';

export async function fetchCoinGeckoPrices(coinIds: string[], currencies: string[] = ['usd', 'cny']): Promise<CoinGeckoPrices> {
    try {
        const prices: CoinGeckoPrices = await get(
            `${coingeckoPriceApi}?include_24hr_change=true&vs_currencies=${currencies.join(',')}&ids=${Array.from(coinIds).join(",")}`
        );
        return prices;
    } catch (error) {
        console.error("Failed to load prices:", error);
        throw error;
    }
}

export async function loadPrices(chains: Record<string, ChainConfig>): Promise<CoinGeckoPrices> {
    let coingecko: Record<string, DenomUnitData> = {};
    const coinIds = new Set<string>();

    for (const chain of Object.values(chains)) {
        if (Array.isArray(chain?.assets)) {
            chain.assets.forEach((asset: Asset) => {
                if (asset.coingecko_id) {
                    coinIds.add(asset.coingecko_id);
                    asset.denom_units.forEach((unit: AssetDenomUnit) => {
                        coingecko[unit.denom] = {
                            coinId: asset.coingecko_id || '',
                            exponent: unit.exponent,
                            symbol: asset.symbol
                        };
                    });
                }
            });
        }
    }

    return fetchCoinGeckoPrices(Array.from(coinIds));
}
