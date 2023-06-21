<script lang="ts" setup>
import { useWasmStore } from '../WasmStore';
import { ref } from 'vue';
import type {
  ContractInfo,
  PaginabledContractStates,
  PaginabledContracts,
} from '../types';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { useBankStore, useBlockchain, useFormatter, useTxDialog } from '@/stores';
import PaginationBar from '@/components/PaginationBar.vue';
import { PageRequest, type PaginatedBalances } from '@/types';

const props = defineProps(['code_id', 'chain']);

const pageRequest = ref(new PageRequest());
const response = ref({} as PaginabledContracts);

const chainStore = useBlockchain()
const wasmStore = useWasmStore();
function loadContract(pageNum: number) {
  const pr = new PageRequest();
  pr.setPage(pageNum);
  wasmStore.wasmClient.getWasmCodeContracts(props.code_id, pr).then((x) => {
    response.value = x;
  });
}
loadContract(1);

const dialog = useTxDialog();
const format = useFormatter();
const infoDialog = ref(false);
const info = ref({} as ContractInfo);
const state = ref({} as PaginabledContractStates);
const selected = ref('');
const balances = ref({} as PaginatedBalances)

function showInfo(address: string) {
  wasmStore.wasmClient.getWasmContracts(address).then((x) => {
    info.value = x.contract_info;
  });
}
function showFunds(address: string) {
  chainStore.rpc.getBankBalances(address).then(res => {
    balances.value = res
  })
}
function showState(address: string) {
  selected.value = address;
  pageload(1);
}

function pageload(p: number) {
  pageRequest.value.setPage(p);
  wasmStore.wasmClient
    .getWasmContractStates(selected.value, pageRequest.value)
    .then((x) => {
      state.value = x;
    });
}

function showQuery(address: string) {
  selected.value = address;
  query.value = '';
  result.value = '';
}

function queryContract() {
  try {
    if (selectedRadio.value === 'raw') {
      wasmStore.wasmClient
        .getWasmContractRawQuery(selected.value, query.value)
        .then((x) => {
          result.value = JSON.stringify(x);
        })
        .catch((err) => {
          result.value = JSON.stringify(err);
        });
    } else {
      wasmStore.wasmClient
        .getWasmContractSmartQuery(selected.value, query.value)
        .then((x) => {
          result.value = JSON.stringify(x);
        })
        .catch((err) => {
          result.value = JSON.stringify(err);
        });
    }
  } catch (err) {
    result.value = JSON.stringify(err); // not works for now
  }
  // TODO, show error in the result.
}

const radioContent = [
  {
    title: 'Raw Query',
    desc: 'Return raw result',
    value: 'raw',
  },
  {
    title: 'Smart Query',
    desc: 'Return structure result if possible',
    value: 'smart',
  },
];

const selectedRadio = ref('raw');
const query = ref('');
const result = ref('');
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title truncate w-full">
        {{ $t('cosmwasm.contract_list_code') }}: {{ props.code_id }}
      </h2>
      <div class="overflow-x-auto">
        <table class="table table-compact w-full mt-4">
          <thead>
            <tr>
              <th style="position: relative; z-index: 2">{{ $t('cosmwasm.contract_list') }}</th>
              <th>{{ $t('account.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(v, index) in response.contracts"
              :key="index"
              class="hover"
            >
              <td>{{ v }}</td>
              <td>
                <label
                  @click="showInfo(v)"
                  for="modal-contract-detail"
                  class="btn btn-primary btn-xs text-xs mr-2"
                  >{{ $t('cosmwasm.btn_contract') }}</label
                >
                <label
                  @click="showFunds(v)"
                  for="modal-contract-funds"
                  class="btn btn-primary btn-xs text-xs mr-2"
                  >{{ $t('cosmwasm.btn_funds') }}</label
                >
                <label
                  class="btn btn-primary btn-xs text-xs mr-2"
                  for="modal-contract-states"
                  @click="showState(v)"
                >
                {{ $t('cosmwasm.btn_states') }}
                </label>
                <label
                  for="modal-contract-query"
                  class="btn btn-primary btn-xs text-xs mr-2"
                  @click="showQuery(v)"
                >
                {{ $t('cosmwasm.btn_query') }}
                </label>
                <label
                  for="wasm_execute_contract"
                  class="btn btn-primary btn-xs text-xs"
                  @click="dialog.open('wasm_execute_contract', { contract: v })"
                >
                {{ $t('cosmwasm.btn_execute') }}
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between">
          <PaginationBar
            :limit="pageRequest.limit"
            :total="response.pagination?.total"
            :callback="loadContract"
          />
          <label
            for="wasm_instantiate_contract"
            class="btn btn-primary my-5"
            @click="
              dialog.open('wasm_instantiate_contract', {
                codeId: props.code_id,
              })
            "
            >{{ $t('cosmwasm.instantiate_contract') }}</label
          >
        </div>
      </div>
    </div>

    <input type="checkbox" id="modal-contract-detail" class="modal-toggle" />
    <label for="modal-contract-detail" class="modal cursor-pointer">
      <label class="modal-box !w-11/12 !max-w-5xl relative p-2" for="">
        <div>
          <div class="flex items-center justify-between px-3 pt-2">
            <div class="text-lg">{{ $t('cosmwasm.contract_detail') }}</div>
            <label
              @click="infoDialog = false"
              for="modal-contract-detail"
              class="btn btn-sm btn-circle"
              >✕</label
            >
          </div>
          <div>
            <DynamicComponent :value="info" />
          </div>
        </div>
      </label>
    </label>

    <input type="checkbox" id="modal-contract-funds" class="modal-toggle" />
    <label for="modal-contract-funds" class="modal cursor-pointer">
      <label class="modal-box relative p-2" for="">
        <div>
          <div class="flex items-center justify-between px-3 pt-2">
            <div class="text-lg">{{ $t('cosmwasm.contract_balances') }}</div>
            <label
              for="modal-contract-funds"
              class="btn btn-sm btn-circle"
              >✕</label
            >
          </div>
          <ul class="menu mt-5">
            <li v-for="b in balances.balances" >
              <a class="flex justify-between"><span>{{ format.formatToken(b) }}</span> {{ b.amount }} </a>
            </li>
            <li v-if="balances.pagination?.total === '0'" class="my-10 text-center">{{ $t('cosmwasm.no_escrowed_assets') }}</li>
          </ul>
        </div>
      </label>
    </label>

    <input type="checkbox" id="modal-contract-states" class="modal-toggle" />
    <label for="modal-contract-states" class="modal cursor-pointer">
      <label class="modal-box !w-11/12 !max-w-5xl" for="">
        <div>
          <div class="flex items-center justify-between px-3 pt-2 mb-4">
            <div class="text-lg">{{ $t('cosmwasm.contract_states') }}</div>
            <label
              for="modal-contract-states"
              class="btn btn-sm btn-circle"
              >✕</label
            >
          </div>
          <div class="overflow-auto">
            <table class="table table-compact w-full text-sm">
              <tr v-for="(v, index) in state.models" :key="index" class="hover">
                <td class="" :data-tip="format.hexToString(v.key)">
                  <span class="font-bold">{{ format.hexToString(v.key) }}</span>
                </td>
                <td
                  class="text-left w-3/4"
                  :title="format.base64ToString(v.value)"
                >
                  {{ format.base64ToString(v.value) }}
                </td>
              </tr>
            </table>
            <PaginationBar
              :limit="pageRequest.limit"
              :total="state.pagination?.total"
              :callback="pageload"
            />
          </div>
        </div>
      </label>
    </label>

    <input type="checkbox" id="modal-contract-query" class="modal-toggle" />
    <label for="modal-contract-query" class="modal cursor-pointer">
      <label class="modal-box !w-11/12 !max-w-5xl" for="">
        <div>
          <div class="flex items-center justify-between px-3 pt-2 mb-4">
            <div class="text-lg font-semibold">{{ $t('cosmwasm.query_contract') }}</div>
            <label
              for="modal-contract-query"
              class="btn btn-sm btn-circle"
              >✕</label
            >
          </div>
          <div class="px-3">
            <div>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div
                  class="form-control border rounded px-4"
                  v-for="(item, index) of radioContent"
                  :key="index"
                  :class="{ 'pt-2': index === 0 }"
                >
                  <label
                    class="label cursor-pointer justify-start"
                    @click="selectedRadio = item?.value"
                  >
                    <input
                      type="radio"
                      name="radio-10"
                      class="radio radio-sm radio-primary mr-4"
                      :checked="item?.value === selectedRadio"
                      style="border: 1px solid #d2d6dc"
                    />
                    <div>
                      <div class="text-base font-semibold">
                        {{ item?.title }}
                      </div>
                      <div class="text-xs">{{ item?.desc }}</div>
                    </div>
                  </label>
                </div>
              </div>
              <textarea v-model="query" placeholder="Query String, {}" label="Query String" class="my-2 textarea textarea-bordered w-full" />
              <textarea v-model="result" readonly placeholder="Query Result" label="Result" class="textarea textarea-bordered w-full" />
            </div>
            <div class="mt-4 mb-4 text-center">
              <button
                class="btn btn-primary px-4 text-white"
                @click="queryContract()"
              >
              {{ $t('cosmwasm.query_contract') }}
              </button>
            </div>
          </div>
        </div>
      </label>
    </label>
  </div>
</template>
