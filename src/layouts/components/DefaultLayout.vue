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
import NavBarI18n from './NavBarI18n.vue';
import NavSearchBar from './NavSearchBar.vue';
import NavBarNotifications from './NavBarNotifications.vue';
import NavBarWallet from './NavBarWallet.vue';
import TheCustomizer from '@/plugins/vuetify/@core/components/TheCustomizer.vue';
import Breadcrumbs from './Breadcrumbs.vue';
import { useBlockchain } from '@/stores';

const { appRouteTransition } = useThemeConfig();

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
    <div class="w-64 fixed left-0 top-0 bottom-0 overflow-auto bg-base-100">
      <div class="flex items-center pl-4 py-4 mb-1">
        <img class="w-10 h-10" src="../../assets/logo.svg" />
        <h1 class="flex-1 ml-3 text-2xl font-bold dark:text-white">Ping.pub</h1>
        <div class="pr-4 cursor-pointer xl:hidden">
          <Icon icon="mdi-close" class="text-3xl" />
        </div>
      </div>
      <div v-for="(item, index) of blockchain.computedChainMenu" :key="index">
        <div
          v-if="item?.title && item?.children?.length"
          class="collapse"
          :class="{ 'collapse-arrow': item?.children?.length > 0 }"
        >
          <input type="checkbox" />
          <div
            class="collapse-title px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]"
          >
            <Icon
              v-if="item?.icon?.icon"
              :icon="item?.icon?.icon"
              class="text-xl mr-2"
              :class="{
                'text-yellow-500': item?.title === 'Favorite',
                'text-blue-500': item?.title !== 'Favorite',
              }"
            />
            <img
              v-if="item?.icon?.image"
              v-lazy="item?.icon?.image"
              class="w-6 h-6 rounded-full mr-3"
            />
            <div
              class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm badge-primary"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div class="menu bg-base-100 w-full">
              <RouterLink
                v-for="(el, key) of item?.children"
                :key="key"
                class="hover:bg-gray-100 dark:hover:bg-[#373f59] rounded cursor-pointer px-3 py-2 flex items-center"
                :to="el?.to"
              >
                <img
                  v-if="el?.icon?.image"
                  v-lazy="el?.icon?.image"
                  class="w-6 h-6 rounded-full mr-3"
                />
                <div class="text-base text-gray-500 dark:text-gray-300">
                  {{ $t(el?.title) }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          :to="item?.to"
          v-if="item?.title && !item?.children?.length"
          class="collapse-title px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon
            v-if="item?.icon?.icon"
            :icon="item?.icon?.icon"
            class="text-xl mr-2"
            :class="{
              'text-yellow-500': item?.title === 'Favorite',
              'text-blue-500': item?.title !== 'Favorite',
            }"
          />
          <img
            v-if="item?.icon?.image"
            v-lazy="item?.icon?.image"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="mr-6 badge badge-sm badge-primary"
          >
            {{ item?.badgeContent }}
          </div>
        </RouterLink>
        <div
          v-if="item?.heading"
          class="px-4 text-sm pt-4 text-gray-400 pb-2 uppercase"
        >
          {{ item?.heading }}
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
