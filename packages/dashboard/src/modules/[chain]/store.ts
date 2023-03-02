import { useBlockchain, useCoingecko } from "@/stores";
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
            }
        }
    },
    getters: {
        blockchain() {
            const chain = useBlockchain()
            return chain.current
        },
        coingecko() {
            const store = useCoingecko()
            return store
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
    },
    actions: {
        tickerColor(color: string) {
            return colorMap(color)
        },        
        initCoingecko() {
            this.tickerIndex = 0
            const [firstAsset] = this.blockchain?.assets
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