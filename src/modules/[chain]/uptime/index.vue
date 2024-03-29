<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { fromHex, toBase64 } from '@cosmjs/encoding';
import {
  useStakingStore,
  useBaseStore,
  useBlockchain,
  useFormatter,
} from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import type { SlashingParam, SigningInfo, Block } from '@/types';
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const format = useFormatter();
const baseStore = useBaseStore();
const chainStore = useBlockchain();
const latest = ref(0);
const keyword = ref('');
const live = ref(true);
const slashingParam = ref({} as SlashingParam);
const signingInfo = ref({} as Record<string, SigningInfo>);

interface BlockColor {
  height: string;
  color: string;
}
interface ValidatorUnit {
  moniker: string;
  blocks: BlockColor[];
  hex: string;
  base64: string;
  missed_blocks_counter: number | string;
  uptime: number;
  signing: SigningInfo;
}

function padding(blocks: BlockColor[] = []) {
  const raw = Array(50).fill({ height: "0", color: 'bg-secondary' } as BlockColor).concat(blocks)
  return raw.slice(raw.length - 50);
}

const validatorSet = computed(() => {
  return stakingStore.validators.map((v) => {
    const hex = consensusPubkeyToHexAddress(v.consensus_pubkey)
    return {
      moniker: v.description.moniker,
      hex,
      base64: toBase64(fromHex(hex))
    };
  });
});

const blockColors = ref({} as Record<string, BlockColor[]>);

const grid = computed(() => {

  const validators = keyword.value.length === 0 ? validatorSet.value :
    validatorSet.value.filter((v) => v.moniker.toLowerCase().includes(keyword.value.toLowerCase()));

  const window = Number(slashingParam.value.signed_blocks_window || 0);
  return validators.map((v) => {
    const signing = signingInfo.value[v.hex];
    const uptime = signing && window > 0
      ? (window - Number(signing.missed_blocks_counter)) / window
      : undefined
    return {
      moniker: v.moniker,
      hex: v.hex,
      base64: v.base64,
      blocks: padding(blockColors.value[v.base64] || []),
      uptime,
      missed_blocks_counter: signing?.missed_blocks_counter,
      signing
    } as ValidatorUnit;
  })
});

const preload = ref(false);
baseStore.$subscribe((_, state) => {
  const newHeight = Number(state.latest?.block?.header?.height || 0)
  if (newHeight > latest.value) {
    latest.value = newHeight;
    // initialize if it's the first time
    if(!preload.value) {
      preFill();
      preload.value = true;
    }
    
    if (Number(state.latest.block.header.height) % 7 === 0) updateTotalSigningInfo();
    fillblock(state.latest);
  }
});

onMounted(() => {
  live.value = true;


  // fill the recent blocks
  baseStore.recents?.forEach((b) => {
    fillblock(b, 'start');
  });

  updateTotalSigningInfo();

  chainStore.rpc.getSlashingParams().then((x) => {
    slashingParam.value = x.params;
  });
});

function preFill() {

  if(latest.value > 50 && baseStore.recents.length >= 49 ) return
  // preload 50 blocks if recent blocks are not enough
  let promise = Promise.resolve();
  for (let i = latest.value - baseStore.recents.length; i > latest.value - 50 && i > 1; i -= 1) {
    promise = promise.then(() =>
      new Promise((resolve) => {
        if (live.value) {
          // continue only if the page is living
          if (i > latest.value - 50)
            baseStore.fetchBlock(i).then((x) => {
              fillblock(x, 'start');
              resolve();
            });
        }
      })
    );
  }
}
function fillblock(b: Block, direction: string = 'end') {
  validatorSet.value.forEach((v) => {
    const sig = b.block.last_commit?.signatures.find((s) => s.validator_address === v.base64)
    const block = blockColors.value[v.base64] || [];
    let color = {
      height: b.block.header.height,
      color: 'bg-red-500'
    }
    if (sig) {
      color = {
        height: b.block.header.height,
        color: sig.block_id_flag === 'BLOCK_ID_FLAG_COMMIT' ? 'bg-green-500' : 'bg-yellow-500'
      }
    }
    if (direction === 'end') {
      block.push(color);
    } else {
      block.unshift(color);
    }
    if (block.length > 50) block.shift();
    blockColors.value[v.base64] = block;
  });
}

function updateTotalSigningInfo() {
  chainStore.rpc.getSlashingSigningInfos().then((x) => {
    x.info?.forEach((i) => {
      signingInfo.value[valconsToBase64(i.address)] = i;
    });
  });
}

onUnmounted(() => {
  live.value = false;
});

//const tab = ref(window.location.hash.search("block")>-1?"2":"3")
const tab = ref('2');
function changeTab(v: string) {
  tab.value = v;
}

function fetchAllKeyRotation() {
  stakingStore.fetchAllKeyRotation(baseStore.latest?.block?.header?.chain_id)
}
</script>

<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a class="tab text-gray-400 capitalize" :class="{ 'tab-active': tab === '3' }" @click="changeTab('3')">{{
        $t('uptime.overall') }}</a>
      <a class="tab text-gray-400 capitalize" :class="{ 'tab-active': tab === '2' }" @click="changeTab('2')">{{
        $t('module.blocks') }}</a>
      <RouterLink :to="`/${chain}/uptime/customize`">
        <a class="tab text-gray-400 capitalize">{{ $t('uptime.customize') }}</a>
      </RouterLink>
    </div>
    <div class="bg-base-100 px-5 pt-5">
      <div class="flex items-center gap-x-4">
        <input type="text" v-model="keyword" placeholder="Keywords to filter validators"
          class="input input-sm w-full flex-1 border border-gray-200 dark:border-gray-600" />
        <button v-if="chainStore.isConsumerChain" class="btn btn-sm btn-primary" @click="fetchAllKeyRotation">Load
          Rotated Keys</button>
      </div>

      <div v-if="chainStore.isConsumerChain && Object.keys(stakingStore.keyRotation).length === 0"
        class="alert alert-warning my-4">
        Note: Please load rotated keys to see the correct uptime
      </div>
      <!-- grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 mt-4 -->
      <div :class="tab === '2' ? '' : 'hidden'">
        <div class="flex flex-row flex-wrap gap-x-4 mt-4 justify-center">
          <div v-for="(unit, i) in grid" :key="i">
            <div class="flex justify-between py-0 w-[248px]">
              <label class="truncate text-sm">
                <span class="ml-1 text-black dark:text-white">{{ i + 1 }}.{{ unit.moniker }}</span>
              </label>
              <div v-if="Number(unit?.missed_blocks_counter || 0) > 10"
                class="badge badge-sm bg-transparent border-0 text-red-500 font-bold">
                {{ unit?.missed_blocks_counter }}
              </div>
              <div v-else class="badge badge-sm bg-transparent text-green-600 border-0 font-bold">
                {{ unit?.missed_blocks_counter }}
              </div>
            </div>
            <UptimeBar :blocks="unit.blocks" />
          </div>
        </div>
        <div class="mt-5 text-xs flex justify-center gap-2">
          <span class=" font-bold">{{ $t('uptime.legend') }}: </span>
          <span class="bg-green-500">&nbsp;</span> {{ $t('uptime.committed') }}
          <span class="bg-yellow-500">&nbsp;</span> {{ $t('uptime.precommitted') }}
          <span class="bg-red-500">&nbsp;</span> {{ $t('uptime.missed') }}
        </div>
      </div>

      <div :class="tab === '3' ? '' : 'hidden'" class="overflow-x-auto">
        <table class="table table-compact w-full mt-5">
          <thead class="capitalize bg-base-200">
            <tr>
              <td>{{ $t('account.validator') }}</td>
              <td class="text-right">{{ $t('module.uptime') }}</td>
              <td>{{ $t('uptime.last_jailed_time') }}</td>
              <td class="text-right">{{ $t('uptime.signed_precommits') }}</td>
              <td class="text-right">{{ $t('uptime.start_height') }}</td>
              <td>{{ $t('uptime.tombstoned') }}</td>
            </tr>
          </thead>
          <tr v-for="(v, i) in grid" class="hover">
            <td>
              <div class="truncate max-w-sm">
                {{ i + 1 }}. {{ v.moniker }}
              </div>
            </td>
            <td class="text-right">
              <span :class="v.uptime && v.uptime > 0.95 ? 'text-green-500' : 'text-red-500'
        ">
                <div class="tooltip" :data-tip="`${v.missed_blocks_counter} missing blocks`">
                  {{ format.percent(v.uptime) }}
                </div>
              </span>
            </td>
            <td>
              <span v-if="v.signing && !v.signing.jailed_until.startsWith('1970')">
                <div class="tooltip" :data-tip="format.toDay(v.signing.jailed_until, 'long')">
                  <span>{{ format.toDay(v.signing.jailed_until, 'from') }}</span>
                </div>
              </span>
            </td>
            <td class="text-xs text-right">
              <span v-if="v.signing && v.signing.jailed_until.startsWith('1970')" class="text-right">{{
        format.percent(
          Number(v.signing.index_offset) /
          (latest - Number(v.signing.start_height))
        )
      }}</span>
              {{ v.signing?.index_offset }}
            </td>
            <td class="text-right">{{ v.signing?.start_height }}</td>
            <td class="capitalize">{{ v.signing?.tombstoned }}</td>
          </tr>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">
                {{ $t('uptime.minimum_uptime') }}:
                <span class="lowercase tooltip" :data-tip="`Window size: ${slashingParam.signed_blocks_window}`"><span
                    class="ml-2 btn btn-error btn-xs">{{
        format.percent(slashingParam.min_signed_per_window)
                    }}</span>
                </span>
              </td>
              <td colspan="8"></td>
            </tr>
          </tfoot>
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
