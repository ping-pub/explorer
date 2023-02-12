import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import { useDashboard } from "@/stores/useDashboard";
import routes from "~pages";

// import { useDashboard } from "@/stores/useDashboard";
// const dashboard = useDashboard()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
});

//update current blockchain
router.beforeEach((to) => {
    const { chain } = to.params
    if(chain){
      const dashboard = useDashboard()
      dashboard.setCurrentChain(chain.toString())
    } 
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router;