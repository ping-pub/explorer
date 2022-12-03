export default () => ([
  {
    scope: 'normal',
    title: 'dashboard.dashboard',
    route: 'dashboard',
  },
  {
    scope: 'normal',
    title: 'dashboard.blocks',
    route: 'blocks',
  },
  {
    scope: 'normal',
    title: 'dashboard.staking',
    route: 'staking',
  },
  {
    scope: 'normal',
    title: 'dashboard.governance',
    route: 'governance',
    exclude: 'emoney',
  },
  {
    scope: 'normal',
    title: 'dashboard.uptime',
    route: 'uptime',
  },
  {
    scope: 'normal',
    title: 'dashboard.parameters',
    route: 'parameters',
  },
  {
    scope: 'normal',
    title: 'dashboard.statesync',
    route: 'statesync',
  },
  {
    scope: 'normal',
    title: 'dashboard.consensus',
    route: 'consensus',
  },
  {
    scope: 'cos-mos',
    title: 'dashboard.gravity',
    route: 'gravity',
  },
  {
    scope: 'osmosis',
    title: 'dashboard.trade',
    route: 'osmosis-trade',
  },
])
