<script lang="ts" setup>
import { useLayouts } from '@layouts'
import { themeConfig as config } from '@themeConfig'
import type { NavSectionTitle } from '@layouts/types'

defineProps<{
  item: NavSectionTitle
}>()

const { isVerticalNavMini, dynamicI18nProps } = useLayouts()
const { width: windowWidth } = useWindowSize()
const shallRenderIcon = isVerticalNavMini(windowWidth)
</script>

<template>
  <li class="nav-section-title">
    <div class="title-wrapper">
      <Transition
        name="vertical-nav-section-title"
        mode="out-in"
      >
        <!-- eslint-disable vue/no-v-text-v-html-on-component -->
        <Component
          :is="shallRenderIcon ? config.app.iconRenderer : config.app.enableI18n ? 'i18n-t' : 'span'"
          :key="shallRenderIcon"
          :class="shallRenderIcon ? 'placeholder-icon' : 'title-text'"
          v-bind="{ ...config.icons.sectionTitlePlaceholder, ...dynamicI18nProps(item.heading, 'span') }"
          v-text="!shallRenderIcon ? item.heading : null"
        />
        <!-- eslint-enable vue/no-v-text-v-html-on-component -->
      </Transition>
    </div>
  </li>
</template>
