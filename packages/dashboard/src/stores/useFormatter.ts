import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import Long from "long";
import numeral from "numeral";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'
import localeData from 'dayjs/plugin/localeData'
import type { PoolSDKType } from "@ping-pub/codegen/src/cosmos/staking/v1beta1/staking";

dayjs.extend(localeData)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
})

export const useFormatter = defineStore('formatter', {
    state: () => {
        return {
        }
    },
    getters: {
        blockchain() {
            return useBlockchain()
        }
    },
    actions: {
        formatTokenAmount(token: {denom: string, amount: string;}) {
            return this.formatToken(token, false)
        },
        formatToken2(token: {  denom: string, amount: string;}, withDenom = true) {
            return this.formatToken(token, true, '0,0.[00]')
        },
        formatToken(token: {  denom: string, amount: string;}, withDenom = true, fmt='0.0a') : string {
            if(token && token.amount) {
                let amount = Number(token.amount)
                let denom = token.denom
                const conf = this.blockchain.current?.assets?.find(x => x.base === token.denom || x.base.denom === token.denom)
                if(conf) {
                    let unit = {exponent: 0, denom: ''}
                    // find the max exponent for display
                    conf.denom_units.forEach(x => {
                        if(x.exponent >= unit.exponent) {
                            unit = x
                        }
                    })
                    if(unit && unit.exponent > 0) {
                        amount = amount / Math.pow(10, unit?.exponent)
                        denom = unit.denom.toUpperCase()
                    }
                }
                return `${numeral(amount).format(fmt)} ${withDenom ? denom: ''}`
            } 
            return '-'      
        },
        formatTokens(tokens: {  denom: string, amount: string;}[], withDenom = true) : string {
            return tokens.map(x => this.formatToken(x, withDenom)).join(', ')  
        },
        calculateBondedRatio(pool: {bonded_tokens: string, not_bonded_tokens: string}|undefined) {
            if(pool && pool.bonded_tokens) {
                const b = Number(pool.bonded_tokens)
                const nb = Number(pool.not_bonded_tokens)
                const p = b/(b+nb)
                console.log(b, nb, p, pool)
                return numeral(p).format('0.[00]%')
            }
            return '-'
        },
        calculatePercent(input?: string, total?: string|number ) {
            if(!input || !total) return '0'
            const percent = Number(input)/Number(total)
            return numeral(percent).format("0.[00]%")
        },
        formatDecimalToPercent(decimal: string) {
            return numeral(decimal).format('0.[00]%')
        },
        percent(decimal?: string) {
            return decimal ? numeral(decimal).format('0.[00]%') : '-'
        },
        numberAndSign(input: number, fmt="+0,0") {
            return numeral(input).format(fmt)
        },
        toDay(time?: string, format = 'long') {
            if(!time) return ''
            if (format === 'long') {
              return dayjs(time).format('YYYY-MM-DD HH:mm')
            }
            if (format === 'date') {
              return dayjs(time).format('YYYY-MM-DD')
            }
            if (format === 'time') {
              return dayjs(time).format('HH:mm:ss')
            }
            if (format === 'from') {
              return dayjs(time).fromNow()
            }
            if (format === 'to') {
              return dayjs(time).toNow()
            }
            return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
          }          
    }
})

