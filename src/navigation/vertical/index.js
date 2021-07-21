import store from '@/store'

const modules = [
  {
    scope: 'normal',
    title: 'Summary',
    route: 'info',
  },
  {
    scope: 'normal',
    title: 'Staking',
    route: 'staking',
  },
  {
    scope: 'normal',
    title: 'Governance',
    route: 'governance',
  },
]

function processMenu() {
  const chainMenus = [
    {
      title: 'Home',
      route: 'home',
      icon: 'HomeIcon',
    },
    {
      header: 'Blockchains',
    },
  ]
  Object.keys(store.state.chains.chains).forEach(chain => {
    const menu = {
      title: chain.toUpperCase(),
      icon: 'PieChartIcon',
    }
    const children = []
    modules.forEach(m => {
      if (m.scope.match('normal') || m.scope.match(chain)) {
        children.push({
          // header: `item-${chain}-${m.route}`,
          title: m.title,
          route: { name: m.route, params: { chain } },
        })
      }
    })
    menu.children = children
    chainMenus.push(menu)
  })
  return chainMenus
}
console.log(modules)

export default processMenu()
