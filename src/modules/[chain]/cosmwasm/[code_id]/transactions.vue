<script lang="ts" setup>
import PaginationBar from '@/components/PaginationBar.vue';
import {
  useBaseStore,
  useBlockchain,
  useFormatter,
  useTxDialog,
} from '@/stores';
import {
  PageRequest,
  type PaginatedBalances,
  type PaginatedTxs,
} from '@/types';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useWasmStore } from '../WasmStore';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { useRoute } from 'vue-router';
import type { ContractInfo, PaginabledContractStates } from '../types';

import { JsonViewer } from 'vue3-json-viewer';
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import 'vue3-json-viewer/dist/index.css';

const chainStore = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const wasmStore = useWasmStore();

const route = useRoute();
const page = ref(new PageRequest());
const pageRequest = ref(new PageRequest());

const txs = ref<PaginatedTxs>({ txs: [], tx_responses: [], pagination: { total: '0' } });

const dialog = useTxDialog();
const info = ref({} as ContractInfo);
const state = ref({} as PaginabledContractStates);
const selected = ref('');
const balances = ref({} as PaginatedBalances);

const contractAddress = String(route.query.contract);

const history = JSON.parse(localStorage.getItem('contract_history') || '{}');

if (history[chainStore.chainName]) {
  if (!history[chainStore.chainName].includes(contractAddress)) {
    history[chainStore.chainName].push(contractAddress);
    if (history[chainStore.chainName].length > 10) {
      history[chainStore.chainName].shift();
    }
  }
} else {
  history[chainStore.chainName] = [contractAddress];
}
localStorage.setItem('contract_history', JSON.stringify(history));

onMounted(() => {
  const address = contractAddress;
  wasmStore.wasmClient.getWasmContracts(address).then((x) => {
    info.value = x.contract_info;
  });
  chainStore.rpc
    .getTxs("?order_by=2&events=execute._contract_address='{address}'", { address }, page.value)
    .then((res) => {
      txs.value = res;
    });

  wasmStore.wasmClient.getWasmContractQueries(contractAddress).then((res) => {
    console.log('queries: ', res);
    queries.value = res;
    if (res && res.length > 0) {
      selectQuery(res[0]);
    }
  });

  showFunds();
  showState();
});

function pageload(pageNum: number) {
  page.value.setPage(pageNum);
  const address = String(route.query.contract);
  chainStore.rpc
    .getTxs("?order_by=2&events=execute._contract_address='{address}'", { address }, page.value)
    .then((res) => {
      txs.value = res;
    });
}

function showFunds() {
  const address = String(route.query.contract);
  chainStore.rpc.getBankBalances(address).then((res) => {
    balances.value = res;
  });
}
function showState() {
  const address = String(route.query.contract);
  selected.value = address;
  pageloadState(1);
}

function pageloadState(p: number) {
  pageRequest.value.setPage(p);
  wasmStore.wasmClient.getWasmContractStates(selected.value, pageRequest.value).then((x) => {
    state.value = x;
  });
}

function showQuery() {
  query.value = '';
  result.value = '';
}

function selectQuery(method: string) {
  query.value = `{"${method}":{}}`;
}

function queryContract() {
  try {
    if (selectedRadio.value === 'raw') {
      wasmStore.wasmClient
        .getWasmContractRawQuery(contractAddress, query.value)
        .then((x) => {
          result.value = x;
        })
        .catch((err) => {
          result.value = err;
        });
    } else {
      wasmStore.wasmClient
        .getWasmContractSmartQuery(contractAddress, query.value)
        .then((x) => {
          result.value = x;
        })
        .catch((err) => {
          result.value = err;
        });
    }
  } catch (err) {
    result.value = JSON.stringify(err); // not works for now
  }
  // TODO, show error in the result.
}

const selectedRadio = ref('smart');
const query = ref('');
const result = ref({});
const queries = ref<string[]>([]);
const tab = ref('detail');
</script>
<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'detail' }" @click="tab = 'detail'">{{
        $t('cosmwasm.contract_detail')
      }}</a>
      <a
        class="tab text-gray-400 uppercase"
        :class="{ 'tab-active': tab === 'transaction' }"
        @click="tab = 'transaction'"
        >Transactions</a
      >
      <a class="tab text-gray-400 uppercase" :class="{ 'tab-active': tab === 'query' }" @click="tab = 'query'">Query</a>
    </div>

    <div v-show="tab === 'detail'">
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title truncate w-full">
          {{ $t('cosmwasm.contract_detail') }}
        </h2>
        <DynamicComponent :value="info" />
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div class="flex items-center justify-between px-3 pt-2">
          <div class="text-lg">{{ $t('cosmwasm.contract_balances') }}</div>
        </div>
        <ul class="menu mt-5">
          <li v-for="b in balances.balances">
            <a class="flex justify-between"
              ><span>{{ format.formatToken(b) }}</span> {{ b.amount }}
            </a>
          </li>
          <li v-if="balances.pagination?.total === '0'" class="my-10 text-center">
            {{ $t('cosmwasm.no_escrowed_assets') }}
          </li>
        </ul>
      </div>

      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div class="flex items-center justify-between px-3 pt-2 mb-4">
          <div class="text-lg">{{ $t('cosmwasm.contract_states') }}</div>
        </div>
        <div class="overflow-auto">
          <JsonViewer
            :value="
              state.models?.map((v) => ({
                key: format.hexToString(v.key),
                value: JSON.parse(format.base64ToString(v.value)),
              })) || ''
            "
            :theme="baseStore.theme || 'dark'"
            style="background: transparent"
            copyable
            boxed
            sort
            :expand-depth="5"
          />
          <PaginationBar :limit="pageRequest.limit" :total="state.pagination?.total" :callback="pageloadState" />
        </div>
      </div>

      <div class="text-center mb-4">
        <RouterLink :to="`../${info.code_id}/contracts`"
          ><span class="btn btn-xs text-xs mr-2"> Back </span>
        </RouterLink>

        <label
          for="wasm_migrate_contract"
          class="btn btn-primary btn-xs text-xs mr-2"
          @click="dialog.open('wasm_migrate_contract', { contract: contractAddress })"
        >
          {{ $t('cosmwasm.btn_migrate') }}
        </label>

        <label
          for="wasm_update_admin"
          class="btn btn-primary btn-xs text-xs mr-2"
          @click="dialog.open('wasm_update_admin', { contract: contractAddress })"
        >
          {{ $t('cosmwasm.btn_update_admin') }}
        </label>

        <label
          for="wasm_clear_admin"
          class="btn btn-primary btn-xs text-xs mr-2"
          @click="dialog.open('wasm_clear_admin', { contract: contractAddress })"
        >
          {{ $t('cosmwasm.btn_clear_admin') }}
        </label>

        <label
          for="wasm_execute_contract"
          class="btn btn-primary btn-xs text-xs mr-2"
          @click="dialog.open('wasm_execute_contract', { contract: contractAddress })"
        >
          {{ $t('cosmwasm.btn_execute') }}
        </label>
      </div>
    </div>

    <div v-show="tab === 'transaction'" class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title truncate w-full mt-4 mb-2">Transactions</h2>
      <table class="table">
        <thead class="bg-base-200">
          <tr>
            <td>{{ $t('ibc.height') }}</td>
            <td>{{ $t('ibc.txhash') }}</td>
            <td>{{ $t('ibc.messages') }}</td>
            <td>{{ $t('ibc.time') }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resp in txs?.tx_responses">
            <td>{{ resp.height }}</td>
            <td>
              <div class="text-xs truncate text-primary dark:invert">
                <RouterLink :to="`/${chainStore.chainName}/tx/${resp.txhash}`">{{ resp.txhash }} </RouterLink>
              </div>
            </td>
            <td>
              <div class="flex">
                {{ format.messages(resp.tx.body.messages) }}
                <Icon v-if="resp.code === 0" icon="mdi-check" class="text-success text-lg" />
                <Icon v-else icon="mdi-multiply" class="text-error text-lg" />
              </div>
            </td>
            <td>{{ format.toLocaleDate(resp.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
      <PaginationBar :limit="page.limit" :total="txs.pagination?.total" :callback="pageload" />
    </div>

    <div v-show="tab === 'query'">
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div class="flex items-center justify-between px-3 pt-2 mb-4">
          <div class="text-lg font-semibold">{{ $t('cosmwasm.suggested_messages') }}</div>
        </div>
        <div class="px-3">
          <div>
            <div>
              <span v-for="q in queries" class="btn btn-xs mx-1" @click="selectQuery(q)">{{ q }}</span>
            </div>
            <textarea
              v-model="query"
              placeholder="Query String, {}"
              label="Query String"
              class="my-2 textarea textarea-bordered w-full"
            />

            <div class="mt-4 mb-4 text-center">
              <button class="btn btn-primary btn-sm px-4 text-white" @click="queryContract()">
                {{ $t('cosmwasm.btn_query') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="tab === 'execute'">
      <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <div class="flex items-center justify-between px-3 pt-2 mb-4">
          <div class="text-lg font-semibold">{{ $t('cosmwasm.suggested_messages') }}</div>
        </div>
        <div class="px-3">
          <div>
            <div>
              <span v-for="q in queries" class="btn btn-xs mx-1" @click="selectQuery(q)">{{ q }}</span>
            </div>
            <textarea
              v-model="query"
              placeholder="Query String, {}"
              label="Query String"
              class="my-2 textarea textarea-bordered w-full"
            />

            <div class="mt-4 mb-4 text-center">
              <button class="btn btn-primary btn-sm px-4 text-white" @click="queryContract()">
                {{ $t('cosmwasm.btn_execute') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tab === 'execute' || tab === 'query'" class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <div class="flex items-center justify-between px-3 pt-2 mb-4">
        <div class="text-lg font-semibold">{{ $t('cosmwasm.result') }}</div>
      </div>
      <JsonViewer
        :value="result"
        :theme="baseStore.theme"
        style="background: transparent"
        copyable
        boxed
        sort
        :expand-depth="5"
      />
    </div>
  </div>
</template>
