<script lang="ts" setup>
import navItems from '@/plugins/vuetify/navigation/vertical'
import { useThemeConfig } from '@/plugins/vuetify/@core/composable/useThemeConfig'

// Components
import Footer from '@/plugins/vuetify/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/plugins/vuetify/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/plugins/vuetify/layouts/components/UserProfile.vue'

// @layouts plugin
import { VerticalNavLayout } from '@/plugins/vuetify/@layouts'

const { appRouteTransition, isLessThanOverlayNavBreakpoint, isVerticalNavCollapsed } = useThemeConfig()
const { width: windowWidth } = useWindowSize()

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref<null | 'rotate-180' | 'rotate-back-180'>(null)

watch(isVerticalNavCollapsed, val => {
  verticalNavHeaderActionAnimationName.value = val ? 'rotate-180' : 'rotate-back-180'
})
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn v-if="isLessThanOverlayNavBreakpoint(windowWidth)" class="ms-n3"
          @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="mdi-menu" />
        </IconBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition :name="appRouteTransition" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>

<style lang="scss">
@keyframes rotate-180 {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
}

@keyframes rotate-back-180 {
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.layout-vertical-nav {
  .nav-header {
    .header-action {
      animation-duration: 0s;
      animation-duration: 0.35s;
      animation-fill-mode: forwards;
      animation-name: v-bind(verticalNavHeaderActionAnimationName);
      transform: rotate(0deg);
    }
  }
}
</style>
