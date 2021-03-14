/*
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-10-24 14:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /look-web/src/entry-pc/router.js
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
    component: () => import(/* webpackChunkName: "pc" */ '../views/base-layout/_pc.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "pc" */ '../views/dashboard/_pc.vue')
      },
      {
        path: '/chain-add',
        component: () => import(/* webpackChunkName: "pc" */ '../views/chain-add/_pc.vue')
      },
      {
        path: '/validator',
        component: () => import(/* webpackChunkName: "pc" */ '../views/validator/_pc.vue')
      },
      {
        path: '/validator/:address',
        component: () => import(/* webpackChunkName: "pc" */ '../views/validator-address/_pc.vue')
      },
      {
        path: '/block',
        component: () => import(/* webpackChunkName: "pc" */ '../views/block/_pc.vue')
      },
      {
        path: '/block-init',
        component: () => import(/* webpackChunkName: "pc" */ '../views/block-init/_pc.vue')
      },
      {
        path: '/block/:height',
        component: () => import(/* webpackChunkName: "pc" */ '../views/block-height/_pc.vue')
      },
      {
        path: '/uptime',
        component: () => import(/* webpackChunkName: "pc" */ '../views/uptime/_pc.vue')
      },
      {
        path: '/parameter',
        component: () => import(/* webpackChunkName: "pc" */ '../views/parameter/_pc.vue')
      },
      {
        path: '/tx/:hash',
        component: () => import(/* webpackChunkName: "pc" */ '../views/tx-hash/_pc.vue')
      },
      {
        path: '/governance',
        component: () => import(/* webpackChunkName: "pc" */ '../views/governance/_pc.vue')
      },
      {
        path: '/governance/:id',
        component: () => import(/* webpackChunkName: "pc" */ '../views/governance-id/_pc.vue')
      },
      
      {
        path: '/wallet',
        component: () => import(/* webpackChunkName: "pc" */ '../views/wallet/_pc.vue')
      },
      {
        path: '/wallet-add',
        component: () => import(/* webpackChunkName: "pc" */ '../views/wallet-add/_pc.vue')
      },
      {
        path: '/wallet-send',
        component: () => import(/* webpackChunkName: "pc" */ '../views/wallet-send/_pc.vue')
      },
      {
        path: '/wallet-stake',
        component: () => import(/* webpackChunkName: "pc" */ '../views/wallet-stake/_pc.vue')
      },
      {
        path: '/wallet-vote',
        component: () => import(/* webpackChunkName: "pc" */ '../views/wallet-vote/_pc.vue')
      },
      {
        path: '/genesis-time',
        component: () => import(/* webpackChunkName: "pc" */ '../views/genesis-time/_pc.vue')
      },
      {
        path: '/cdp',
        component: () => import(/* webpackChunkName: "pc" */ '../views/kava/CDP.vue')
      },
      {
        path: '/auction',
        component: () => import(/* webpackChunkName: "pc" */ '../views/kava/Auction.vue')
      },
      {
        path: '/bep3',
        component: () => import(/* webpackChunkName: "pc" */ '../views/kava/Bep3.vue')
      },
      {
        path: '/pricefeed',
        component: () => import(/* webpackChunkName: "pc" */ '../views/kava/Pricefeed.vue')
      },
      // committee
      {
        path: '/committee',
        component: () => import(/* webpackChunkName: "pc" */ '../views/governance-kava/_pc.vue')
      },
      {
        path: '/committee/:id',
        component: () => import(/* webpackChunkName: "pc" */ '../views/governance-id-kava/_pc.vue')
      },
    ]
  },

]

const router = new VueRouter({
  routes
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
})

export default router
