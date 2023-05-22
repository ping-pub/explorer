import { useDashboard } from "@/stores"
import type { Coin } from "@/types"
import { fromBech32, toBech32 } from "@cosmjs/encoding"

export interface AccountEntry {
  chainName: string,
  logo: string,
  address: string,
  coinType: string,
  endpoint?: string,
  delegation?: Coin,
  balances?: Coin[],
}

export function scanLocalKeys() {
    const connected = [] as {cosmosAddress: string, hdPath: string}[]
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("m/44")) {
        const wallet = JSON.parse(localStorage.getItem(key) || "")
        if (wallet) {
          connected.push(wallet)
        }
      }
    }
    return connected
  }

  
export function scanCompatibleAccounts() {
    const dashboard = useDashboard()
    const available = [] as AccountEntry[]
    scanLocalKeys().forEach(wallet => {
      Object.values(dashboard.chains).forEach(chain => {
        if (wallet.hdPath.indexOf(chain.coinType) === 6) {
          const { data } = fromBech32(wallet.cosmosAddress)
          available.push({
            chainName: chain.chainName,
            logo: chain.logo,
            address: toBech32(chain.bech32Prefix, data),
            coinType: chain.coinType,
            endpoint: chain.endpoints.rest?.at(0)?.address
          })
        }
      })
    })
    return available
  }