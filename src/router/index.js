import Vue from 'vue'
import VueRouter from 'vue-router'
import fetch from 'node-fetch'
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
    // chain modules
    {
      path: '/:chain/',
      name: 'info',
      alias: '/:chain',
      component: () => import('@/views/Summary.vue'),
      meta: {
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
      path: '/:chain/staking/:address',
      name: 'staking-valiator',
      component: () => import('@/views/StakingValidator.vue'),
      meta: {
        pageTitle: 'Staking Valdiator',
        breadcrumb: [
          {
            text: 'Staking',
            active: true,
          },
          {
            text: 'Validator',
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
      component: () => import('@/views/ProposalView.vue'),
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
      path: '/:chain/block/:height',
      name: 'block',
      component: () => import('@/views/Block.vue'),
      meta: {
        pageTitle: 'Block',
        breadcrumb: [
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
    {
      path: '/user/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
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
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const c = to.params.chain
  const has = Object.keys(store.state.chains.config).findIndex(i => i === c)
  if (has > -1) {
    const chain = store.state.chains.config[c]
    store.commit('select', { chain_name: c })
    if (chain.sdk_version) {
      fetch(`${chain.api}/node_info`)
        .then(res => res.json())
        .then(json => {
          const sdk = json.application_version.build_deps.find(e => e.startsWith('github.com/cosmos/cosmos-sdk'))
          const re = /(\d+(\.\d+)*)/i
          const version = sdk.match(re)
          store.commit('setup_sdk_version', { chain_name: c, version: version[0] })
        })
    }
  }
  next()
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
