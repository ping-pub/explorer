import type { PiniaPluginContext } from "pinia"

export function DashboardPlugin(context: PiniaPluginContext) {
    context.pinia // the pinia created with `createPinia()`
    context.app // the current app created with `createApp()` (Vue 3 only)
    context.store // the store the plugin is augmenting
    context.options // the options object defining the store passed to `defineStore()`
    // ...
    context.store.$subscribe((m, s) => console.log(m, s))
}