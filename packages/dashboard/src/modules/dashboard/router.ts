import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
    {
        path: '',
        alias: ['dashboard'],
        component: () => import("./View.vue"),
    },
]
