import { defineStore } from "pinia";
import { useBlockchain } from "./useBlockchain";
import Long from "long";
import numeral from "numeral";
import type { PoolSDKType } from "@ping-pub/codegen/src/cosmos/staking/v1beta1/staking";

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
        formatToken(token: {  denom: string, amount: string;}, withDenom = true) : string {
            if(token && token.amount) {
                let amount = Long.fromValue(token.amount)
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
                        amount = Long.fromValue(token.amount).divide(Math.pow(10, unit?.exponent))
                        denom = unit.denom.toUpperCase()
                    }

                    console.log("===============")
                    console.log(unit, token, amount, denom)
                    console.log("===============")
                }
                return `${numeral(amount).format('0.0a')} ${withDenom ? denom: ''}`
            } 
            return '-'      
        },
        formatTokens(tokens: {  denom: string, amount: string;}[], withDenom = true) : string {
            return tokens.map(x => this.formatToken(x, withDenom)).join(',')  
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
        formatDecimalToPercent(decimal: string) {
            return numeral(decimal).format('0.[00]%')
        },
    }
})

