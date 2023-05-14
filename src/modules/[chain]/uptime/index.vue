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
const baseStore = useBaseStore();
const chainStore = useBlockchain();
const latest = ref({} as Block);
const commits = ref([] as Commit[]);
const keyword = ref('');
const live = ref(true);

// storage local favorite validator ids
const local = ref(
  JSON.parse(localStorage.getItem('uptime-validators') || '{}') as Record<
    string,
    string[]
  >
);
const selected = ref(local.value[chainStore.chainName] as string[]); // favorite validators on selected blockchain

const signingInfo = ref({} as Record<string, SigningInfo>);

// filter validators by keywords
const validators = computed(() => {
  if (keyword)
    return stakingStore.validators.filter(
      (x) => x.description.moniker.indexOf(keyword.value) > -1
    );
  return stakingStore.validators;
});

onMounted(() => {
  live.value = true;
  baseStore.fetchLatest().then(b => {
    latest.value = b;
    commits.value.unshift(b.block.last_commit);
    const height = Number(b.block.header?.height || 0);
    if (height > 0) {
      // constructs sequence for loading blocks
      let promise = Promise.resolve();
      for (let i = height - 1; i > height - 50; i -= 1) {
        if (i > height - 48) {
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
  return all.length > 50 ? all.slice(all.length - 50): all
})


onUnmounted(() => {
  live.value = false;
});


watchEffect(() => {
  local.value[chainStore.chainName] = selected.value;
  localStorage.setItem('uptime-validators', JSON.stringify(local.value));
});
</script>

<template>
  <div class="bg-base-100 px-5 pt-5">
    <div class="flex items-center gap-x-4">
      <input
        type="text"
        v-model="keyword"
        placeholder="Keywords to filter validators"
        class="input input-sm w-full flex-1"
      />
      <button class="btn btn-primary btn-sm">
        <Icon icon="mdi-star" class="mr-2 text-lg" /> <span class="">Favorite</span>
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      <div v-for="(v, i) in validators">
        <div class="flex items-center justify-between">
          <VCheckbox
            v-model="selected"
            color="warning"
            :value="v.operator_address"
          >
            <template v-slot:label>
              <span class="text-truncate"
                >{{ i + 1 }}. {{ v.description.moniker }}</span
              >
            </template>
          </VCheckbox>
          <div
            v-if="
              Number(
                signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
                  ?.missed_blocks_counter || 0
              ) > 0
            "
            class="badge badge-error badge-sm text-white"
          >
            {{
              signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
                ?.missed_blocks_counter
            }}
          </div>
          <div v-else class="mt-1 badge badge-sm text-white bg-yes border-0">
            {{
              signingInfo[consensusPubkeyToHexAddress(v.consensus_pubkey)]
                ?.missed_blocks_counter
            }}
          </div>
        </div>
        <UptimeBar
          :blocks="commits2"
          :validator="
            toBase64(fromHex(consensusPubkeyToHexAddress(v.consensus_pubkey)))
          "
        />
      </div>
    </div>

    <div class="h-6"></div>
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
