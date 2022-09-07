import store from '@/store'
import { isTestnet } from '../../libs/utils'

function processMenu() {
  const chainMenus = []
  const blockchains = []
  Object.keys(store.state.chains.config).forEach(chain => {
    const menu = {
      title: chain,
      logo: store.state.chains.config[chain].logo,
      route: { name: 'dashboard', params: { chain } },
    }
    blockchains.push(menu)
  })

  if (blockchains.length > 1) {
    chainMenus.push({ header: 'ecosystem' })
    chainMenus.push({
      title: 'blockchains',
      children: blockchains,
      tag: `${blockchains.length}`,
      icon: 'https://ping.pub/logo.svg',
    })
  }
  chainMenus.push({ header: 'LINKS' })
  if (isTestnet()) {
    chainMenus.push({
      title: 'Ethermint (EVM) Explorer',
      href: 'https://cosmos.pointnetwork.io/point',
      icon: 'ServerIcon',
    })
  } else {
    chainMenus.push({
      title: 'Ethermint (EVM) Explorer',
      href: 'https://explorer.pointnetwork.io',
      icon: 'ServerIcon',
    })
  }
  chainMenus.push({
    title: 'Github',
    href: 'https://github.com/pointnetwork',
    icon: 'GithubIcon',
  })
  chainMenus.push({
    title: 'Discord',
    href: 'https://pointnetwork.io/link/discord',
    icon: 'EyeIcon',
  })
  chainMenus.push({
    title: 'Twitter',
    href: 'https://twitter.com/pointnetwork',
    icon: 'TwitterIcon',
  })
  chainMenus.push({
    title: 'Telegram',
    href: 'https://t.me/pointnetworkchat',
    icon: 'SendIcon',
  })

  return chainMenus
}

export default processMenu()
