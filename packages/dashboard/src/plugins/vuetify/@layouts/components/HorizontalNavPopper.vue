<script lang="ts" setup>
import { computePosition, flip, shift } from '@floating-ui/dom'
import { useLayouts } from '@layouts/composable/useLayouts'
import { config } from '@layouts/config'
import { themeConfig } from '@themeConfig'

interface Props {
  popperInlineEnd?: boolean
  tag?: string
  contentContainerTag?: string
  isRtl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  popperInlineEnd: false,
  tag: 'div',
  contentContainerTag: 'div',
  isRTL: false,
})

const refPopperContainer = ref<HTMLElement>()
const refPopper = ref<HTMLElement>()

const popperContentStyles = ref({
  left: '0px',
  top: '0px',
})

const updatePopper = async () => {
  const { x, y } = await computePosition(refPopperContainer.value, refPopper.value, {
    placement: props.popperInlineEnd ? (props.isRtl ? 'left-start' : 'right-start') : 'bottom-start',
    middleware: [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      flip({ boundary: document.querySelector('body')! }),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shift({ boundary: document.querySelector('body')! }),
    ],

    /*
      ℹ️ Why we are not using fixed positioning?

      `position: fixed` doesn't work as expected when some CSS properties like `transform` is applied on its parent element.
      Docs: https://developer.mozilla.org/en-US/docs/Web/CSS/position#values <= See `fixed` value description

      Hence, when we use transitions where transition apply `transform` on its parent element, fixed positioning will not work.
      (Popper content moves away from the element when parent element transition)

      To avoid this, we use `position: absolute` instead of `position: fixed`.

      NOTE: This issue starts from third level children (Top Level > Sub item > Sub item).
    */
    // strategy: 'fixed',
  })

  popperContentStyles.value.left = `${x}px`
  popperContentStyles.value.top = `${y}px`
}

/*
 💡 Only add scroll event listener for updating position once horizontal nav is made static.
  We don't want to update position every time user scrolls when horizontal nav is sticky
*/
until(config.horizontalNav.type)
  .toMatch(type => type === 'static')
  .then(() => { useEventListener('scroll', updatePopper) })

const isContentShown = ref(false)

const showContent = () => {
  isContentShown.value = true
  updatePopper()
}

const hideContent = () => {
  isContentShown.value = false
}

onMounted(updatePopper)

// Recalculate position when direction changes
const { isAppRtl, appContentWidth } = useLayouts()

// ℹ️ Recalculate popper position when it's triggerer changes its position
watch([isAppRtl, appContentWidth], updatePopper)

// Watch for route changes and close popper content if route is changed
const route = useRoute()

watch(() => route.fullPath, hideContent)
</script>

<template>
  <div
    class="nav-popper"
    :class="[{
      'popper-inline-end': popperInlineEnd,
      'show-content': isContentShown,
    }]"
  >
    <div
      ref="refPopperContainer"
      class="popper-triggerer"
      @mouseenter="showContent"
      @mouseleave="hideContent"
    >
      <slot />
    </div>

    <!-- SECTION Popper Content -->
    <!-- 👉 Without transition -->
    <template v-if="!themeConfig.horizontalNav.transition">
      <div
        ref="refPopper"
        class="popper-content"
        :style="popperContentStyles"
        @mouseenter="showContent"
        @mouseleave="hideContent"
      >
        <div>
          <slot name="content" />
        </div>
      </div>
    </template>

    <!-- 👉 CSS Transition -->
    <template v-else-if="typeof themeConfig.horizontalNav.transition === 'string'">
      <Transition :name="themeConfig.horizontalNav.transition">
        <div
          v-show="isContentShown"
          ref="refPopper"
          class="popper-content"
          :style="popperContentStyles"
          @mouseenter="showContent"
          @mouseleave="hideContent"
        >
          <div>
            <slot name="content" />
          </div>
        </div>
      </Transition>
    </template>

    <!-- 👉 Transition Component -->
    <template v-else>
      <Component :is="themeConfig.horizontalNav.transition">
        <div
          v-show="isContentShown"
          ref="refPopper"
          class="popper-content"
          :style="popperContentStyles"
          @mouseenter="showContent"
          @mouseleave="hideContent"
        >
          <div>
            <slot name="content" />
          </div>
        </div>
      </Component>
    </template>
    <!-- !SECTION -->
  </div>
</template>

<style lang="scss">
.popper-content {
  position: absolute;
}
</style>
