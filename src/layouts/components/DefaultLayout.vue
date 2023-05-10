<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useThemeConfig } from '@/plugins/vuetify/@core/composable/useThemeConfig';

// Components
// import Footer from '@/layouts/components/Footer.vue';
import newFooter from '@/layouts/components/newFooter.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import UserProfile from '@/layouts/components/ChainProfile.vue';

import { useDashboard } from '@/stores/useDashboard';

// @layouts plugin
import { VerticalNavLayout } from '@layouts';
import NavBarI18n from './NavBarI18n.vue';
import NavSearchBar from './NavSearchBar.vue';
import NavBarNotifications from './NavBarNotifications.vue';
import NavBarWallet from './NavBarWallet.vue';
import TheCustomizer from '@/plugins/vuetify/@core/components/TheCustomizer.vue';
import Breadcrumbs from './Breadcrumbs.vue';
import { useBlockchain } from '@/stores';

const {
  appRouteTransition,
  isLessThanOverlayNavBreakpoint,
  isVerticalNavCollapsed,
} = useThemeConfig();
const { width: windowWidth } = useWindowSize();

// ℹ️ Provide animation name for vertical nav collapse icon.
const verticalNavHeaderActionAnimationName = ref<
  null | 'rotate-180' | 'rotate-back-180'
>(null);

watch(isVerticalNavCollapsed, (val) => {
  verticalNavHeaderActionAnimationName.value = val
    ? 'rotate-180'
    : 'rotate-back-180';
});

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
// blockchain.initial()
blockchain.$subscribe((m, s) => {
  if (!Array.isArray(m.events) && m.events.key === 'chainName') {
    blockchain.initial();
  }
});
</script>

<template>
  <VerticalNavLayout :nav-items="blockchain.computedChainMenu">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="flex items-center py-3">
        <div
          class="text-2xl pr-3 cursor-pointer xl:hidden"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <Icon icon="mdi-menu" />
        </div>

        <UserProfile />

        <div class="flex-1"></div>

        <!-- <NavSearchBar />-->
        <NavBarNotifications class="hidden md:inline-block" />
        <NavBarI18n class="hidden md:inline-block" />
        <NavbarThemeSwitcher class="hidden md:inline-block" />
        <NavBarWallet class="md:inline-block" />
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
      <!-- <Footer /> -->
      <newFooter />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer />  -->
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
