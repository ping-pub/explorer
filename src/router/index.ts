import { useBlockchain } from '@/stores';
import { createRouter, createWebHistory } from 'vue-router';
// @ts-ignore
import { setupLayouts } from 'virtual:generated-layouts';
// @ts-ignore
import routes from '~pages';

const filteredRoutes = routes.filter((route: any) => {
  return route.name !== 'chain' // && route.name !== 'chain-supply';
});

const modRoutes = filteredRoutes.map((route: any) => {
  if (route.name === 'chain-xion') {
    route.path = '/:chain';
  }
  // if (route.name === 'chain-xion-supply') {
  //   route.path = '/:chain/supply'
  // }
  return route;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(modRoutes)],
});

//update current blockchain
router.beforeEach((to) => {
  const { chain } = to.params;
  if (chain) {
    const blockchain = useBlockchain();
    if (chain !== blockchain.chainName) {
      blockchain.setCurrent(chain.toString());
    }
  }
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router;
