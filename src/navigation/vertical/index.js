import store from '@/store'
import { isTestnet } from '../../libs/utils'

const modules = [
  {
    scope: 'normal',
    title: 'summary',
    route: 'info',
  },
  {
    scope: 'normal',
    title: 'blocks',
    route: 'blocks',
  },
  {
    scope: 'normal',
    title: 'Validators',
    route: 'staking',
  },
  {
    scope: 'normal',
    title: 'governance',
    route: 'governance',
    exclude: 'emoney',
  },
  {
    scope: 'normal',
    title: 'uptime',
    route: 'uptime',
  },
  {
    scope: 'cos-mos',
    title: 'gravity',
    route: 'gravity',
  },
  {
    scope: 'osmosis',
    title: 'trade',
    route: 'osmosis-trade',
  },
]

function processMenu() {
  const chainMenus = [
    {
      header: 'blockchains',
    },
  ]
  Object.keys(store.state.chains.config).forEach(chain => {
    const menu = {
      title: chain,
      icon: store.state.chains.config[chain].logo,
    }
    const { excludes } = store.state.chains.config[chain]
    const children = []
    modules.forEach(m => {
      if (excludes === undefined || excludes.indexOf(m.route) === -1) {
        if (m.scope.match('normal') || m.scope.match(chain)) {
          children.push({
          // header: `item-${chain}-${m.route}`,
            title: m.title,
            route: { name: m.route, params: { chain } },
          })
        }
      }
    })
    menu.children = children
    chainMenus.push(menu)
  })
  chainMenus.push({ header: 'LINKS' })
  if (isTestnet()) {
    chainMenus.push({
      title: 'Mainnet Explorer',
      href: 'https://explorer.postcapitalist.io',
      icon: 'ChromeIcon',
    })
  } else {
    chainMenus.push({
      title: 'Testnet Explorer',
      href: 'http://testnet.postcapitalist.io',
      icon: 'LifeBuoyIcon',
    })
  }
  chainMenus.push({
    title: 'Telegram',
    href: 'https://t.me/postcapitalist_io',
    icon: 'EyeIcon',
  })
  chainMenus.push({
    title: 'Twitter',
    href: 'https://twitter.com/postcap_io',
    icon: 'TwitterIcon',
  })
  chainMenus.push({
    title: 'Github',
    href: 'https://github.com/postcapitalist_io',
    icon: 'GithubIcon',
  })

  return chainMenus
}

export default processMenu()
