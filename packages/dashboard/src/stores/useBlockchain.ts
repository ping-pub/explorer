import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getLogo, useDashboard, type ChainConfig } from "./useDashboard";
import { useTheme } from 'vuetify'
import { LCDClient } from '@osmonauts/lcd'
import { cosmos } from '@ping-pub/codegen'
import { createBaseClientForChain } from "@/libs/client";

export const useBlockchain = defineStore("blockchain", {
  state: () => {
    return {
      status: {} as Record<string, string>,
      rest: ''
    }
  },
  getters: {
    current() {
      return useDashboard().getCurrentChain()
    },
    logo() {
      return this.current?.logo || ''
    },
    name() {
      return this.current?.chainName || ''
    },
    primaryColor() {
      const color = this.current.themeColor || '#666CFF'
      const vuetifyTheme = useTheme()
      const currentThemeName = vuetifyTheme.name.value
      vuetifyTheme.themes.value[currentThemeName].colors.primary = color
      return color
    },
    availableEndpoint() : string {
      const all = this.current?.endpoints?.rest
      if(all) {
        if(this.rest || all.findIndex(x => x.address === this.rest) < 0) {        
          const rn = Math.random()
          const endpoint = all[Math.floor(rn * all.length)]
          this.rest = endpoint?.address || ''
        }
      }      
      return this.rest
    },
    restClient() {
      return new LCDClient({restEndpoint: this.availableEndpoint()})
    },
  },
  actions: {
    setRestEndpoint(endpoint: string) {
      this.rest = endpoint
    },
    calltest() {
      console.log('call test')
      const base = createBaseClientForChain(this.current.chainName, new LCDClient({restEndpoint: 'https://api.evmos.nodestake.top/'}))
      console.log('base: ', base)
      base.getLatestBlock().then(x => console.log(x))
    }
  }
})
