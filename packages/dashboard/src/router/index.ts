import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardLayout from "../views/DashboardLayout.vue";

const modules: Record<string, {routes: RouteRecordRaw[]} > = import.meta.glob('../modules/*/router.ts', {eager: true})
let children: RouteRecordRaw[] = []

for(const path in modules) {
  children = children.concat(modules[path].routes)
}

console.log(children)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    // setup all modules here.
    {
      path: '/:chain',
      component: DashboardLayout,
      children,
    },
  ],
});

export default router;
