import { useBlockchain, useCoingecko, useBaseStore, useBankStore, useFormatter } from "@/stores";
import { useDistributionStore } from "@/stores/useDistributionStore";
import { useMintStore } from "@/stores/useMintStore";
import { useStakingStore } from "@/stores/useStakingStore";
import numeral from "numeral";
import { defineStore } from "pinia";

function colorMap(color: string) {
    switch (color) {
        case 'yellow':
            return 'warning'
        case 'green':
            return 'success'
        default:
            return 'secondary'
    }
}

export const useIndexModule = defineStore('module-index', {
    state: () => {
        return {
            days: 14,
            tickerIndex: 0,
            coinInfo: {
                name: '',
                symbol: '',
                description: {
                    en: ''
                },
                categories: [] as string[],
                market_cap_rank: 0,
                links: {
                    twitter_screen_name: '',
                    homepage: [] as string[],
                    repos_url: {
                        github: []
                    },
                    telegram_channel_identifier: ''
                },
                market_data: {
                    price_change_percentage_24h: 0
                },
                tickers: [] as {
                    market: {
                        name: string,
                        identifier: string,
                    },
                    coin_id: string,
                    target_coin_id: string,
                    trust_score: string,
                    trade_url: string,
                    converted_last: {
                        btc: number,
                        eth: number,
                        usd: number,
                    },
                    base: string,
                    target: string,
                }[]
            },
            marketData: {
                market_caps: [],
                prices: [] as number[],
                total_volumes: [] as number[],
            },
            communityPool: [] as {amount: string, denom: string}[]
        }
    },
    getters: {
        blockchain() {
            const chain = useBlockchain()
            return chain.current
        },
        coingecko() {
            return useCoingecko()
        },
        bankStore() {
            return useBankStore()
        },
        twitter() : string {
            return `https://twitter.com/${this.coinInfo.links.twitter_screen_name}`
        },
        homepage(): string {
            const [page1, page2, page3] = this.coinInfo.links?.homepage
            return page1 || page2 || page3
        },
        github(): string {
            const [page1, page2, page3] = this.coinInfo.links?.repos_url?.github
            return page1 || page2 || page3
        },
        telegram() : string {
            return `https://t.me/${this.coinInfo.links.telegram_channel_identifier}`
        },

        priceChange(): string {
            const change = this.coinInfo.market_data?.price_change_percentage_24h || 0
            console.log(change, 'change')
            return numeral(change).format('+0.[00]')
        },

        priceColor() : string {
            const change = this.coinInfo.market_data?.price_change_percentage_24h || 0
            switch (true) {
                case change > 0:
                    return 'text-success'
                case change < 0:
                    return 'text-error'
                default:
                    return ''
            }
        },
        trustColor() : string {
            const change = this.coinInfo.tickers[this.tickerIndex]?.trust_score
            return colorMap(change)
        },

        mintStore() {
            return useMintStore()
        },

        stats () { 
            const base = useBaseStore()
            const bank = useBankStore()
            const formatter = useFormatter()
            const staking = useStakingStore()
            const pool = staking.pool
            return [
                {
                  title: 'Height',
                  color: 'primary',
                  icon: 'mdi-pound',
                  stats: String(base.latest.block?.header?.height || 0),
                  change: 0,
                },
                {
                  title: 'Validators',
                  color: 'error',
                  icon: 'mdi-human-queue',
                  stats: String(base.latest.block?.last_commit?.signatures.length || 0),
                  change: 0,
                },
                {
                  title: 'Supply',
                  color: 'success',
                  icon: 'mdi-currency-usd',
                  stats: formatter.formatTokenAmount(bank.supply),
                  change: 0,
                },
                {
                  title: 'Bonded Tokens',
                  color: 'warning',
                  icon: 'mdi-lock',
                  stats: formatter.formatTokenAmount({amount: pool.bonded_tokens, denom: staking.params.bond_denom }),
                  change: 0,
                },                
                {
                    title: 'Inflation',
                    color: 'success',
                    icon: 'mdi-chart-multiple',
                    stats: formatter.formatDecimalToPercent(this.mintStore.inflation),
                    change: 0,
                },
                {
                    title: 'Community Pool',
                    color: 'primary',
                    icon: 'mdi-bank',
                    stats: formatter.formatTokens(this.communityPool),
                    change: 0,
                },
            ]
        },
    },
    actions: {
        async loadDashboard() {
            this.initCoingecko()
            this.mintStore.fetchInflation()
            const dist = useDistributionStore()
            dist.fetchCommunityPool().then(x => {
                this.communityPool = x.pool.filter(t=> t.denom.length < 10).map(t => ({ 
                    amount: String(parseInt(t.amount)),
                    denom: t.denom
                }))
            })
        },
        tickerColor(color: string) {
            return colorMap(color)
        },        
        initCoingecko() {
            this.tickerIndex = 0
            const [firstAsset] = this.blockchain?.assets || []
            if (firstAsset && firstAsset.coingecko_id) {
                this.coingecko.getCoinInfo(firstAsset.coingecko_id).then(x => {
                    this.coinInfo = x
                })
                this.coingecko.getMarketChart(this.days, firstAsset.coingecko_id).then(x => {
                    this.marketData = x
                })
            }
        },
        selectTicker(i: number) {
            this.tickerIndex = i
        }
    }
})