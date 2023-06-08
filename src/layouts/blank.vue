<script lang="ts">
import { defineComponent, resolveComponent, h } from 'vue'

export default defineComponent({
  setup() {
    const routerView = resolveComponent('router-view');

    return () =>
      h('div', { class: 'layout-wrapper layout-blank' }, h(routerView));
  },
});
</script>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
