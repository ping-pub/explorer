<script lang="ts" setup>
import { consensusPubkeyToHexAddress, valconsToBase64 } from '@/libs';
import { CosmosRestClient } from '@/libs/client';
import {
  useBlockchain,
  useDashboard,
  useFormatter,
  useStakingStore,
} from '@/stores';
import { Icon } from '@iconify/vue';
import type { ValidatorSigningInfo } from 'cosmjs-types/cosmos/slashing/v1beta1/slashing';
import { computed, ref } from 'vue';

const props = defineProps(['chain']);

const stakingStore = useStakingStore();
const format = useFormatter();
const chainStore = useBlockchain();
const dashboard = useDashboard();
// storage local favorite validator ids

type ValidatorValue = { name: string; address: string };

const local = ref(
  JSON.parse(localStorage.getItem('uptime-validators') || '{}') as Record<
    string,
    ValidatorValue[]
  >
);
const signingInfo = ref({} as Record<string, ValidatorSigningInfo[]>);
const selected = ref([] as string[]);
const selectChain = ref(chainStore.chainName);
const validators = ref(stakingStore.validators);
const keyword = ref('');

async function loadSigningInfo(chainName: string) {
  const chain = dashboard.chains[chainName];
  if (chain && chain.endpoints.rpc) {
    const client = CosmosRestClient.newDefault(chain.endpoints.rpc[0].address);
    const resp = await client.getSlashingSigningInfos();
    signingInfo.value[chainName] = resp.info;
  }
}

if (local.value)
  Object.keys(local.value).map((chainName) => {
    loadSigningInfo(chainName);
  });

function initial() {
  const vals = local.value[selectChain.value];
  if (vals) {
    selected.value = vals.map((x) => x.address);
  }
}

const filterValidators = computed(() => {
  if (keyword.value) {
    return validators.value.filter(
      (x) => x.description.moniker.indexOf(keyword.value) > -1
    );
  }
  return validators.value;
});

const list = computed(() => {
  const list = [] as {
    chainName: string;
    v: ValidatorValue;
    sigingInfo?: ValidatorSigningInfo;
  }[];
  if (local.value)
    Object.keys(local.value).map((chainName) => {
      const vals = local.value[chainName];
      const info = signingInfo.value[chainName];
      if (vals && info) {
        vals.forEach((v) => {
          const sigingInfo = info.find(
            (x) => valconsToBase64(x.address) === v.address
          );
          list.push({
            chainName,
            v,
            sigingInfo,
          });
        });
      }
    });
  return list;
});

function add() {
  if (!signingInfo.value[selectChain.value]) {
    loadSigningInfo(selectChain.value);
  }
  const newList = [] as { name: string; address: string }[];
  selected.value.forEach((x) => {
    const validator = validators.value.find(
      (v) => consensusPubkeyToHexAddress(v.consensusPubkey) === x
    );
    if (validator)
      newList.push({
        name: validator.description.moniker || x,
        address: x,
      });
  });
  if (!local.value) local.value = {};
  local.value[selectChain.value] = newList;

  localStorage.setItem('uptime-validators', JSON.stringify(local.value));
}

async function changeChain() {
  validators.value = [];
  const endpoint =
    dashboard.chains[selectChain.value].endpoints.rpc?.at(0)?.address;
  if (!endpoint) return;

  const client = CosmosRestClient.newDefault(endpoint);
  const x = await client.getStakingValidators('BOND_STATUS_BONDED');
  if (!x) return;
  validators.value = x.validators;

  const vals = local.value[selectChain.value];
  if (vals) {
    selected.value = vals.map((x) => x.address);
  } else {
    selected.value = [];
  }
}

function color(v: string) {
  if (v) {
    const n = Number(v);
    if (n < 10) return ' badge-success';
    if (n > 1000) return ' badge-error';
    if (n > 0) return ' badge-warning';
  }
}
</script>

<template>
  <div class="px-6">
    <div class="overflow-x-auto w-full section">
      <div
        class="lg:!flex lg:!items-center lg:!justify-between bg-base-100 mb-6"
      >
        <div class="min-w-0 flex-1">
          <h2
            class="text-md font-bold leading-7 sm:!truncate sm:!text-xl sm:!tracking-tight text-white"
          >
            {{ $t('uptime.my_validators') }}
          </h2>
          <div
            class="mt-1 flex flex-col sm:!mt-0 sm:!flex-row sm:!flex-wrap sm:!space-x-6"
          >
            <div class="mt-2 flex items-center text-sm text-[#B4B7BB]">
              {{ $t('uptime.add_validators_monitor') }}
            </div>
          </div>
        </div>
        <div class="mt-5 flex lg:!ml-4 lg:!mt-0"></div>
      </div>
      <table class="table table-compact w-full">
        <thead>
          <tr class="text-white">
            <th>{{ $t('uptime.no') }}</th>
            <th>Blockchain</th>
            <th>{{ $t('account.validator') }}</th>
            <th>{{ $t('uptime.signed_blocks') }}</th>
            <th>{{ $t('uptime.last_jailed_time') }}</th>
            <th>{{ $t('uptime.tombstoned') }}</th>
            <th class="text-center">{{ $t('uptime.missing_blocks') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, i) in list" class="hover">
            <td>{{ i + 1 }}</td>
            <td class="capitalize">{{ v.chainName }}</td>
            <td>{{ v.v.name }}</td>
            <td>
              <span v-if="v.sigingInfo">{{
                Number(v.sigingInfo.indexOffset) -
                Number(v.sigingInfo.startHeight)
              }}</span>
            </td>
            <td>
              <div
                v-if="
                  v.sigingInfo &&
                  !v.sigingInfo?.jailedUntil.toString().startsWith('1970')
                "
                class="text-xs flex flex-wrap"
              >
                <div class="mt-1">
                  {{ format.toLocaleDate(v.sigingInfo?.jailedUntil) }}
                </div>
                <div class="badge">
                  {{ format.toDay(v.sigingInfo.jailedUntil, 'from') }}
                </div>
              </div>
            </td>
            <td class="capitalize">{{ v.sigingInfo?.tombstoned }}</td>
            <td class="text-center">
              <span
                v-if="v.sigingInfo"
                class="badge"
                :class="color(v.sigingInfo?.missedBlocksCounter.toString())"
                >{{ v.sigingInfo?.missedBlocksCounter }}</span
              >
            </td>
            <td class="">
              <RouterLink
                :to="`/${v.chainName}/uptime/#blocks`"
                class="btn btn-xs btn-primary"
                >{{ $t('module.blocks') }}</RouterLink
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-center">
      <label
        for="add-validator"
        class="btn btn-primary mt-5 bg-[#2E2E33] border border-[#383B40]"
        >{{ $t('uptime.add_validators') }}</label
      >
    </div>

    <!-- Put this part before </body> tag -->
    <input
      type="checkbox"
      id="add-validator"
      class="modal-toggle"
      @change="initial"
    />
    <div class="modal">
      <div class="modal-box relative section">
        <label
          for="add-validator"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
        <h3 class="text-lg font-bold">{{ $t('uptime.add_validators') }}</h3>
        <div class="form-control my-5">
          <!-- <div class="input-group input-group-md"> -->
          <div class="">
            <select
              v-model="selectChain"
              class="select select-bordered capitalize mb-3 w-full dark:bg-[#2E2E33] border border-gray-200 dark:border-gray-700 rounded-lg"
              @change="changeChain"
            >
              <option v-for="v in dashboard.chains" :value="v.chainName">
                {{ v.chainName }}
              </option>
            </select>
            <div
              class="flex items-center gap-x-4 dark:bg-[#2E2E33] border border-gray-200 dark:border-gray-700 rounded-lg py-2"
            >
              <Icon icon="mdi:magnify" class="text-2xl text-gray-400 ml-3" />
              <input
                v-model="keyword"
                type="text"
                class="w-full flex-1 outline-none text-base text-white dark:bg-[#2E2E33]"
                placeholder="Search validators by name"
              />
            </div>
          </div>
        </div>
        <div class="py-4 max-h-60 overflow-y-auto">
          <table class="table table-compact w-full hover">
            <thead>
              <tr>
                <th>{{ $t('account.validator') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in filterValidators">
                <td>
                  <label :for="v.operatorAddress"
                    ><div class="w-full">
                      {{ i + 1 }}. {{ v.description.moniker }}
                    </div></label
                  >
                </td>
                <td>
                  <input
                    :id="v.operatorAddress"
                    v-model="selected"
                    class="checkbox"
                    type="checkbox"
                    :value="consensusPubkeyToHexAddress(v.consensusPubkey)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-action w-full">
          <label
            class="aria-checked:bg-slate-50 btn btn-primary bg-[#2E2E33] border border-[#383B40] w-full"
            @click="add"
            >{{ $t('uptime.add') }}</label
          >
        </div>
      </div>
    </div>
    <div class="h-6"></div>
  </div>
</template>
