<script lang="ts" setup>
import { fromHex } from '@cosmjs/encoding';
import { useWasmStore } from '../WasmStore';
import { ref } from 'vue';
import type {
  ContractInfo,
  PaginabledContractStates,
  PaginabledContracts,
} from '../types';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import type CustomRadiosVue from '@/plugins/vuetify/@core/components/CustomRadios.vue';
import type { CustomInputContent } from '@/plugins/vuetify/@core/types';
import { useFormatter } from '@/stores';

const props = defineProps(['code_id', 'chain']);

const response = ref({} as PaginabledContracts);

const wasmStore = useWasmStore();
wasmStore.wasmClient.getWasmCodeContracts(props.code_id).then((x) => {
  response.value = x;
});
const format = useFormatter();
const infoDialog = ref(false);
const stateDialog = ref(false);
const queryDialog = ref(false);
const info = ref({} as ContractInfo);
const state = ref({} as PaginabledContractStates);
const selected = ref('');

function showInfo(address: string) {
  wasmStore.wasmClient.getWasmContracts(address).then((x) => {
    info.value = x.contract_info;
    infoDialog.value = true;
  });
}
function showState(address: string) {
  wasmStore.wasmClient.getWasmContractStates(address).then((x) => {
    state.value = x;
    stateDialog.value = true;
  });
}
function showQuery(address: string) {
  queryDialog.value = true;
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

const radioContent: CustomInputContent[] = [
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
        Contract List of Code: {{ props.code_id }}
      </h2>
      <div class="overflow-x-auto">
        <table class="table w-full mt-4">
          <thead>
            <tr>
              <th style="position: relative">Contract List</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in response.contracts">
              <td>{{ v }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm text-xs mr-2"
                  @click="showInfo(v)"
                >
                  contract
                </button>
                <button
                  class="btn btn-primary btn-sm text-xs mr-2"
                  @click="showState(v)"
                >
                  States
                </button>
                <button
                  class="btn btn-primary btn-sm text-xs"
                  @click="showQuery(v)"
                >
                  Query
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <v-dialog v-model="infoDialog" width="auto">
      <v-card>
        <VCardTitle>Contract Detail</VCardTitle>
        <v-card-text>
          <DynamicComponent :value="info" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="infoDialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="stateDialog" width="auto">
      <v-card>
        <VCardTitle>Contract States</VCardTitle>
        <VList>
          <VListItem v-for="v in state.models">
            <VListItemTitle>
              {{ format.hexToString(v.key) }}
            </VListItemTitle>
            <VListItemSubtitle :title="format.base64ToString(v.value)">
              {{ format.base64ToString(v.value) }}
            </VListItemSubtitle>
          </VListItem>
        </VList>
        <v-card-actions>
          <v-btn color="primary" block @click="stateDialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="queryDialog" width="auto">
      <v-card>
        <VCardTitle>Query Contract</VCardTitle>
        <v-card-text>
          <CustomRadios
            v-model:selected-radio="selectedRadio"
            :radio-content="radioContent"
            :grid-column="{ sm: '6', cols: '12' }"
          />

          <VTextarea v-model="query" label="Query String" class="my-2" />
          <VTextarea v-model="result" label="Result" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="queryDialog = false"
            >Close Dialog</v-btn
          >
          <v-btn color="success" @click="queryContract()">Query Contract</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
