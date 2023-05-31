<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

// Components
import newFooter from '@/layouts/components/NavFooter.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import ChainProfile from '@/layouts/components/ChainProfile.vue';

import { useDashboard } from '@/stores/useDashboard';
import { useBlockchain } from '@/stores';

import NavBarI18n from './NavBarI18n.vue';
import NavBarWallet from './NavBarWallet.vue';

const dashboard = useDashboard();
dashboard.initial();
const blockchain = useBlockchain();

const current = ref('');
blockchain.$subscribe((m, s) => {
  if (current.value != s.chainName) {
    current.value = s.chainName;
    blockchain.initial();
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
</script>

<template>
  <div class="bg-gray-100 dark:bg-[#171d30]">
    <!-- sidebar -->
    <div
      class="w-64 fixed z-50 left-0 top-0 bottom-0 overflow-auto bg-base-100 border-r border-gray-100 dark:border-gray-700"
      :class="{ block: sidebarShow, 'hidden xl:!block': !sidebarShow }"
    >
      <div class="flex items-center pl-4 py-4 mb-1">
        <img class="w-10 h-10" src="../../assets/logo.svg" />
        <h1 class="flex-1 ml-3 text-2xl font-semibold dark:text-white">
          Ping.pub
        </h1>
        <div
          class="pr-4 cursor-pointer xl:!hidden"
          @click="sidebarShow = false"
        >
          <Icon icon="mdi-close" class="text-3xl" />
        </div>
      </div>
      <div
        v-for="(item, index) of blockchain.computedChainMenu"
        :key="index"
        class="px-2"
      >
        <div
          v-if="item?.title && item?.children?.length"
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
            class="collapse-title !py-0 px-4 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
              class="mr-6 badge badge-sm text-white"
              :class="item?.badgeClass"
            >
              {{ item?.badgeContent }}
            </div>
          </div>
          <div class="collapse-content">
            <div class="menu bg-base-100 w-full">
              <RouterLink
                v-for="(el, key) of item?.children"
                @click="sidebarShow = false"
                :key="key"
                class="hover:bg-gray-100 dark:hover:bg-[#373f59] rounded cursor-pointer px-3 py-2 flex items-center"
                :to="el?.to"
                :class="{
                  '!bg-primary':
                    $route.path === el?.to?.path && item?.title !== 'Favorite',
                }"
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
                  class="w-6 h-6 rounded-full mr-3 ml-4"
                />
                <div
                  class="text-base capitalize text-gray-500 dark:text-gray-300"
                  :class="{
                    'text-white':
                      $route.path === el?.to?.path &&
                      item?.title !== 'Favorite',
                  }"
                >
                  {{ item?.title === 'Favorite' ? el?.title : $t(el?.title) }}
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink
          :to="item?.to"
          v-if="item?.title && !item?.children?.length && item?.to"
          @click="sidebarShow = false"
          class="cursor-pointer rounded-lg px-4 flex items-center py-2 hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
            class="badge badge-sm text-white"
            :class="item?.badgeClass"
          >
            {{ item?.badgeContent }}
          </div>
        </RouterLink>
        <div
          v-if="item?.heading"
          class="px-4 text-sm text-gray-400 pb-2 uppercase"
        >
          {{ item?.heading }}
        </div>
      </div>
      <div class="px-2">
        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">
          Sponsors
        </div>
        <a
          href="https://osmosis.zone"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
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
        <a
          href="https://becole.com"
          target="_blank"
          class="py-2 px-4 flex items-center cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-[#373f59]"
        >
          <img
            src="https://becole.com/static/logo/logo_becole.png"
            class="w-6 h-6 rounded-full mr-3"
          />
          <div
            class="text-sm capitalize flex-1 text-gray-600 dark:text-gray-200"
          >
            Becole
          </div>
        </a>

        <div class="px-4 text-sm pt-2 text-gray-400 pb-2 uppercase">Links</div>
        <a
          href="https://twitter.com/ping_pub"
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
          v-if="showDiscord"
          href="https://discord.com/invite/CmjYVSr6GW"
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
        </a>
      </div>
    </div>
    <div class="xl:!ml-64 px-5 pt-4">
      <!-- header -->
      <div
        class="flex items-center py-3 bg-base-100 mb-4 rounded px-4 sticky top-0 z-10 shadow"
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
