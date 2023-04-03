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
import { useStakingStore } from "./useStakingStore";
import { fromBech32, toBase64, toHex } from "@cosmjs/encoding";
import { consensusPubkeyToHexAddress, operatorAddressToAccount } from "@/libs";

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
        },
        staking() {
            return useStakingStore()
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
                    let unit = {exponent: 6, denom: ''}
                    // find the max exponent for display
                    conf.denom_units.forEach(x => {
                        if(x.exponent >= unit.exponent) {
                            unit = x
                        }
                    })
                    if(unit && unit.exponent > 0) {
                        amount = amount / Math.pow(10, unit.exponent || 6)
                        denom = unit.denom.toUpperCase()
                    }
                }
                return `${numeral(amount).format(fmt)} ${withDenom ? denom: ''}`
            } 
            return '-'      
        },
        formatTokens(tokens?: {  denom: string, amount: string;}[], withDenom = true, fmt='0.0a') : string {
            if(!tokens) return ''
            return tokens.map(x => this.formatToken(x, withDenom, fmt)).join(', ')  
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
        validator(address: Uint8Array) {
            const txt = toHex(address).toUpperCase()
            const validator = this.staking.validators.find(x => consensusPubkeyToHexAddress(x.consensusPubkey) === txt)
            return validator?.description?.moniker
        },
        calculatePercent(input?: string, total?: string|number ) {
            if(!input || !total) return '0'
            const percent = Number(input)/Number(total)
            return numeral(percent).format("0.[00]%")
        },
        formatDecimalToPercent(decimal: string) {
            return numeral(decimal).format('0.[00]%')
        },
        formatCommissionRate(v?: string) {
            console.log(v)
            if(!v) return '-'
            const rate = Number(v) / Number("1000000000000000000")
            return this.percent(rate)
        },
        percent(decimal?: string|number) {
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
        },
        messages(msgs: {typeUrl: string}[]) {
            if(msgs) {
                const sum: Record<string, number> = msgs.map(msg => {
                    return msg.typeUrl.substring(msg.typeUrl.lastIndexOf('.') + 1).replace('Msg', '')
                }).reduce((s, c) => {
                    const sh: Record<string, number> = s
                    if (sh[c]) {
                      sh[c] += 1
                    } else {
                      sh[c] = 1
                    }
                    return sh
                  }, {})
                  const output: string[] = []
                  Object.keys(sum).forEach(k => {
                    output.push(sum[k] > 1 ? `${k}×${sum[k]}` : k)
                  })
                  return output.join(', ')
            }
        },                 
    }
})

