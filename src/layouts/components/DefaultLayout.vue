<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';

// Components
import newFooter from '@/layouts/components/NavFooter.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import NavbarSearch from '@/layouts/components/NavbarSearch.vue';
import ChainProfile from '@/layouts/components/ChainProfile.vue';
import Sponsors from '@/layouts/components/Sponsors.vue';

import { NetworkType, useDashboard } from '@/stores/useDashboard';
import { useBaseStore, useBlockchain } from '@/stores';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';
import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '../types';
import dayjs from 'dayjs';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
blockchain.randomSetupEndpoint();
const baseStore = useBaseStore();

const current = ref(''); // the current chain
const temp = ref('');
blockchain.$subscribe((m, s) => {
  if (current.value === s.chainName && temp.value != s.endpoint.address) {
    temp.value = s.endpoint.address;
    blockchain.initial();
  }
  if (current.value != s.chainName) {
    current.value = s.chainName;
    blockchain.randomSetupEndpoint();
  }
});

const sidebarShow = ref(false);
const sidebarOpen = ref(true);

const changeOpen = (index: Number) => {
  if (index === 0) {
    sidebarOpen.value = !sidebarOpen.value;
  }
};
const showDiscord = window.location.host.search('ping.pub') > -1;

function isNavGroup(nav: VerticalNavItems | any): nav is NavGroup {
  return (<NavGroup>nav).children !== undefined;
}

function isNavLink(nav: VerticalNavItems | any): nav is NavLink {
  return (<NavLink>nav).to !== undefined;
}

function isNavTitle(nav: VerticalNavItems | any): nav is NavSectionTitle {
  return (<NavSectionTitle>nav).heading !== undefined;
}

function selected(route: any, nav: NavLink) {
  const b = route.path === nav.to?.path || route.path.startsWith(nav.to?.path) && nav.title.indexOf('dashboard') === -1;
  return b;
}

const blocktime = computed(() => {
  return dayjs(baseStore.latest?.block?.header?.time);
});

const behind = computed(() => {
  const current = dayjs().subtract(10, 'minute');
  return blocktime.value.isBefore(current);
});

dayjs();

</script>

<template>
  <div class="bg-base-300">
    <!-- sidebar -->
    <div
      class="w-64 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-base-100 border-r border-gray-100 dark:border-gray-700"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    >
      <div class="flex justify-between mt-1 pl-4 py-4 mb-1">
        <RouterLink to="/" class="flex items-center">
          <svg class="h-10 dark:text-white text-black" viewBox="0 0 656 182" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M484.174 141.239C476.957 141.239 471.094 139.882 466.57 136.014C462.154 132.051 460.283 126.659 460.283 120.338V60.2464C460.283 53.8308 462.154 48.4386 466.57 44.5704C471.094 40.7022 476.957 39.3451 484.174 39.3451H523.154C530.478 39.3451 536.341 40.7022 540.757 44.5704C545.173 48.4386 547.044 53.8308 547.044 60.2464V120.338C547.044 126.659 545.173 132.051 540.757 136.014C536.341 139.882 530.478 141.239 523.154 141.239H484.174ZM514.352 121.644C516.937 121.644 519.239 121.564 520.639 120.338C522.147 119.111 523.154 117.377 523.154 115.112V65.4717C523.154 63.2074 522.147 61.4729 520.639 60.2464C519.239 59.0199 516.937 58.94 514.352 58.94H492.976C490.283 58.94 488.089 59.0199 486.689 60.2464C485.289 61.4729 484.174 63.2074 484.174 65.4717V115.112C484.174 117.377 485.289 119.111 486.689 120.338C488.089 121.564 490.283 121.644 492.976 121.644H514.352Z"
              fill="currentColor" />
            <path d="M438.089 140.23H413.876V40.354H438.089V140.23Z" fill="currentColor" />
            <path
              d="M328.811 140.23H304.921V40.354H330.069L367.791 101.389L367.791 83.7212V40.354H391.682V140.23H366.534L328.811 79.1947L328.811 96.8628V140.23Z"
              fill="currentColor" />
            <path
              d="M592.891 139.876H569V40H594.148L631.87 101.035L631.87 83.3672V40H655.761V139.876H630.613L592.891 78.8407L592.891 96.5088V139.876Z"
              fill="currentColor" />
            <path
              d="M220.934 141.239C213.707 141.239 207.809 139.882 203.279 135.998C198.857 132.02 196.974 126.623 196.974 120.276V40.354H220.934V115.035C220.934 117.308 222.054 119.044 223.456 120.276C224.858 121.507 227.065 121.586 229.761 121.586H249.938C252.635 121.586 254.842 121.507 256.244 120.276C257.646 119.044 258.766 117.308 258.766 115.035V40.354H282.726V120.276C282.726 126.623 280.843 132.02 276.421 135.998C271.998 139.882 266.101 141.239 258.766 141.239H220.934Z"
              fill="currentColor" />
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M121.062 121.062C121.062 154.492 93.961 181.593 60.5309 181.593C27.1006 181.593 0 154.492 0 121.062H29.6478C29.6478 137.777 43.8158 151.327 60.5309 151.327C77.246 151.327 91.4141 137.777 91.4141 121.062H121.062Z"
                  fill="currentColor" />
            <path d="M136.939 105.185H166.708V75.4155H136.939V105.185Z" fill="currentColor" />
            <path d="M121.062 75.4154H91.2924V105.185H121.062V75.4154Z" fill="currentColor" />
            <path d="M45.6461 105.185H75.4154V75.4155H45.6461V105.185Z" fill="currentColor" />
            <path d="M29.7693 75.4154H0V105.185H29.7693V75.4154Z" fill="currentColor" />
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M45.6465 60.5309C45.6465 27.1006 72.7473 0 106.177 0C139.608 0 166.708 27.1006 166.708 60.5309H137.061C137.061 43.8158 122.892 30.2655 106.177 30.2655C89.4624 30.2655 75.2943 43.8158 75.2943 60.5309H45.6465Z"
                  fill="currentColor" />
          </svg>
        </RouterLink>
        <div
          class="pr-4 cursor-pointer xl:!hidden"
          @click="sidebarShow = false"
        >
          <Icon icon="mdi-close" class="text-2xl" />
        </div>
      </div>
      <div
        v-for="(item, index) of blockchain.computedChainMenu"
        :key="index"
        class="px-2"
      >
        <div
          v-if="isNavGroup(item)"
          :tabindex="index"
          class="collapse"
          :class="{
            'collapse-arrow':index > 0 && item?.children?.length > 0,
            'collapse-open': index === 0 && sidebarOpen,
            'collapse-close': index === 0 && !sidebarOpen,
          }"
        >
          <input
            v-if="index > 0"
            type="checkbox"
            class="cursor-pointer !h-10 block"
            @click="changeOpen(index)"
          />
          <div
            class="collapse-title hidden !py-0 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
              :src="item?.icon?.image"
              class="w-6 h-6 mr-3"
            />
            <div
              class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm text-white border-none"
              :class="item?.badgeClass"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div v-for="(el, key) of item?.children" class="menu bg-base-100 w-full !p-0">
              <RouterLink
                v-if="isNavLink(el)"
                @click="sidebarShow = false"
                class="hover:bg-gray-100 dark:hover:bg-[#373f59] cursor-pointer px-3 py-2 flex items-center"
                :class="{
                  'bg-primary': selected($route, el),
                }"
                :to="el.to"
              >
                <Icon
                  v-if="!el?.icon?.image"
                  icon="mdi:chevron-right"
                  class="mr-2 ml-3"
                  :class="{
                    'text-white':
                      $route.path === el?.to?.path &&
                      item?.title !== 'Favorite',
                  }"
                />
                <img
                  v-if="el?.icon?.image"
                  :src="el?.icon?.image"
                  class="w-6 h-6 mr-3 ml-4 " :class="{
                  'border border-gray-300 bg-white': selected($route, el),
                }"
                />
                <div
                  class="text-base capitalize text-gray-500 dark:text-gray-300"
                  :class="{
                    '!text-white': selected($route, el),
                  }"
                >
                  {{ item?.title === 'Favorite' ? el?.title : $t(el?.title) }}
                </div>
              </RouterLink>
            </div>
            <div v-if="index === 0 && dashboard.networkType === NetworkType.Testnet"
                 class="menu bg-base-100 w-full !p-0">
              <RouterLink
                class="hover:bg-gray-100 dark:hover:bg-[#373f59] cursor-pointer px-3 py-2 flex items-center"
                :to="`/${blockchain.chainName}/faucet`">
                <Icon
                  icon="mdi:chevron-right"
                  class="mr-2 ml-3"
                ></Icon>
                <div
                  class="text-base capitalize text-gray-500 dark:text-gray-300"
                >
                  Faucet
                </div>
                <div
                  class="badge badge-sm text-white border-none badge-error ml-auto"
                >
                  New
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          v-if="isNavLink(item)"
          :to="item?.to"
          @click="sidebarShow = false"
          class="cursor-pointer px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
            :src="item?.icon?.image"
            class="w-6 h-6 mr-3 border border-blue-100"
          />
          <div
            class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="badge badge-sm text-white border-none"
            :class="item?.badgeClass"
          >
            {{ item?.badgeContent }}
          </div>
        </RouterLink>
        <div
          v-if="isNavTitle(item)"
          class="px-4 text-sm text-gray-400 pb-2 uppercase"
        >
          {{ item?.heading }}
        </div>
      </div>
      <div class="px-2">
        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
          Tools
        </div>
        <RouterLink to="/wallet/suggest"
                    class="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Wallet Helper
          </div>
        </RouterLink>
        <!--        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">-->
        <!--          {{ $t('module.sponsors') }}-->
        <!--        </div>-->
        <!--        <Sponsors />-->
        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">{{ $t('module.links') }}</div>
        <a
          href="https://twitter.com/ping_pub"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:twitter" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Twitter
          </div>
        </a>
        <a
          v-if="showDiscord"
          href="https://discord.com/invite/CmjYVSr6GW"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:discord" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Discord
          </div>
        </a>
        <a
          href="https://github.com/ping-pub/explorer/discussions"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            FAQ
          </div>
        </a>
      </div>
    </div>
    <div class="xl:!ml-64 px-3 pt-4">
      <!-- header -->
      <div
        class="flex items-center py-3 bg-base-100 mb-4 px-4 sticky top-0 z-10"
      >
        <div
          class="text-2xl pr-3 cursor-pointer xl:!hidden"
          @click="sidebarShow = true"
        >
          <Icon icon="mdi-menu" />
        </div>

        <ChainProfile />

        <div class="flex-1 w-0"></div>

        <!-- <NavSearchBar />-->
        <NavBarI18n class="hidden md:!inline-block" />
        <NavbarThemeSwitcher class="!inline-block" />
        <NavbarSearch class="!inline-block" />
        <NavBarWallet />
      </div>

      <!-- 👉 Pages -->
      <div style="min-height: calc(100vh - 180px);">
        <div v-if="behind" class="alert alert-error mb-4">
          <div class="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ $t('pages.out_of_sync') }} {{ blocktime.format() }} ({{ blocktime.fromNow() }})</span>
          </div>
        </div>
        <RouterView v-slot="{ Component }">
          <Transition mode="out-in">
            <Component :is="Component" />
          </Transition>
        </RouterView>
      </div>

      <newFooter />
    </div>
  </div>
</template>
