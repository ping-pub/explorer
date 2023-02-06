<script lang="ts" setup>
import { injectionKeyIsVerticalNavHovered, useLayouts } from '@layouts'
import { TransitionExpand, VerticalNavLink } from '@layouts/components'
import { config } from '@layouts/config'
import { canViewNavMenuGroup } from '@layouts/plugins/casl'
import type { NavGroup } from '@layouts/types'
import { isNavGroupActive, openGroups } from '@layouts/utils'

const props = defineProps<{
  item: NavGroup
}>()

defineOptions({
  name: 'VerticalNavGroup',
})

const route = useRoute()
const router = useRouter()
const { width: windowWidth } = useWindowSize()
const { isVerticalNavMini, dynamicI18nProps } = useLayouts()
const hideTitleAndBadge = isVerticalNavMini(windowWidth)

/*
  ℹ️ We provided default value `ref(false)` because inject will return `T | undefined`
  Docs: https://vuejs.org/api/composition-api-dependency-injection.html#inject
*/
const isVerticalNavHovered = inject(injectionKeyIsVerticalNavHovered, ref(false))

/*
  ℹ️ We have to add watcher for `isVerticalNavCollapsed` to open & close the group when menu collapse state is changed
  We can't rely on watcher for `isVerticalNavHovered` because nav menu can be collapsed via customizer (basically without entering mouse inside nav menu)
  Hence, watcher for `isVerticalNavHovered` won't get triggered and there will no change in open state of nav group when menu is collapsed via customizer.
*/
// watch(isVerticalNavCollapsed, value => {
//   // If mouse in nav menu `isVerticalNavHovered` watcher will take care of open/close group
//   if (isVerticalNavHovered.value)
//     return

//   isGroupOpen.value = value ? false : isGroupActive.value
// })

const isGroupActive = ref(false)
const isGroupOpen = ref(false)

/**
* Checks if any of children group is open or not.
* This is helpful in preventing closing inactive parent group when inactive child group is opened. (i.e. Do not close "Nav Levels" group if child "Nav Level 2.2" is opened/clicked)
*
* @param {NavGroup['children']} children  - Nav group children
* @return {boolean} returns if any of children is open or not.
*/
const isAnyChildOpen = (children: NavGroup['children']): boolean => {
  return children.some(child => {
    let result = openGroups.value.includes(child.title)

    if ('children' in child)
      result = isAnyChildOpen(child.children) || result

    return result
  })
}

const collapseChildren = (children: NavGroup['children']) => {
  children.forEach(child => {
    if ('children' in child)
      collapseChildren(child.children)

    openGroups.value = openGroups.value.filter(group => group !== child.title)
  })
}

/*
  Watch for route changes, more specifically route path. Do note that this won't trigger if route's query is updated.

  updates isActive & isOpen based on active state of group.
*/
watch(() => route.path, () => {
  const isActive = isNavGroupActive(props.item.children, router)

  // Don't open group if vertical nav is collapsed and window size is more than overlay nav breakpoint
  isGroupOpen.value = isActive && !isVerticalNavMini(windowWidth, isVerticalNavHovered).value
  isGroupActive.value = isActive
}, { immediate: true })

/*
  Watch for isGroupOpen

    1. Find group index for adding/removing group from openGroups array
    2. update openGroups array for addition/removal of current group

  We need `immediate: true` because without it initially opened group is not added in openGroups array
*/
watch(isGroupOpen, (val: boolean) => {
  // Find group index for adding/removing group from openGroups array
  const grpIndex = openGroups.value.indexOf(props.item.title)

  // update openGroups array for addition/removal of current group

  // If group is opened => Add it to `openGroups` array
  if (val && grpIndex === -1) {
    openGroups.value.push(props.item.title)
  }

  // If group is closed remove itself and its children from the `openGroups`
  else if (!val && grpIndex !== -1) {
    openGroups.value.splice(grpIndex, 1)
    collapseChildren(props.item.children)
  }
}, { immediate: true })

/*
  Watch for openGroups

  It will help in making vertical nav adapting the behavior of accordion.
  If we open multiple groups without navigating to any route we must close the inactive or temporarily opened groups.

  😵‍💫 Gotchas:
    * If we open inactive group then it will auto close that group because we close groups based on active state.
      Goal of this watcher is auto close groups which are not active when openGroups array is updated.
      So, we have to find a way to do not close recently opened inactive group.
      For this we will fetch recently added group in openGroups array and won't perform closing operation if recently added group is current group
*/
watch(openGroups, val => {
  // Prevent closing recently opened inactive group.
  const lastOpenedGroup = val[val.length - 1]
  if (lastOpenedGroup === props.item.title)
    return

  const isActive = isNavGroupActive(props.item.children, router)

  // Goal of this watcher is to close inactive groups. So don't do anything for active groups.
  if (isActive)
    return

  // We won't close group if any of child group is open in current group
  if (isAnyChildOpen(props.item.children))
    return

  isGroupOpen.value = isActive
  isGroupActive.value = isActive
}, { deep: true })

// ℹ️ Previously instead of below watcher we were using two individual watcher for `isVerticalNavHovered`, `isVerticalNavCollapsed` & `isLessThanOverlayNavBreakpoint`
watch(isVerticalNavMini(windowWidth, isVerticalNavHovered), val => {
  isGroupOpen.value = val ? false : isGroupActive.value
})

// watch(isVerticalNavHovered, val => {
//   // If menu is not collapsed ignore
//   if (!(isVerticalNavCollapsed.value && !isLessThanOverlayNavBreakpoint.value(windowWidth.value)))
//     return

//   isGroupOpen.value = val ? isGroupActive.value : false
// })

/*
  Update: We don't need this watcher any more because we have new watch isVerticalNavMini that includes this one
  ℹ️ We need this watcher to
    - Collapse the group when going to `lgAndUp` if vertical nav is collapsed (else block)
    - Expand the group if it's active and screen is `mdAndDown`. Because in this screen vertical nav will be overlay nav
*/
// watch(() => isLessThanOverlayNavBreakpoint.value(windowWidth.value), isLessThanOverlayNavBreakpoint_ => {
//   // If window size is more than overlay nav breakpoint => expand group if its active
//   if (isLessThanOverlayNavBreakpoint_) { isGroupOpen.value = isGroupActive.value }

//   else {
//     if (isVerticalNavCollapsed.value)
//       isGroupOpen.value = false
//   }
// })
</script>

<template>
  <li
    v-if="canViewNavMenuGroup(item)"
    class="nav-group"
    :class="[
      {
        active: isGroupActive,
        open: isGroupOpen,
        disabled: item.disable,
      },
    ]"
  >
    <div
      class="nav-group-label"
      @click="isGroupOpen = !isGroupOpen"
    >
      <Component
        :is="config.app.iconRenderer || 'div'"
        v-bind="item.icon || config.verticalNav.defaultNavItemIconProps"
        class="nav-item-icon"
      />
      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is=" config.app.enableI18n ? 'i18n-t' : 'span'"
          v-bind="dynamicI18nProps(item.title, 'span')"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="config.app.enableI18n ? 'i18n-t' : 'span'"
          v-bind="dynamicI18nProps(item.badgeContent, 'span')"
          v-show="!hideTitleAndBadge"
          v-if="item.badgeContent"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
        >
          {{ item.badgeContent }}
        </Component>
        <Component
          :is="config.app.iconRenderer || 'div'"
          v-show="!hideTitleAndBadge"
          v-bind="config.icons.chevronRight"
          key="arrow"
          class="nav-group-arrow"
        />
      </TransitionGroup>
    </div>
    <TransitionExpand>
      <ul
        v-show="isGroupOpen"
        class="nav-group-children"
      >
        <Component
          :is="'children' in child ? 'VerticalNavGroup' : VerticalNavLink"
          v-for="child in item.children"
          :key="child.title"
          :item="child"
        />
      </ul>
    </TransitionExpand>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-group {
    &-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
