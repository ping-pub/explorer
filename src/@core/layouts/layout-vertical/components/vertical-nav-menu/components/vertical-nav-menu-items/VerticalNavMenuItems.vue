<template>
  <ul>
    <component
      :is="resolveNavItemComponent(item)"
      v-for="item in menus"
      :key="item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { provide, ref } from '@vue/composition-api'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'
import modules from '../../../../../modules'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup() {
    provide('openGroups', ref([]))
    return {
      resolveNavItemComponent,
    }
  },
  computed: {
    menus() {
      // pick current blockchain
      const { selected } = this.$store.state.chains
      const { excludes } = selected
      const children = []
      modules().forEach(m => {
        if (excludes === undefined || excludes.indexOf(m.route) === -1) {
          if (m.scope.match('normal') || m.scope.match(selected.chain_name)) {
            children.push({
              title: m.title,
              route: { name: m.route, params: { chain: selected.chain_name } },
            })
          }
        }
      })

      return [{
        header: `${selected.chain_name} Dashboard`,
        icon: selected.logo,
      }].concat(children).concat(this.items)
    },
  },
}
</script>
