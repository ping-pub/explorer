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
import { useRouter } from 'vue-router';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';
import type {
  NavGroup,
  NavLink,
  NavSectionTitle,
  VerticalNavItems,
} from '../types';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();
blockchain.randomSetupEndpoint();

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
const vueRouters = useRouter();

const sidebarShow = ref(false);
const sidebarOpen = ref(true);
let searchQuery = ref('');
let errorMessage = ref('');

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
  const b =
    route.path === nav.to?.path ||
    (route.path.startsWith(nav.to?.path) &&
      nav.title.indexOf('dashboard') === -1);

  return b;
}
function confirm() {
  errorMessage.value = '';
  const key = searchQuery.value;
  if (!key) {
    errorMessage.value = 'Please enter a value!';
    return;
  }
  const height = /^\d+$/;
  const txhash = /^[A-Z\d]{64}$/;
  const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;

  const current = blockchain?.current?.chainName || '';
  const routeParams = vueRouters?.currentRoute?.value;

  if (!Object.values(routeParams?.params).includes(key)) {
    if (height.test(key)) {
      vueRouters.push({ path: `/${current}/block/${key}` });
    } else if (txhash.test(key)) {
      vueRouters.push({ path: `/${current}/tx/${key}` });

      //     this.$router.push({ name: 'transaction', params: { chain: c.chain_name, hash: key } })
    } else if (addr.test(key)) {
      vueRouters.push({ path: `/${current}/account/${key}` });
    } else {
      errorMessage.value = 'The input not recognized';
    }
  }
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-[#18181A]">
    <!-- sidebar -->
    <div
      class="w-64 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-base-100 border-r border-gray-100 dark:border-[#383B40]"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    >
      <div
        class="flex justify-between mt-1 pl-4 py-4 mb-1 border-b border-[#383B40]"
      >
        <RouterLink
          to="/"
          class="flex flex-1 items-center w-full justify-center"
        >
          <img class="w-10 h-10" src="../../assets/logo.svg" />
          <h1 class="ml-3 text-2xl font-semibold dark:text-white">OraiScan</h1>
        </RouterLink>
        <div
          class="pr-4 cursor-pointer xl:!hidden flex items-center"
          @click="sidebarShow = false"
        >
          <Icon icon="mdi-close" class="text-2xl" />
        </div>
      </div>
      <div v-for="(item, index) of blockchain.computedChainMenu" :key="index">
        <!-- class="px-2" -->
        <div
          v-if="isNavGroup(item)"
          :tabindex="index"
          class="collapse"
          :class="{
            'collapse-arrow': item?.children?.length > 0,
            'collapse-open': sidebarOpen, // index === 0 &&
            'collapse-close': index === 0 && !sidebarOpen,
          }"
        >
          <input
            type="checkbox"
            class="cursor-pointer !h-10 block"
            @click="changeOpen(index)"
          />
          <div
            class="collapse-title !py-0 px-3 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
          >
            <!-- <Icon
              v-if="item?.icon?.icon"
              :icon="item?.icon?.icon"
              class="text-xl mr-2"
              :class="{
                'text-yellow-500': item?.title === 'Favorite',
                'text-blue-500': item?.title !== 'Favorite',
              }"
            /> -->
            <img
              v-if="item?.icon?.image"
              :src="item?.icon?.image"
              class="w-6 h-6 rounded-full mr-3 bg-white border border-gray-300"
            />
            <div
              class="text-base text-gray-700 dark:text-gray-200 whitespace-nowrap text-[16px] uppercase font-semibold"
              :class="{
                capitalize: item?.icon?.icon,
              }"
            >
              {{ item?.title }}
            </div>
            <div
              v-if="item?.badgeContent"
              class="mr-6 badge badge-sm text-base font-semibold text-[14px] border-none bg-[#CBAEFF] rounded mx-[6px] h-[22px]"
            >
              <!-- :class="item?.badgeClass" -->
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div
              v-for="(el, key) of item?.children"
              class="menu bg-base-100 w-full !p-0"
            >
              <RouterLink
                v-if="isNavLink(el)"
                @click="sidebarShow = false"
                class="hover:bg-gray-100 dark:hover:bg-base h-[48px] rounded-lg cursor-pointer px-3 py-2 flex items-center border border-[#242627] borderImage"
                :class="{
                  '!bg-base borderImageActive': selected($route, el),
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
                  class="w-6 h-6 rounded-full mr-3 ml-4 bg-white border border-gray-300"
                  :class="{
                    '': selected($route, el),
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
          </div>
        </div>

        <RouterLink
          v-if="isNavLink(item)"
          :to="item?.to"
          @click="sidebarShow = false"
          class="cursor-pointer px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-base border-t border-b border-base-300 h-[60px]"
        >
          <!-- <Icon
            v-if="item?.icon?.icon"
            :icon="item?.icon?.icon"
            class="text-xl mr-2"
            :class="{
              'text-yellow-500': item?.title === 'Favorite',
              'text-blue-500': item?.title !== 'Favorite',
            }"
          /> -->
          <img
            v-if="item?.icon?.image"
            :src="item?.icon?.image"
            class="w-6 h-6 rounded-full mr-3 border border-blue-100 bg-white"
          />
          <div
            class="text-base capitalize text-gray-700 dark:text-gray-200 whitespace-nowrap"
          >
            {{ item?.title }}
          </div>
          <div
            v-if="item?.badgeContent"
            class="mr-6 badge badge-sm text-base font-semibold text-[14px] border-none bg-[#CBAEFF] rounded mx-[6px] h-[22px]"
          >
            <!-- :class="item?.badgeClass" -->
            {{ item?.badgeContent }}
          </div>
        </RouterLink>

        <div
          v-if="isNavTitle(item)"
          class="px-4 text-sm text-gray-400 pb-2 uppercase border-b border-base-300"
        ></div>
      </div>
      <div class="px-2 mt-6">
        <RouterLink
          to="/wallet/suggest"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-base border border-[#242627] borderImage h-[48px]"
          :class="{
            '!bg-base borderImageActive': selected($route, {
              to: { path: '/wallet/suggest', title: 'Wallet Helper' },
            } as NavLink),
          }"
        >
          <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Wallet Helper
          </div>
        </RouterLink>

        <!-- <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
          {{ $t('module.links') }}
        </div> -->

        <div class="flex justify-around items-center my-6">
          <a
            href="https://t.me/oraichain"
            target="_blank"
            rel="noopener noreferrer"
            class="filter hover:brightness-150"
          >
            <img src="../../assets//images/svg/telegram.svg" alt="telegram" />
          </a>
          <a
            href="https://twitter.com/oraichain"
            target="_blank"
            rel="noopener noreferrer"
            class="filter hover:brightness-150"
          >
            <img src="../../assets//images/svg/twiter.svg" alt="twiter" />
          </a>
          <a
            href="https://discord.gg/oraichain"
            target="_blank"
            rel="noopener noreferrer"
            class="filter hover:brightness-150"
          >
            <img src="../../assets//images/svg/discord.svg" alt="discord" />
          </a>
        </div>
        <!-- <a
          href="https://twitter.com/oraichain"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:twitter" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Twitter
          </div>
        </a>
        <a
          href="https://discord.gg/oraichain"
          target="_blank"
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
          class="py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <Icon icon="mdi:frequently-asked-questions" class="text-xl mr-2" />
          <div
            class="text-base capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            FAQ
          </div>
        </a> -->
      </div>
    </div>
    <div class="xl:!ml-64">
      <!-- header -->
      <div
        class="flex items-center py-4 bg-base-100 mb-4 px-4 sticky top-0 z-10 border-b border-base-300"
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
        <div class="lg:block hidden w-full max-w-[334px] mx-2">
          <input
            class="input flex-1 w-full !input-bordered bg-base text-[14px] font-normal h-[44px] focus:outline-none"
            v-model="searchQuery"
            placeholder="Search by Height, Address and TxHash"
            v-on:keyup.enter="confirm"
          />
          <!-- <div
              class="mt-2 text-right text-sm text-error"
              v-show="errorMessage"
            >
              {{ errorMessage }}
            </div> -->
        </div>
        <!-- <NavBarI18n class="hidden md:!inline-block" /> -->
        <NavbarThemeSwitcher class="!inline-block" />
        <NavbarSearch class="!inline-block" />
        <NavBarWallet />
      </div>

      <!-- 👉 Pages -->
      <div style="min-height: calc(100vh - 180px)" class="px-0">
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
