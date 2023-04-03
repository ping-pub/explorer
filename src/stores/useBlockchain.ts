import { defineStore } from "pinia";
import { useDashboard, type ChainConfig, type Endpoint, EndpointType } from "./useDashboard";
import { LCDClient } from '@osmonauts/lcd'
import type { VerticalNavItems } from '@/@layouts/types'
import { useRouter } from "vue-router";
import { useStakingStore } from "./useStakingStore";
import { useBankStore } from "./useBankStore";
import { useBaseStore } from "./useBaseStore";
import { useGovStore } from "./useGovStore";
import { ref } from "vue";
import { useMintStore } from "./useMintStore";
import { useBlockModule } from "@/modules/[chain]/block/block";

export const useBlockchain = defineStore("blockchain", {
  state: () => {
    return {
      status: {} as Record<string, string>,
      rest: '',
      chainName: "",
      endpoint: {} as {
        type?: EndpointType,
        address: string
        provider: string       
      },
      connErr: ""
    }
  },
  getters: {
    current() : ChainConfig | undefined {
      return this.dashboard.chains[this.chainName]
    },
    logo(): string {
      return this.current?.logo || ''
    },
    dashboard() {
      return useDashboard()
    },
    computedChainMenu() {

      let currNavItem: VerticalNavItems = []

      const router = useRouter()
      const routes = router?.getRoutes()||[]
      console.log(routes)
      if(this.current && routes) {
        currNavItem = [{
          title: this.current?.prettyName || this.chainName || '',
          icon: {image: this.current.logo, size: '22'},
          i18n: false,
          children: routes
                    .filter(x=>x.name && x.name.toString().startsWith('chain'))
                    .map(x => ({
                      title: `module.${x.name?.toString()}`, 
                      to: {path: x.path.replace(':chain',this.chainName)}, 
                      icon: { icon: 'mdi-chevron-right', size: '22'},
                      i18n: true
                    }))
                    .sort((a,b)=>a.to.path.length - b.to.path.length)
        }]
      }
      // compute favorite menu
      const favNavItems: VerticalNavItems = []
      this.dashboard.favorite.forEach(name => {
        const ch = this.dashboard.chains[name]
        if(ch) {
          favNavItems.push({
            title: ch.prettyName || ch.chainName || name, 
            to: { path: `/${ch.chainName || name}`}, 
            icon: {image: ch.logo, size: '22'}
          } )
        } 
      })    

      // combine all together
      return [...currNavItem,
          { heading: 'Ecosystem' },
          {
            title: 'Favorite', 
            children: favNavItems, 
            badgeContent: favNavItems.length,
            badgeClass: 'bg-primary',
            i18n: true,
            icon: { icon: 'mdi-star', size: '22'}
          },
          {
            title: 'All Blockchains',
            to: { path : '/'},
            badgeContent: this.dashboard.length,
            badgeClass: 'bg-primary',
            i18n: true,
            icon: { icon: 'mdi-grid', size: '22'}
          }
        ]
    },
  },
  actions: {
    async initial() {
      await this.randomSetupEndpoint()
      await useStakingStore().init()
      useBankStore().initial()
      useBaseStore().initial()
      useGovStore().initial()
      useMintStore().initial()
      useBlockModule().initial()      
    },

    async randomSetupEndpoint() {
      const all = this.current?.endpoints?.rpc
      if(all) {    
          const rn = Math.random()
          const endpoint = all[Math.floor(rn * all.length)]
          await this.setRestEndpoint(endpoint)
      } 
    },
    
    async setRestEndpoint(endpoint: Endpoint) {
      this.connErr = ''
      this.endpoint = endpoint
      // this.rpc = new RPCClient(endpoint.address)
      // console.log(this.rpc.endpoint)
    },
    setCurrent(name: string) {
      this.chainName = name
      console.log('set current', name)
    },

  }
})
