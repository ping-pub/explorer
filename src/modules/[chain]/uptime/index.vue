<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import { fromHex, toBase64 } from '@cosmjs/encoding';
import { Icon } from '@iconify/vue';
import {
  useFormatter,
  useStakingStore,
  useBaseStore,
  useBlockchain,
} from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import type { Block, Commit } from '@/types';
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';
import type { SigningInfo } from '@/types/slashing';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const format = useFormatter();
const baseStore = useBaseStore();
const chainStore = useBlockchain();
const latest = ref(0);
const commits = ref([] as Commit[]);
const keyword = ref('');
const live = ref(true);

const signingInfo = ref({} as Record<string, SigningInfo>);

// filter validators by keywords
const validators = computed(() => {
  if (keyword)
    return stakingStore.validators.filter(
      (x) => x.description.moniker.indexOf(keyword.value) > -1
    );
  return stakingStore.validators;
});

const list = computed(() => {
  return validators.value.map(v => ({
    v, 
    signing: signingInfo.value[consensusPubkeyToHexAddress(v.consensus_pubkey)],
    hex: toBase64(fromHex(consensusPubkeyToHexAddress(v.consensus_pubkey)))
  }))
})

onMounted(() => {
  live.value = true;
  baseStore.fetchLatest().then(b => {
    latest.value = Number(b.block.header.height);
    commits.value.unshift(b.block.last_commit);
    const height = Number(b.block.header?.height || 0);
    if (height > 50) {
      // constructs sequence for loading blocks
      let promise = Promise.resolve();
      for (let i = height - 1; i > height - 50; i -= 1) {
        promise = promise.then(
          () =>
            new Promise((resolve, reject) => {
              if (live.value && commits2.value.length < 50) {
                // continue only if the page is living
                baseStore.fetchBlock(i).then((x) => {
                  commits.value.unshift(x.block.last_commit);
                  resolve();
                });
              }
            })
        );
      }
    }
  });

  chainStore.rpc.getSlashingSigningInfos().then((x) => {
    x.info?.forEach((i) => {
      signingInfo.value[valconsToBase64(i.address)] = i;
    });
  });
});

const commits2 = computed(() => {
  const la = baseStore.recents.map(b => b.block.last_commit)
  const all = [...commits.value, ...la]
  return all.length > 50 ? all.slice(all.length - 50) : all
})

onUnmounted(() => {
  live.value = false;
});
const tab = ref("3")
function changeTab(v: string) {
  tab.value = v
}

</script>

<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a
        class="tab text-gray-400 capitalize"
        :class="{ 'tab-active': tab === '3' }"
        @click="changeTab('3')"
        >Overall</a
      >
      <a
        class="tab text-gray-400 capitalize"
        :class="{ 'tab-active': tab === '2' }"
        @click="changeTab('2')"
        >Blocks</a
      >
      <RouterLink :to="`/${chain}/uptime/overview`">
      <a
        class="tab text-gray-400 capitalize"
        >Customize</a
      ></RouterLink>
    </div>
    <div class="bg-base-100 px-5 pt-5">
      <div class="flex items-center gap-x-4">
        <input type="text" v-model="keyword" placeholder="Keywords to filter validators"
          class="input input-sm w-full flex-1" />
        <RouterLink class="btn btn-primary btn-sm" :to="`/${chain}/uptime/overview`">
          <Icon icon="mdi-star" class="mr-2 text-lg" />
          <span class="">Favorite</span>
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-4 mt-4" :class="tab === '2'?'':'hidden'">
        <div v-for="({v, signing, hex}, i) in list" :key="i">
          <div class="flex items-center justify-between py-0">
            <label class="text-truncate text-sm">
              <span class="ml-1 text-black dark:text-white">{{ i + 1 }}.{{ v.description.moniker }}</span>
            </label>
            <div v-if="Number(signing?.missed_blocks_counter || 0) > 10" class="badge badge-error badge-sm text-white">
              {{ signing?.missed_blocks_counter }}
            </div>
            <div v-else class="mt-1 badge badge-sm text-white bg-yes border-0">
              {{ signing?.missed_blocks_counter }}
            </div>
          </div>
          <UptimeBar :blocks="commits2" :validator="hex" />
        </div>
      </div>

      <div :class="tab === '3'?'':'hidden'">
        <table class="table table-compact w-full mt-5">
          <thead class=" capitalize">
            <tr>
              <td>Validator</td>
              <td>Start Height</td>
              <td>Signed Precommits</td>
              <td>Missing blocks</td>
              <td>Last Jailed Time</td>
              <td>Tombstoned</td>
            </tr>
          </thead>
          <tr v-for="({v, signing}, i) in list">
            <td>{{ i+1 }}. {{ v.description.moniker }}</td>
            <td>{{ signing?.start_height }}</td>
            <td>
              {{ signing?.index_offset }}
              <span v-if="signing && signing.jailed_until.startsWith('1970')" class="badge badge-sm">{{ format.percent(Number(signing.index_offset)/(latest-Number(signing.start_height))) }}</span>
            </td>
            <td>
              <span v-if="signing" class="badge badge-sm text-white" :class="Number(signing?.missed_blocks_counter) < 10?'badge-success':'badge-error'">{{ signing?.missed_blocks_counter }}</span>
            </td>
            <td><span v-if="signing && !signing.jailed_until.startsWith('1970')">
              <div class="tooltip" :data-tip="format.toDay(signing?.jailed_until, 'long')">
                <span>{{ format.toDay(signing?.jailed_until, "from") }}</span>
              </div>
            </span></td>
            <td class=" capitalize">{{ signing?.tombstoned }}</td>
          </tr>
        </table>
      </div>

      <div class="h-6"></div>
    </div>
  </div>
</template>
<route>
  {
    meta: {
      i18n: 'uptime',
      order: 8
    }
  }
</route>

<style lang="scss">
.v-field--variant-outlined .v-field__outline__notch {
  border-width: 0 !important;
}
</style>
