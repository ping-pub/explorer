/*
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-07-14 00:37:07
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: \look-web\src\entry-h5\router.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/validator'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "h5" */ '../views/base-layout/_h5.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "h5" */ '../views/dashboard/_h5.vue')
      },
      {
        path: 'validator',
        component: () => import(/* webpackChunkName: "h5" */ '../views/validator/_h5.vue')
      },
      {
        path: '/block',
        component: () => import(/* webpackChunkName: "h5" */ '../views/block/_h5.vue')
      },
      {
        path: '/uptime',
        component: () => import(/* webpackChunkName: "h5" */ '../views/uptime/_h5.vue')
      },
      {
        path: '/parameter',
        component: () => import(/* webpackChunkName: "h5" */ '../views/parameter/_h5.vue')
      },
      {
        path: '/governance',
        component: () => import(/* webpackChunkName: "h5" */ '../views/governance/_h5.vue')
      },
    ]
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "h5" */ '../views/base-layout/_h5_content'),
    children: [
      {
        path: '/chain-add',
        component: () => import(/* webpackChunkName: "h5" */ '../views/chain-add/_h5.vue')
      },
      {
        path: '/validator/:address',
        component: () => import(/* webpackChunkName: "h5" */ '../views/validator-address/_h5.vue')
      },
      {
        path: '/block/:height',
        component: () => import(/* webpackChunkName: "h5" */ '../views/block-height/_h5.vue')
      },
      {
        path: '/tx/:hash',
        component: () => import(/* webpackChunkName: "h5" */ '../views/tx-hash/_h5.vue')
      },
      {
        path: '/governance/:id',
        component: () => import(/* webpackChunkName: "h5" */ '../views/governance-id/_h5.vue')
      },
      // {
      //   path: '/wallet',
      //   component: () => import(/* webpackChunkName: "wallet" */ '../views/wallet/_h5.vue')
      // },
      // {
      //   path: '/wallet-add',
      //   component: () => import(/* webpackChunkName: "wallet" */ '../views/wallet-add/_h5.vue')
      // },
      // {
      //   path: '/wallet-send',
      //   component: () => import(/* webpackChunkName: "wallet" */ '../views/wallet-send/_h5.vue')
      // },
      {
        path: '/cdp',
        component: () => import(/* webpackChunkName: "h5" */ '../views/kava/CdpH5.vue')
      },
      {
        path: '/auction',
        component: () => import(/* webpackChunkName: "h5" */ '../views/kava/Auction.vue')
      },
      {
        path: '/bep3',
        component: () => import(/* webpackChunkName: "h5" */ '../views/kava/Bep3.vue')
      },
      {
        path: '/pricefeed',
        component: () => import(/* webpackChunkName: "h5" */ '../views/kava/Pricefeed.vue')
      },
      // committee
      {
        path: '/committee',
        component: () => import(/* webpackChunkName: "h5" */ '../views/governance-kava/_pc.vue')
      },
      {
        path: '/committee/:id',
        component: () => import(/* webpackChunkName: "h5" */ '../views/governance-id-kava/_pc.vue')
      },
    ]
  },

]

const router = new VueRouter({
  routes
})


router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})

export default router
