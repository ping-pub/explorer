import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        layout: 'full',
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/coffee',
      name: 'coffee',
      component: () => import('@core/layouts/components/Coffee.vue'),
      meta: {
        pageTitle: 'Donation',
        breadcrumb: [
          {
            text: 'Buy me a cup of coffee!',
            active: false,
          },
        ],
      },
    },
    // chain modules
    {
      path: '/:chain/',
      name: 'dashboard',
      alias: '/:chain',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        pageTitle: 'Dashboard',
        breadcrumb: [
          {
            text: 'Dashboard',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/parameters',
      name: 'parameters',
      component: () => import('@/views/Parameters.vue'),
      meta: {
        pageTitle: 'Parameters',
        breadcrumb: [
          {
            text: 'Parameters',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/statesync',
      name: 'statesync',
      component: () => import('@/views/StateSync.vue'),
      meta: {
        pageTitle: 'State Sync',
        breadcrumb: [
          {
            text: 'State Synchronization',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/uptime',
      name: 'uptime',
      component: () => import('@/views/Uptime.vue'),
      meta: {
        pageTitle: 'Uptime',
        breadcrumb: [
          {
            text: 'Uptime',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/staking',
      name: 'staking',
      component: () => import('@/views/Staking.vue'),
      meta: {
        pageTitle: 'Staking',
        breadcrumb: [
          {
            text: 'Staking',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/gov',
      name: 'governance',
      component: () => import('@/views/Governance.vue'),
      meta: {
        pageTitle: 'Governance',
        breadcrumb: [
          {
            text: 'Governance',
            active: true,
          },
          {
            text: 'Proposals',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/gov/:proposalid',
      name: 'proposal',
      component: () => import('@/views/GovernanceProposalView.vue'),
      meta: {
        pageTitle: 'Governance',
        breadcrumb: [
          {
            text: 'Governance',
            active: true,
          },
          {
            text: 'Proposal Detail',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/blocks',
      name: 'blocks',
      component: () => import('@/views/Blocks.vue'),
      meta: {
        pageTitle: 'Blocks',
        breadcrumb: [
          {
            text: 'Blocks',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/blocks/:height',
      name: 'block',
      component: () => import('@/views/Block.vue'),
      meta: {
        pageTitle: 'Block',
        breadcrumb: [
          {
            text: 'Blocks',
            active: true,
          },
          {
            text: 'Block',
            active: true,
          },
        ],
      },
    },
    {
      path: '/:chain/tx/:hash',
      name: 'transaction',
      component: () => import('@/views/Transaction.vue'),
      meta: {
        pageTitle: 'Transaction',
        breadcrumb: [
          {
            text: 'Transaction',
            active: true,
          },
        ],
      },
    },
    // custom modules for specified chains
    // 1. cosmos
    {
      path: '/:chain/cosmos/trade',
      name: 'gravity',
      component: () => import('@/views/GravityPool.vue'),
      meta: {
        pageTitle: 'Gravity Pools',
        breadcrumb: [
          {
            text: 'Gravity',
            active: true,
          },
        ],
      },
    },
    // 2. OSMOSIS
    {
      path: '/:chain/osmosis/trade/:poolid?',
      name: 'osmosis-trade',
      component: () => import('@/views/OsmosisTrade.vue'),
      meta: {
        pageTitle: 'Classic Trade',
        breadcrumb: [
          {
            text: 'DEX',
            active: true,
          },
          {
            text: 'Classic Trade',
            active: true,
          },
        ],
      },
    },
    // common modules
    {
      path: '/:chain/consensus',
      name: 'consensus',
      component: () => import('@/views/ConsensusStates.vue'),
      meta: {
        pageTitle: 'Consensus State',
        breadcrumb: [
          {
            text: 'Consensus State',
            active: true,
          },
        ],
      },
    },
    {
      path: '/error/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error/chain-not-exists',
      name: 'chain-404',
      component: () => import('@/views/error/ChainNotExist.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/index.php',
      redirect: '/',
    },
    {
      path: '*',
      redirect: '/error/error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const configs = JSON.parse(localStorage.getItem('chains'))
  if (configs && to.params.chain) {
    const c = String(to.params.chain).toLowerCase()
    const conf = Object.values(configs).find(i => i.chain_name === c || i.alias === c)
    if (conf) {
      store.commit('select', { chain_name: conf.chain_name })
      next()
    } else {
      next({ name: 'chain-404' })
    }
  } else {
    next()
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
