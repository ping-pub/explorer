<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

// Components
import newFooter from '@/layouts/components/NavFooter.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import NavbarSearch from '@/layouts/components/NavbarSearch.vue';
import ChainProfile from '@/layouts/components/ChainProfile.vue';

import { useDashboard } from '@/stores/useDashboard';
import { useBlockchain } from '@/stores';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';
import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '../types';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
blockchain.randomSetupEndpoint();

const current = ref(''); // the current chain
const temp = ref('')
blockchain.$subscribe((m, s) => {
  if(current.value ===s.chainName && temp.value != s.endpoint.address) {
    temp.value = s.endpoint.address
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
  const b = route.path === nav.to?.path || route.path.startsWith(nav.to?.path) && nav.title.indexOf('dashboard') === -1
  return b
}
</script>

<template>
  <div class="bg-[#efefef] dark:bg-[#070707]">
    <!-- sidebar -->
    <div
      class="w-72 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-[#ffffff]  dark:bg-[#222222] border-r border-gray-100 dark:border-gray-700"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    >
      <div class="flex justify-between mt-1 pl-4 py-4 mb-1">
        <RouterLink to="/" class="flex items-center">
          <img class="w-10 h-10" src="../../assets/logo.svg" />
          <img class="w-[90%] mt-2 invert dark:filter-none" src="../../assets/WhisperNodeWhite.svg" alt="Logo" />
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
            'collapse-arrow': item?.children?.length > 0,
            'collapse-open': index === 0 && sidebarOpen,
            'collapse-close': index === 0 && !sidebarOpen,
          }"
        >
          <input
            type="checkbox"
            class="cursor-pointer !h-10 block"
            @click="changeOpen(index)"
          />
          <div
            class="collapse-title !py-0 px-4 flex items-center cursor-pointer hover:bg-[#303030]  "
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
              class="w-6 h-6 rounded-full mr-3"
            />
            <div
              class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm text-black border-none"
              :class="item?.badgeClass"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div v-for="(el, key) of item?.children" class="menu bg-[#ffffff] dark:bg-[#222222] w-full !p-0">
              <RouterLink
                v-if="isNavLink(el)"
                @click="sidebarShow = false"
                class="hover:bg-[#f3f4f6] dark:hover:bg-[#303030]   rounded cursor-pointer px-3 py-2 flex items-center"
                :class="{
                  '!bg-[#ffea6e]': selected($route, el),
                }"
                :to="el.to"
              >
                <Icon
                  v-if="!el?.icon?.image"
                  icon="mdi:chevron-right"
                  class="mr-2 ml-3"
                  :class="{
                    'text-black':
                      $route.path === el?.to?.path &&
                      item?.title !== 'Favorite',
                  }"
                />
                <img
                  v-if="el?.icon?.image"
                  :src="el?.icon?.image"
                  class="w-6 h-6 rounded-full mr-3 ml-4 " :class="{
                  'border border-gray-300 bg-white': selected($route, el),
                }"
                />
                <div
                  class="text-base capitalize text-gray-500 dark:text-gray-300"
                  :class="{
                    '!text-black': selected($route, el),
                  }"
                >
                  {{ item?.title === 'Favorite' ? el?.title : $t(el?.title) }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          v-if="isNavLink(item)"
          :to="item?.to"
          @click="sidebarShow = false"
          class="cursor-pointer rounded-lg px-4 flex items-center py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
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
            class="w-6 h-6 rounded-full mr-3 border border-blue-100"
          />
          <div
            class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="badge badge-sm text-black border-none" 
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
          {{ $t('module.sponsors') }}
        </div>
        <a
          href="https://scrt.network"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
        >
          <img
            src="https://ping.pub/logos/secret.png"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Secret Network
          </div>
        </a>
        <a
          href="https://osmosis.zone"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
        >
          <img
            src="https://ping.pub/logos/osmosis.jpg"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Osmosis
          </div>
        </a>

          <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
            Tools
          </div>
          <RouterLink to="/wallet/suggest"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
          >
            <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
            <div
              class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
            >
              Wallet Helper
            </div>
          </RouterLink>

        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">{{ $t('module.links') }}</div>
        <a
          href="https://twitter.com/WhisperNode"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
        >
          <Icon icon="mdi:twitter" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Twitter
          </div>
        </a>
        <a
          href="https://discord.com/invite/KHCzGSb2"
          target="_blank"
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
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
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-[#f3f4f6] dark:hover:bg-[#303030]  "
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
    <div class="xl:!ml-72 px-3 pt-4">
      <!-- header -->
      <div
        class="flex items-center py-3 bg-[#ffffff] dark:bg-[#222222] mb-4 rounded px-4 sticky top-0 z-10"
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
