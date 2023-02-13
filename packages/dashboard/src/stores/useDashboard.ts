import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { get } from '../libs/http'
import type { Chain, Asset } from '@ping-pub/chain-registry-client/dist/types'
import type { VerticalNavItems } from '@/@layouts/types'
import ChainRegistryClient from '@ping-pub/chain-registry-client'
import { useRouter } from "vue-router";

export interface DirectoryChain {
  assets: Asset[],
  bech32_prefix: string,
  best_apis: {
    rest: {address: string, provider: string}[]
    rpc: {address: string, provider: string}[]
  },
  chain_id: string,
  chain_name: string,
  pretty_name: string,
  coingecko_id: string,
  cosmwasm_enabled: boolean,
  decimals: number,
  denom: string,
  display: string,
  explorers: {
    name?: string | undefined;
    kind?: string | undefined;
    url?: string | undefined;
    tx_page?: string | undefined;
    account_page?: string | undefined;
  }[] | undefined,
  height: number,
  image: string,
  name: string,
  network_type: string,
  symbol: string,
  versions: {
    application_version: string,
    cosmos_sdk_version: string,
    tendermint_version: string,
  }
}

function pathConvert(path: string | undefined) {
  if(path) {
    path = path.replace('https://raw.githubusercontent.com/cosmos/chain-registry/master', 'https://registry.ping.pub')
  }
  return path
}

export function getLogo(conf: {
  svg?: string,
  png?: string,
  jpeg?: string,
} | undefined) {
  if(conf) {
    return pathConvert(conf.svg || conf.png || conf.jpeg)
  }
  return undefined
}

function createChainFromDirectory(source: DirectoryChain) : Chain {
  const conf: Chain = {} as Chain; 
  conf.apis = source.best_apis
  conf.bech32_prefix = source.bech32_prefix
  conf.chain_id = source.chain_id
  conf.chain_name = source.chain_name
  conf.explorers = source.explorers
  conf.pretty_name = source.pretty_name
  if(source.versions) {
    conf.codebase = {
      recommended_version: source.versions.application_version,
      cosmos_sdk_version: source.versions.cosmos_sdk_version,
      tendermint_version: source.versions.tendermint_version,
    }
  }
  if(source.image) {
    conf.logo_URIs = {
      svg: source.image
    }
  }

  return conf
}

export enum LoadingStatus {
    Empty,
    Loading,
    Loaded,
}
export enum ConfigSource {
  MainnetCosmosDirectory = "https://chains.cosmos.directory",
  TestnetCosmosDirectory = "https://chains.testcosmos.directory",
  Local = './src/blockchain',
}

export const useDashboard = defineStore("dashboard", () => {
  const status = ref(LoadingStatus.Empty)
  // current blockchain for display
  const source = ref(ConfigSource.MainnetCosmosDirectory)
  const favorite = ref(JSON.parse(localStorage.getItem('favorite') || '["cosmoshub", "osmosis"]') as string[])
  const current = ref(favorite.value[0])
  const chains = ref({} as Record<string, Chain>);

  const findChainByName = computed((name) => chains.value[name]);

  const computeChainNav = computed(() => {
    // compute current menu
    const currChain = chains.value[current.value]
    let currNavItem: VerticalNavItems = []

    const router = useRouter()
    const routes = router?.getRoutes()||[]
    console.log(routes)
    if(currChain && routes) {
      currNavItem = [{
        title: currChain.pretty_name || currChain.chain_name || current.value,
        icon: {image: getLogo(currChain.logo_URIs), size: '22'},
        i18n: false,
        children: routes
                  .filter(x=>x.name && x.name.toString().startsWith('chain'))
                  .map(x => ({
                    title: `module.${x.name?.toString()}`, 
                    to: {path: x.path.replace(':chain',current.value)}, 
                    icon: { icon: 'mdi-chevron-right', size: '22'},
                    i18n: true
                  }))
                  .sort((a,b)=>a.to.path.length - b.to.path.length)
      }]
    }
    // compute favorite menu
    const favNavItems: VerticalNavItems = []
    favorite.value.forEach(name => {
      const ch = chains.value[name]
      if(ch) {
        favNavItems.push({
          title: ch.pretty_name || ch.chain_name || name, 
          to: { path: `/${ch.chain_name || name}`}, 
          icon: {image: getLogo(ch.logo_URIs), size: '22'}
        } )
      } 
    })
    
    // combine all together
    return [...currNavItem,
        { heading: 'Ecosystem' },
        {
          title: 'Favorite', 
          children: favNavItems, 
          badgeContent: favorite.value.length,
          badgeClass: 'bg-error',
          i18n: true,
          icon: { icon: 'mdi-star', size: '22'}
        },
        {
          title: 'All Blockchains',
          to: { path : '/'},
          badgeContent: length.value,
          badgeClass: 'bg-error',
          i18n: true,
          icon: { icon: 'mdi-grid', size: '22'}
        }
      ]
  })

  const length = computed(()=> {
    return Object.keys(chains.value).length
  })
  async function initial() {
    await loadingFromRegistry()
  }

  async function loadingChainByName(name: string) {
    // const chain = await client.fetchChainInfo(name)
    // chains.value[name] = chain
  }
  function loadingFromRegistry() {
    if(status.value === LoadingStatus.Empty) {
        status.value = LoadingStatus.Loading
        get(source.value).then((res)=> {
            res.chains.forEach(( x: DirectoryChain ) => {
                chains.value[x.chain_name] = createChainFromDirectory(x)
            });
            status.value = LoadingStatus.Loaded
        })
    }
  }
  function setCurrentChain(name: string) {
    if(name && name !== current.value) {
      current.value = name
    }
  }
  function getCurrentChain() {
    return chains.value[current.value]
  }
  function setConfigSource(newSource: ConfigSource) {
    source.value = newSource
    initial()
  }
  return {
    // states
    status, favorite, current, chains, length, 
    // getters
    computeChainNav, findChainByName, getCurrentChain,
    // actions
    initial, loadingFromRegistry, loadingChainByName, setCurrentChain, setConfigSource
  };
});
