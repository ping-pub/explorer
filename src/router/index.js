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
      path: '/user/setting',
      name: 'setting',
      component: () => import('@/views/UserSetting.vue'),
      meta: {
        pageTitle: 'Setting',
        breadcrumb: [
          {
            text: 'Setting',
            active: true,
          },
        ],
      },
    },
    {
      path: '/user/portfolio',
      name: 'portfolio',
      component: () => import('@/views/UserPortfolio.vue'),
      meta: {
        pageTitle: 'Portfolio',
        breadcrumb: [
          {
            text: 'Portfolio',
            active: true,
          },
        ],
      },
    },
    {
      path: '/user/accounts',
      name: 'accounts',
      component: () => import('@/views/UserAccounts.vue'),
      meta: {
        pageTitle: 'Accounts',
        breadcrumb: [
          {
            text: 'Accounts',
            active: true,
          },
        ],
      },
    },
    {
      path: '/user/address',
      name: 'addresses',
      component: () => import('@/views/UserAddressBook.vue'),
      meta: {
        pageTitle: 'Address Book',
        breadcrumb: [
          {
            text: 'Address Book',
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
      path: '/:chain/account/:address',
      name: 'chain-account',
      component: () => import('@/views/UserAccountDetail.vue'),
      meta: {
        pageTitle: 'Accounts',
        breadcrumb: [
          {
            text: 'Accounts',
            active: true,
          },
          {
            text: 'Detail',
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
      path: '/error/chain-not-exists',
      name: 'chain-404',
      component: () => import('@/views/error/ChainNotExist.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: '/error/error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const c = to.params.chain
  if (c) store.commit('select', { chain_name: c })

  const config = JSON.parse(localStorage.getItem('chains'))
  // const has = Object.keys(config).findIndex(i => i === c)
  if (!config || Object.keys(config).findIndex(i => i === c) > -1) {
    next()
  } else if (c) {
    next({ name: 'chain-404' })
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
