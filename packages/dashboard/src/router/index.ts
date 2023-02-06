import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardLayout from "@/plugins/vuetify/layouts/default.vue";

const modules: Record<string, { routes: RouteRecordRaw[] }> = import.meta.glob(
  "../modules/*/router.ts",
  { eager: true }
);
let children: RouteRecordRaw[] = [];

for (const path in modules) {
  children = children.concat(modules[path].routes);
}

console.log(children);

export const routes = [
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  // setup all modules here.
  {
    path: "/:chain",
    component: DashboardLayout,
    children: [
      {
        path: "",
        component: () => import("../views/AboutView.vue"),
      },
      ...children,
    ],
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
