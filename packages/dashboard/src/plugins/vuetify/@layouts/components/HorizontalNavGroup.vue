<script lang="ts" setup>
import { useLayouts } from '@layouts'
import { HorizontalNavLink, HorizontalNavPopper } from '@layouts/components'
import { config } from '@layouts/config'
import { canViewNavMenuGroup } from '@layouts/plugins/casl'
import type { NavGroup } from '@layouts/types'
import { isNavGroupActive } from '@layouts/utils'

interface Props {
  item: NavGroup
  childrenAtEnd?: boolean

  // ℹ️ We haven't added this prop in vertical nav because we don't need such differentiation in vertical nav for styling
  isSubItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  childrenAtEnd: false,
  isSubItem: false,
})

defineOptions({
  name: 'HorizontalNavGroup',
})

const route = useRoute()
const router = useRouter()
const { dynamicI18nProps, isAppRtl } = useLayouts()

const isGroupActive = ref(false)

/*
  Watch for route changes, more specifically route path. Do note that this won't trigger if route's query is updated.

  updates isActive & isOpen based on active state of group.
*/
watch(() => route.path, () => {
  const isActive = isNavGroupActive(props.item.children, router)

  isGroupActive.value = isActive
}, { immediate: true })
</script>

<template>
  <HorizontalNavPopper
    v-if="canViewNavMenuGroup(item)"
    :is-rtl="isAppRtl"
    class="nav-group"
    tag="li"
    content-container-tag="ul"
    :class="[{
      'active': isGroupActive,
      'children-at-end': childrenAtEnd,
      'sub-item': isSubItem,
      'disabled': item.disable,
    }]"
    :popper-inline-end="childrenAtEnd"
  >
    <div class="nav-group-label">
      <Component
        :is="config.app.iconRenderer || 'div'"
        class="nav-item-icon"
        v-bind="item.icon || config.verticalNav.defaultNavItemIconProps"
      />
      <Component
        :is="config.app.enableI18n ? 'i18n-t' : 'span'"
        v-bind="dynamicI18nProps(item.title, 'span')"
        class="nav-item-title"
      >
        {{ item.title }}
      </Component>
      <Component
        v-bind="config.icons.chevronDown"
        :is="config.app.iconRenderer || 'div'"
        class="nav-group-arrow"
      />
    </div>

    <template #content>
      <Component
        :is="'children' in child ? 'HorizontalNavGroup' : HorizontalNavLink"
        v-for="child in item.children"
        :key="child.title"
        :item="child"
        children-at-end
        is-sub-item
      />
    </template>
  </HorizontalNavPopper>
</template>

<style lang="scss">
.layout-horizontal-nav {
  .nav-group {
    .nav-group-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .popper-content {
      z-index: 1;

      > div {
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}
</style>
