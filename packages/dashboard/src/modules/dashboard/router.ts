import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    alias: ["dashboard"],
    component: () => import("./View.vue"),
  },
];
