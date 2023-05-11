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
  <div class="">
    <div class="w-64 fixed left-0 top-0 bottom-0 overflow-auto">
      <div v-for="(item, index) of blockchain.computedChainMenu" :key="index">
        <div>{{ item?.title }}</div>
        <div v-for="(el, key) of item?.children" :key="key">
          {{ el?.title }}
        </div>
      </div>
    </div>
    <div class="ml-64 px-5">
      <div class="flex items-center py-3">
        <div class="text-2xl pr-3 cursor-pointer xl:hidden">
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

      <!-- 👉 Pages -->
      <RouterView v-slot="{ Component }">
        <Transition :name="appRouteTransition" mode="out-in">
          <Component :is="Component" />
        </Transition>
      </RouterView>

      <newFooter />
    </div>
  </div>
</template>
