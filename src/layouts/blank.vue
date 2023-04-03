<script lang="ts">
import { useSkins } from '@core/composable/useSkins'

export default defineComponent({
  setup() {
    const routerView = resolveComponent('router-view')
    const { injectSkinClasses } = useSkins()

    // ℹ️ This will inject classes in body tag for accurate styling
    injectSkinClasses()

    return () => h('div', { class: 'layout-wrapper layout-blank' }, h(routerView))
  },
})
</script>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
