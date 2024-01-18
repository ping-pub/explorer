<script lang="ts" setup>
import { fromTimestamp } from 'cosmjs-types/helpers';
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { fromAscii, fromHex, toBase64 } from '@cosmjs/encoding';
import {
  useFormatter,
  useStakingStore,
  useBaseStore,
  useBlockchain,
} from '@/stores';
import UptimeBar from '@/components/UptimeBar.vue';
import {
  consensusPubkeyToHexAddress,
  pubKeyToValcons,
  valconsToBase64,
} from '@/libs';
import type { Commit } from '@cosmjs/tendermint-rpc';
import type {
  Params,
  ValidatorSigningInfo,
} from 'cosmjs-types/cosmos/slashing/v1beta1/slashing';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const format = useFormatter();
const baseStore = useBaseStore();
const chainStore = useBlockchain();
const latest = ref(0);
const commits = ref([] as Commit[]);
const keyword = ref('');
const live = ref(true);
const slashingParam = ref({} as Params);

const signingInfo = ref({} as Record<string, ValidatorSigningInfo>);

// filter validators by keywords
const validators = computed(() => {
  if (keyword)
    return stakingStore.validators.filter(
      (x) => x.description.moniker.indexOf(keyword.value) > -1
    );
  return stakingStore.validators;
});

const list = computed(() => {
  if (chainStore.isConsumerChain) {
    stakingStore.loadKeyRotationFromLocalstorage(
      baseStore.latest?.block?.header?.chainId
    );

    const window = Number(slashingParam.value.signedBlocksWindow || 0);
    const vset = validators.value.map((v) => {
      const hexAddress = stakingStore.findRotatedHexAddress(v.consensusPubkey!);
      const signing = signingInfo.value[hexAddress];
      return {
        v,
        signing,
        hex: toBase64(fromHex(hexAddress)),
        uptime:
          signing && window > 0
            ? (window - Number(signing.missedBlocksCounter)) / window
            : undefined,
      };
    });
    return vset;
  } else {
    const window = Number(slashingParam.value.signedBlocksWindow || 0);
    const vset = validators.value.map((v) => {
      const signing =
        signingInfo.value[consensusPubkeyToHexAddress(v.consensusPubkey)];
      return {
        v,
        signing,
        hex: toBase64(fromHex(consensusPubkeyToHexAddress(v.consensusPubkey))),
        uptime:
          signing && window > 0
            ? (window - Number(signing.missedBlocksCounter)) / window
            : undefined,
      };
    });
    return vset;
  }
});

onMounted(() => {
  live.value = true;
  baseStore.fetchLatest().then((l) => {
    let b = l;
    if (
      baseStore.recents?.findIndex(
        (x) => x.block.header.height === l.block.header.height
      ) > -1
    ) {
      b = baseStore.recents?.at(0) || l;
    }
    latest.value = Number(b.block.header.height);
    b.block.lastCommit && commits.value.unshift(b.block.lastCommit);
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
                  x.block.lastCommit &&
                    commits.value.unshift(x.block.lastCommit);
                  resolve();
                });
              }
            })
        );
      }
    }
  });

  updateTotalSigningInfo();

  chainStore.rpc.getSlashingParams().then((x) => {
    slashingParam.value = x.params;
  });
});

function updateTotalSigningInfo() {
  chainStore.rpc.getSlashingSigningInfos().then((x) => {
    x.info?.forEach((i) => {
      signingInfo.value[valconsToBase64(i.address)] = i;
    });
  });
}

const commits2 = computed(() => {
  const la = baseStore.recents.map((b) => b.block.lastCommit);
  // trigger update total signing info
  if (la.length > 1 && Number(la.at(la.length - 1)?.height || 0) % 10 === 7) {
    updateTotalSigningInfo();
  }
  const all = [...commits.value, ...la];
  return all.length > 50 ? all.slice(all.length - 50) : all;
});

onUnmounted(() => {
  live.value = false;
});

//const tab = ref(window.location.hash.search("block")>-1?"2":"3")
const tab = ref('2');
function changeTab(v: string) {
  tab.value = v;
}

function fetchAllKeyRotation() {
  stakingStore.fetchAllKeyRotation(baseStore.latest?.block?.header?.chainId);
}
</script>

<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a
        class="tab text-gray-400 capitalize"
        :class="{ 'tab-active': tab === '3' }"
        @click="changeTab('3')"
        >{{ $t('uptime.overall') }}</a
      >
      <a
        class="tab text-gray-400 capitalize"
        :class="{ 'tab-active': tab === '2' }"
        @click="changeTab('2')"
        >{{ $t('module.blocks') }}</a
      >
      <RouterLink :to="`/${chain}/uptime/customize`">
        <a class="tab text-gray-400 capitalize">{{ $t('uptime.customize') }}</a>
      </RouterLink>
    </div>
    <div class="bg-base-100 px-5 pt-5">
      <div class="flex items-center gap-x-4">
        <input
          type="text"
          v-model="keyword"
          placeholder="Keywords to filter validators"
          class="input input-sm w-full flex-1 border border-gray-200 dark:border-gray-600"
        />
        <button
          v-if="chainStore.isConsumerChain"
          class="btn btn-sm btn-primary"
          @click="fetchAllKeyRotation"
        >
          Load Rotated Keys
        </button>
      </div>

      <div
        v-if="
          chainStore.isConsumerChain &&
          Object.keys(stakingStore.keyRotation).length === 0
        "
        class="alert alert-warning my-4"
      >
        Note: Please load rotated keys to see the correct uptime
      </div>
      <!-- grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 mt-4 -->
      <div
        class="flex flex-row flex-wrap gap-x-4 mt-4 justify-center"
        :class="tab === '2' ? '' : 'hidden'"
      >
        <div v-for="({ v, signing, hex }, i) in list" :key="i">
          <div class="flex items-center justify-between py-0 w-[298px]">
            <label class="truncate text-sm">
              <span class="ml-1 text-black dark:text-white"
                >{{ i + 1 }}.{{ v.description.moniker }}</span
              >
            </label>
            <div
              v-if="Number(signing?.missedBlocksCounter || 0) > 10"
              class="badge badge-sm bg-transparent border-0 text-red-500 font-bold"
            >
              {{ signing?.missedBlocksCounter }}
            </div>
            <div
              v-else
              class="badge badge-sm bg-transparent text-green-600 border-0 font-bold"
            >
              {{ signing?.missedBlocksCounter }}
            </div>
          </div>
          <UptimeBar :blocks="commits2" :validator="hex" />
        </div>
      </div>

      <div :class="tab === '3' ? '' : 'hidden'" class="overflow-x-auto">
        <table class="table table-compact w-full mt-5">
          <thead class="capitalize">
            <tr>
              <td>{{ $t('account.validator') }}</td>
              <td class="text-right">{{ $t('module.uptime') }}</td>
              <td>{{ $t('uptime.last_jailed_time') }}</td>
              <td class="text-right">{{ $t('uptime.signed_precommits') }}</td>
              <td class="text-right">{{ $t('uptime.start_height') }}</td>
              <td>{{ $t('uptime.tombstoned') }}</td>
            </tr>
          </thead>
          <tr v-for="({ v, signing, uptime }, i) in list" class="hover">
            <td>
              <div class="truncate max-w-sm">
                {{ i + 1 }}. {{ v.description.moniker }}
              </div>
            </td>
            <td class="text-right">
              <span
                v-if="signing"
                class=""
                :class="
                  uptime && uptime > 0.95 ? 'text-green-500' : 'text-red-500'
                "
              >
                <div
                  class="tooltip"
                  :data-tip="`${signing.missedBlocksCounter} missing blocks`"
                >
                  {{ format.percent(uptime) }}
                </div>
              </span>
            </td>
            <td>
              <span
                v-if="
                  signing?.jailedUntil &&
                  !fromTimestamp(signing.jailedUntil)
                    .toString()
                    .startsWith('1970')
                "
              >
                <div
                  class="tooltip"
                  :data-tip="format.toDay(signing?.jailedUntil, 'long')"
                >
                  <span>{{ format.toDay(signing?.jailedUntil, 'from') }}</span>
                </div>
              </span>
            </td>
            <td class="text-xs text-right">
              <span
                v-if="
                  signing?.jailedUntil &&
                  fromTimestamp(signing.jailedUntil)
                    .toString()
                    .startsWith('1970')
                "
                class="text-right"
                >{{
                  format.percent(
                    Number(signing.indexOffset) /
                      (latest - Number(signing.startHeight))
                  )
                }}</span
              >
              {{ signing?.indexOffset }}
            </td>
            <td class="text-right">{{ signing?.startHeight }}</td>
            <td class="capitalize">{{ signing?.tombstoned }}</td>
          </tr>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">
                {{ $t('uptime.minimum_uptime') }}:
                <span
                  class="lowercase tooltip"
                  :data-tip="`Window size: ${slashingParam.signedBlocksWindow}`"
                  ><span class="ml-2 btn btn-error btn-xs">{{
                    slashingParam.minSignedPerWindow &&
                    format.percent(fromAscii(slashingParam.minSignedPerWindow))
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
