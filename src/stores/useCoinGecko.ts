import { defineStore } from 'pinia';
import { get } from '../libs/http';
import type { LoadingStatus } from './useDashboard';

export interface PriceMeta {
  usd?: string;
  usd_24h_change?: string;
  cny?: string;
  cny_24h_change?: string;
  eur?: string;
  eur_24h_change?: string;
}

const LocalStoreKey = 'currency';

export const useCoingecko = defineStore('coingecko', {
  state: () => {
    const currency = localStorage.getItem(LocalStoreKey);
    return {
      currency, // secondary currency
      loadStatus: {} as Record<string, LoadingStatus | undefined>,
      prices: {} as Record<string, PriceMeta>,
      marketChart: {},
    };
  },
  getters: {},

  actions: {
    getMarketChart(days = 30, coinId = 'cosmos') {
      return get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
    },

    fetchCoinPrice(ids: string[]) {
      const url = `https://api.coingecko.com/api/v3/simple/price?include_24hr_change=true&vs_currencies=${[
        'usd',
        this.currency,
      ].join(',')}&ids=${ids.join(',')}`;
      get(url).then((data) => {
        this.prices = { ...this.prices, ...data };
      });
    },
    getCoinInfo(coinId: string) {
      return get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    },
    setSecondaryCurrency(currency: string) {
      if (currency !== 'usd') {
        localStorage.setItem(LocalStoreKey, currency);
        this.currency = currency;
      }
    },
  },
});
