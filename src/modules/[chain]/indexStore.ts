import {
  useBlockchain,
  useCoingecko,
  useBaseStore,
  useBankStore,
  useFormatter,
  useGovStore,
} from '@/stores';
import { useDistributionStore } from '@/stores/useDistributionStore';
import { useMintStore } from '@/stores/useMintStore';
import { useStakingStore } from '@/stores/useStakingStore';
import type { Coin, Tally } from '@/types';
import numeral from 'numeral';
import { defineStore } from 'pinia';

export function colorMap(color: string) {
  switch (color) {
    case 'yellow':
      return 'warning';
    case 'green':
      return 'success';
    default:
      return 'secondary';
  }
}

const bank = useBankStore();

export const useIndexModule = defineStore('module-index', {
  state: () => {
    return {
      days: 14,
      tickerIndex: 1,
      coinInfo: {
        name: '',
        symbol: '',
        description: {
          en: '',
        },
        categories: [] as string[],
        market_cap_rank: 0,
        links: {
          twitter_screen_name: '',
          homepage: [] as string[],
          repos_url: {
            github: [],
          },
          telegram_channel_identifier: '',
        },
        market_data: {
          price_change_percentage_24h: 0,
          circulating_supply: 0,
          high_24h: {
            usd: 0,
          },
          atl: {
            usd: 0,
          },
          atl_change_percentage: {
            usd: 0,
          },
          low_24h: {
            usd: 0,
          },
          ath: {
            usd: 0,
          },
          ath_change_percentage: {
            usd: 0,
          },
          total_volume: {
            usd: 0,
          },
          market_cap: {
            usd: 0,
          },
          current_price: {
            usd: 0,
          },
        },
        tickers: [] as {
          market: {
            name: string;
            identifier: string;
          };
          coin_id: string;
          target_coin_id: string;
          trust_score: string;
          trade_url: string;
          converted_last: {
            btc: number;
            eth: number;
            usd: number;
          };
          base: string;
          target: string;
        }[],
      },
      marketData: {
        market_caps: [],
        prices: [] as number[],
        total_volumes: [] as number[],
      },
      communityPool: [] as { amount: string; denom: string }[],
      tally: {} as Record<string, Tally>,
    };
  },
  getters: {
    blockchain() {
      const chain = useBlockchain();
      return chain.current;
    },
    coingecko() {
      return useCoingecko();
    },
    bankStore() {
      return useBankStore();
    },
    twitter(): string {
      if(!this.coinInfo?.links?.twitter_screen_name) return ""
      return `https://twitter.com/${this.coinInfo?.links.twitter_screen_name}`;
    },
    homepage(): string {
      if(!this.coinInfo?.links?.homepage) return ""
      const [page1, page2, page3] = this.coinInfo?.links?.homepage;
      return page1 || page2 || page3;
    },
    github(): string {
      if(!this.coinInfo?.links?.repos_url) return ""
      const [page1, page2, page3] = this.coinInfo?.links?.repos_url?.github;
      return page1 || page2 || page3;
    },
    telegram(): string {
      if(!this.coinInfo?.links?.homepage) return ""
      return `https://t.me/${this.coinInfo?.links.telegram_channel_identifier}`;
    },

    priceChange(): string {
      if(!this.coinInfo?.market_data?.price_change_percentage_24h) return ""
      const change =
        this.coinInfo?.market_data?.price_change_percentage_24h || 0;
      return numeral(change).format('+0.[00]');
    },

    priceColor(): string {
      if(!this.coinInfo?.market_data?.price_change_percentage_24h) return ""
      const change =
        this.coinInfo?.market_data?.price_change_percentage_24h || 0;
      switch (true) {
        case change > 0:
          return 'text-success';
        case change < 0:
          return 'text-error';
        default:
          return '';
      }
    },
    trustColor(): string {
      if(!this.coinInfo?.tickers) return ""
      const change = this.coinInfo?.tickers[this.tickerIndex]?.trust_score;
      return change;
    },

    pool() {
      const staking = useStakingStore();
      return staking.pool;
    },

    proposals() {
      const gov = useGovStore()
      return gov.proposals['2']
    },

    stats() {
      const base = useBaseStore();
      const staking = useStakingStore();
      const mintStore = useMintStore();
      const formatter = useFormatter();

      return [
        {
          title: 'Latest Block',
          color: 'primary',
          // icon: 'mdi-pound',
          stats: String(base?.latest?.block?.header?.height || 0),
          change: 0,
          subtitle: `Avg Block Time: ${String(base.blocktime/1000)}s`
        },
        {
          title: 'Active Validators',
          color: '',
          // icon: 'mdi-human-queue',
          stats: String(base?.latest?.block?.last_commit?.signatures.length || 0),
          change: 0,
        },
        {
          title: 'Supply',
          color: '',
          // icon: 'mdi-currency-usd',
          stats: formatter.formatTokenAmount(bank.supply),
          change: 0,
        },
        {
          title: 'Staked Tokens',
          color: '',
          // icon: 'mdi-lock',
          stats: `${formatter.formatTokenAmount({
            // @ts-ignore
            amount: this.pool.bonded_tokens,
            denom: staking.params.bond_denom,
          }) || ""} ${staking.params.bond_denom || ""}`,
          change: 0,
        },
        {
          title: 'Inflation',
          color: 'success',
          // icon: 'mdi-chart-multiple',
          stats: formatter.formatDecimalToPercent(mintStore.inflation),
          change: 0,
        },
        {
          title: 'Community Pool',
          color: '',
          // icon: 'mdi-bank',
          // @ts-expect-error
          stats: `${this.communityPool[0]?.amount || ''} ${this.communityPool[0]?.denom || ''}`
          // formatter.formatTokens(
          //   // @ts-ignore
          //   this.communityPool?.filter(
          //     (x: Coin) => x.denom === staking.params.bond_denom
          //   )
          // )
          ,
          change: 0,
        },
      ];
    },

    coingeckoId() {
      this.tickerIndex = 0;
      // @ts-ignore
      const [firstAsset] = this.blockchain?.assets || [];
      return firstAsset.coingecko_id
    }
  },
  actions: {
    async loadDashboard() {
      this.$reset();
      this.initCoingecko();
      useBaseStore().fetchLatest();
      bank.initial();
      useStakingStore().init();
      useMintStore().fetchInflation();
      useDistributionStore()
        .fetchCommunityPool()
        .then((x) => {
          this.communityPool = x?.pool
            ?.filter((t) => t.denom.length < 10)
            ?.map((t) => ({
              amount: String(parseFloat(t.amount).toFixed(2)),
              denom: t.denom,
            }));
        });
      // const gov = useGovStore();
      // gov.fetchProposals('2').then((x) => {
      //   this.proposals = x;
      // });
    },
    tickerColor(color: string) {
      return colorMap(color);
    },
    initCoingecko() {
      this.tickerIndex = 0;
      const [firstAsset] = this.blockchain?.assets || [];
      if (firstAsset && firstAsset.coingecko_id) {
        this.coingecko.getCoinInfo(firstAsset.coingecko_id).then((x) => {
          this.coinInfo = x;
        });
        this.coingecko
          .getMarketChart(this.days, firstAsset.coingecko_id)
          .then((x) => {
            this.marketData = x;
          });
      }
    },
    selectTicker(i: number) {
      this.tickerIndex = i;
    },
  },
});
