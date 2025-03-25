<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';

// Components
import newFooter from '@/layouts/components/NavFooter.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import NavbarSearch from '@/layouts/components/NavbarSearch.vue';
import ChainProfile from '@/layouts/components/ChainProfile.vue';

import { useDashboard } from '@/stores/useDashboard';
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
const temp = ref('')
blockchain.$subscribe((m, s) => {
  if (current.value === s.chainName && temp.value != s.endpoint.address) {
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
const blocktime = computed(() => {
  return dayjs(baseStore.latest?.block?.header?.time)
});

const behind = computed(() => {
  const current = dayjs().subtract(10, 'minute')
  return blocktime.value.isBefore(current)
});

const alpha_beta = window.location.host.includes('beta') ? 'beta' : 'alpha'
const chain = window.location.host.includes('beta') ? '/pocket-beta' : '/poktroll'
dayjs()

// Add this for responsive behavior
const isMobile = ref(false);
const visibleNavItems = ref(6); // Number of items to show before using "More" dropdown

// Update this when window resizes
const updateWindowSize = () => {
  isMobile.value = window.innerWidth < 1024; // Adjust breakpoint as needed
  if (window.innerWidth < 1024) {
    visibleNavItems.value = 5;
  } else if (window.innerWidth < 1280) {
    visibleNavItems.value = 5;
  } else if (window.innerWidth < 1400) {
    visibleNavItems.value = 7;
  } else if (window.innerWidth < 1600) {
    visibleNavItems.value = 7;
  } else {
    visibleNavItems.value = 6;
  }
};

// Call once on component mount and add event listener
onMounted(() => {
  updateWindowSize();
  window.addEventListener('resize', updateWindowSize);
});

// Clean up event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize);
});

// Compute which items should go in the More dropdown
const mainNavItems = computed(() => {
  // @ts-ignore
  return blockchain.computedChainMenu[0]?.children.slice(0, visibleNavItems.value);
});

const moreNavItems = computed(() => {
  // @ts-ignore
  return blockchain.computedChainMenu[0]?.children.slice(visibleNavItems.value);
});

</script>

<template>
  <div>
    <header class="bg-base-200 shadow-md dark:bg-[#231f20;]">
      <div class="container mx-auto px-1 py-2 flex justify-center items-center">

        <nav class="flex">
          <RouterLink :to=chain class="flex items-center mr-5">
            <img class="w-10 h-10"
              src="https://assets-global.website-files.com/651fe0a9a906d151784935f8/65c62e2727ed4e265bc9911a_universal-logo.png" />
            <h1 class="flex-1 ml-3 text-lg font-semibold dark:text-white whitespace-nowrap mr-2 items-center">
              SHANNON
            </h1>
            <span class="pill mr-10">{{ alpha_beta }}</span>
          </RouterLink>
          
          <!-- Main nav items (limited based on screen size) -->
          <div v-for="(item, index) of mainNavItems" :key="index"
            class="flex justify-between items-center">
            <div v-if="isNavGroup(item)" :tabindex="index" class="collapse flex" :class="{
              'collapse-arrow': index > 0 && item?.children?.length > 0,
              'collapse-open': index === 0 && sidebarOpen,
              'collapse-close': index === 0 && !sidebarOpen,
            }">
              <input v-if="index > 0" type="checkbox" class="cursor-pointer !h-10 block" @click="changeOpen(index)" />

              <!-- <div class="collapse-content flex flex-row py-3">
                <div v-for="(el, key) of item?.children" class="menu w-full !p-0">
                  <RouterLink v-if="isNavLink(el)" @click="sidebarShow = false"
                    class="hover:bg-gray-100 dark:hover:bg-[#373f59] rounded cursor-pointer px-3 py-2 flex items-center"
                    :class="{
                      '!bg-primary': selected($route, el),
                    }" :to="el.to">
                    <img v-if="el?.icon?.image" :src="el?.icon?.image" class="w-6 h-6 rounded-full mr-3 ml-4 " :class="{
                      'border border-gray-300 bg-white': selected($route, el),
                    }" />
                    <div class="text-base capitalize text-gray-500 dark:text-gray-300" :class="{
                      '!text-white': selected($route, el),
                    }">
                      {{ item?.title === 'Favorite' ? el?.title : $t(el?.title) }}
                    </div>
                  </RouterLink>
                </div>
              </div> -->
            </div>

            <RouterLink v-if="isNavLink(item)" :to="item?.to" @click="sidebarShow = false"
              class="cursor-pointer rounded-lg px-2 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]">
              <div class="text-base capitalize flex-1 text-gray-700 dark:text-gray-200 whitespace-nowrap" style="font-size: 0.9rem;">
                {{ $t(item?.title) }}
              </div>
              <div v-if="item?.badgeContent" class="badge badge-sm text-white border-none" :class="item?.badgeClass">
                {{ item?.badgeContent }}
              </div>
            </RouterLink>
            
            <div v-if="isNavTitle(item)" class="px-1 text-sm text-gray-400 pb-2 uppercase">
              {{ item?.heading }}
            </div>
          </div>

          <!-- "More" dropdown for additional nav items -->
          <div v-if="moreNavItems.length > 0" class="dropdown dropdown-end flex align-center justify-center mr-5">
            <label tabindex="0" class="btn-ghost btn-sm m-1 cursor-pointer flex items-center flex-row px-2 mt-4 mr-5">
              <span class="mr-1 flex flex-1" style="font-size: 0.9rem;text-transform: unset !important;">Network</span>
              <Icon icon="mdi-chevron-down" class="ml-1 flex flex-1" />
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50" style="font-size: 0.9rem;">
              <li v-for="(item, index) in moreNavItems" :key="'more-'+index">
                <RouterLink v-if="isNavLink(item)" :to="item?.to" @click="sidebarShow = false"
                  class="hover:bg-gray-100 dark:hover:bg-[#373f59]">
                  <div class="text-base capitalize text-gray-700 dark:text-gray-200" style="font-size: 0.9rem;">
                    {{ $t(item?.title) }}
                  </div>
                  <div v-if="item?.badgeContent" class="badge badge-sm text-white border-none" :class="item?.badgeClass">
                    {{ item?.badgeContent }}
                  </div>
                </RouterLink>

                <!-- Special handling for NavGroups in dropdown -->
                <div v-if="isNavGroup(item)" class="dropdown dropdown-hover dropdown-right">
                  <label tabindex="0" class="hover:bg-gray-100 dark:hover:bg-[#373f59] w-full text-start">
                    <span style="font-size: 0.9rem;">{{ $t(item?.title) }}</span>
                  </label>
                  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                    <li v-for="(subItem, subIndex) in item.children" :key="'submenu-'+subIndex">
                      <RouterLink v-if="isNavLink(subItem)" :to="subItem?.to" @click="sidebarShow = false"
                        class="hover:bg-gray-100 dark:hover:bg-[#373f59]">
                        <span style="font-size: 0.9rem;">{{ $t(subItem?.title) }}</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <!-- Icons section -->
          <div class="py-2 flex justify-between items-center">
            <NavbarSearch class="!inline-block" />
            <!-- <NavBarI18n class="hidden md:!inline-block pt-1" /> -->
            <NavbarThemeSwitcher class="!inline-block pt-1" />
            <!-- <NavBarWallet /> -->
          </div>
        </nav>
      </div>
    </header>
    <div class="bg-base-200 dark:bg-[#231f20;] overflow-scroll no-scrollbar" style="height:calc(100vh - 5rem)">
      <div class="w-11/12 mx-auto">
        <!-- 👉 Pages -->
        <div class="overflow-scroll no-scrollbar" style="height:calc(100vh - 8rem)">
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
  </div>
</template>
<style>
.pill {
  display: inline-block;
  padding: 0.5em 1em;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffffff;
  /* background-color: secondary; */
  /* Blue color */
  border-radius: 20px;
  text-transform: uppercase;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.minus-ml-10 {
  margin-left: -2.5rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
.pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #007bff;
  /* Blue color */
  border-radius: 20px;
  text-transform: uppercase;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
