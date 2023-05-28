import { defineStore } from 'pinia';
import {
  useDashboard,
  type ChainConfig,
  type Endpoint,
  EndpointType,
} from './useDashboard';
import type { VerticalNavItems } from '@/@layouts/types';
import { useRouter } from 'vue-router';
import { CosmosRestClient } from '@/libs/client';
import {
  useBankStore,
  useBaseStore,
  useGovStore,
  useMintStore,
  useStakingStore,
  useWalletStore,
} from '.';
import { useBlockModule } from '@/modules/[chain]/block/block';
import { DEFAULT } from '@/libs';

export const useBlockchain = defineStore('blockchain', {
  state: () => {
    return {
      status: {} as Record<string, string>,
      rest: '',
      chainName: '',
      endpoint: {} as {
        type?: EndpointType;
        address: string;
        provider: string;
      },
      connErr: '',
    };
  },
  getters: {
    current(): ChainConfig | undefined {
      return this.dashboard.chains[this.chainName];
    },
    logo(): string {
      return this.current?.logo || '';
    },
    defaultHDPath(): string {
      const cointype = this.current?.coinType || '118';
      // if(cointype === "60") {
      //   return `m/44'/${cointype}`
      // }
      return `m/44'/${cointype}/0'/0/0`;
      //return "connected-wallet"
    },
    dashboard() {
      return useDashboard();
    },
    isConsumerChain() {
      // @ts-ignore
      return this.current && this.current.providerChain;
    },
    computedChainMenu() {
      let currNavItem: VerticalNavItems = [];

      const router = useRouter();
      const routes = router?.getRoutes() || [];
      if (this.current && routes) {
        currNavItem = [
          {
            title: this.current?.prettyName || this.chainName || '',
            icon: { image: this.current.logo, size: '22' },
            i18n: false,
            badgeContent: this.isConsumerChain ? 'Consumer' : undefined,
            badgeClass: 'bg-error',
            children: routes
              .filter((x) => x.meta.i18n) // defined menu name
              .filter(
                (x) =>
                  !this.current?.features ||
                  this.current.features.includes(String(x.meta.i18n))
              ) // filter none-custom module
              .map((x) => ({
                title: `module.${x.meta.i18n}`,
                to: { path: x.path.replace(':chain', this.chainName) },
                icon: { icon: 'mdi-chevron-right', size: '22' },
                i18n: true,
                order: Number(x.meta.order || 100),
              }))
              .sort((a, b) => a.order - b.order),
          },
        ];
      }
      // compute favorite menu
      const favNavItems: VerticalNavItems = [];
      Object.keys(this.dashboard.favoriteMap).forEach((name) => {
        const ch = this.dashboard.chains[name];
        if (ch && this.dashboard.favoriteMap?.[name]) {
          favNavItems.push({
            title: ch.prettyName || ch.chainName || name,
            to: { path: `/${ch.chainName || name}` },
            icon: { image: ch.logo, size: '22' },
          });
        }
      });

      // combine all together
      return [
        ...currNavItem,
        { heading: 'Ecosystem' },
        {
          title: 'Favorite',
          children: favNavItems,
          badgeContent: favNavItems.length,
          badgeClass: 'bg-primary',
          i18n: true,
          icon: { icon: 'mdi-star', size: '22' },
        },
        {
          title: 'All Blockchains',
          to: { path: '/' },
          badgeContent: this.dashboard.length,
          badgeClass: 'bg-primary',
          i18n: true,
          icon: { icon: 'mdi-grid', size: '22' },
        },
      ];
    },
  },
  actions: {
    async initial() {
      // this.current?.themeColor {
      //     const { global } = useTheme();
      //     global.current
      // }
      useWalletStore().$reset();
      await this.randomSetupEndpoint();
      await useStakingStore().init();
      useBankStore().initial();
      useBaseStore().initial();
      useGovStore().initial();
      useMintStore().initial();
      useBlockModule().initial();
    },

    async randomSetupEndpoint() {
      const end = localStorage.getItem(`endpoint-${this.chainName}`);
      if (end) {
        this.setRestEndpoint(JSON.parse(end));
      } else {
        const all = this.current?.endpoints?.rest;
        if (all) {
          const rn = Math.random();
          const endpoint = all[Math.floor(rn * all.length)];
          await this.setRestEndpoint(endpoint);
        }
      }
    },

    async setRestEndpoint(endpoint: Endpoint) {
      this.connErr = '';
      this.endpoint = endpoint;
      this.rpc = new CosmosRestClient(endpoint.address, DEFAULT);
      localStorage.setItem(
        `endpoint-${this.chainName}`,
        JSON.stringify(endpoint)
      );
    },
    setCurrent(name: string) {
      if (name !== this.chainName) {
        this.chainName = name;
      }
    },
    supportModule(mod: string) {
      return !this.current?.features || this.current.features.includes(mod);
    },
  },
});
