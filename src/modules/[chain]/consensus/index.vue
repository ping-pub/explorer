<script lang="ts" setup>
import fetch from 'cross-fetch'
import { onMounted, ref } from 'vue';
import {
  useBaseStore,
  useBlockchain,
  useFormatter,
  useDashboard,
  useStakingStore,
} from '@/stores';
const chainStore = useBlockchain();
const dashboard = useDashboard();
const stakingStore = useStakingStore();
const rpcList = ref(
  chainStore.current?.endpoints?.rpc || [{ address: '', provider: '' }]
);
let rpc = ref('');
const validators = ref(stakingStore.validators);

let httpstatus = ref(200);
let httpStatusText = ref('');
let roundState = {};

onMounted(() => {
  stakingStore.init();
  rpc.value = rpcList.value[0].address + '/consensus_state';
  fetchPosition();
  console.log(stakingStore.rpc, 'stakingStore', validators);
});
console.log(chainStore.current?.endpoints?.rpc, 9998888, chainStore.rpc);

function onChange() {
  httpstatus.value = 200;
  httpStatusText.value = '';
  roundState = {};
}
async function fetchPosition () {
  const dumpurl = rpc.value.replace('consensus_state', 'dump_consensus_state');
  console.log(dumpurl, 'dumpurl')
  try {
    const response = await fetch(dumpurl);
    console.log(3333, 'data');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data, 'data');
  } catch (error) {}
  console.log(dumpurl, 'dumpurl');
  // fetch(dumpurl)
  //   .then((data) => {
  //     httpstatus.value = data.status;
  //     httpStatusText.value = data.httpStatusText;
  //     return data.json();
  //   })
  //   .then((res) => {
  //     positions = res.result.round_state.validators.validators;
  //   });
}
</script>

<template>
  <div>
    <!--  -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <!-- @click="changeMode()" -->
      <div v-for="(item, index) in rpcList" :key="index">
        {{ item?.address }}
      </div>
      <div class="form-control">
        <label class="input-group input-group-md w-full flex">
          <!-- <input
            type="text"
            placeholder="Button on both side"
            class="input input-bordered input-md w-full"
            v-model="rpc"
          /> -->
          <select v-model="rpc" class="select select-bordered w-full flex-1">
            <option v-for="(item, index) in rpcList" :key="index">
              {{ item?.address }}/consensus_state
            </option>
          </select>
          <button class="btn btn-primary" @click="onChange">Monitor</button>
        </label>
      </div>
      <div v-if="httpstatus !== 200" class="text-error mt-1">
        {{ httpstatus }}: {{ httpStatusText }}
      </div>
    </div>
    <!-- cards -->
    <div class="mt-4">
      <div class="grid grid-cols-1 md:!grid-cols-4 auto-cols-auto gap-4 pb-4">
        <div
          class="bg-base-100 px-4 py-3 rounded shadow flex justify-between items-center"
        >
          <div class="text-sm mb-1 flex flex-col truncate">
            <h4 class="text-lg font-semibold text-main">{{ 0 }}%</h4>
            <span class="text-md">Onboard Rate</span>
          </div>
          <div class="avatar placeholder">
            <div
              class="bg-rose-100 text-neutral-content rounded-full w-12 h-12"
            >
              <span class="text-2xl text-error font-semibold">O</span>
            </div>
          </div>
        </div>
        <!-- Height -->
        <div
          class="bg-base-100 px-4 py-3 rounded shadow flex justify-between items-center"
        >
          <div class="text-sm mb-1 flex flex-col truncate">
            <h4 class="text-lg font-semibold text-main">{{ 0 }}%</h4>
            <span class="text-md">Height</span>
          </div>
          <div class="avatar placeholder">
            <div
              class="bg-green-100 text-neutral-content rounded-full w-12 h-12"
            >
              <span class="text-2xl text-success font-semibold">H</span>
            </div>
          </div>
        </div>
        <!-- Round -->
        <div
          class="bg-base-100 px-4 py-3 rounded shadow flex justify-between items-center"
        >
          <div class="text-sm mb-1 flex flex-col truncate">
            <h4 class="text-lg font-semibold text-main">{{ 0 }}%</h4>
            <span class="text-md">Round</span>
          </div>
          <div class="avatar placeholder">
            <div
              class="bg-violet-100 text-neutral-content rounded-full w-12 h-12"
            >
              <span class="text-2xl text-primary font-semibold">R</span>
            </div>
          </div>
        </div>
        <!-- Step -->
        <div
          class="bg-base-100 px-4 py-3 rounded shadow flex justify-between items-center"
        >
          <div class="text-sm mb-1 flex flex-col truncate">
            <h4 class="text-lg font-semibold text-main">{{ 0 }}%</h4>
            <span class="text-md">Step</span>
          </div>
          <div class="avatar placeholder">
            <div
              class="bg-blue-100 text-neutral-content rounded-full w-12 h-12"
            >
              <span class="text-2xl text-info font-semibold">S</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- update -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <div class="flex flex-1 flex-col truncate">
        <!-- format(updatetime) -->
        <h2 class="text-sm card-title text-error">Updated at {{}}</h2>
        <!-- <span class="text-xs truncate"> 8</span> -->
      </div>
      <div class="divider"></div>
      <div>
        <button class="btn btn-ms btn-primary"></button> Proposer Signed
        <button class="btn btn-ms"></button> Proposer Not Signed
        <button class="btn btn-ms btn-success"></button> Signed
        <button class="btn btn-ms btn-secondary"></button> Not Signed
      </div>
    </div>

    <!-- alert-info -->
    <div
      class="text-[#00cfe8] bg-[rgba(0,207,232,0.12)] rounded shadow mt-4 alert-info"
    >
      <div
        class="drop-shadow-md px-4 pt-2 pb-2"
        style="box-shadow: rgba(0, 207, 232, 0.4) 0px 6px 15px -7px"
      >
        <h2 class="text-base font-semibold">Tips</h2>
      </div>
      <div class="px-4 py-4">
        <ul style="list-style-type: disc" class="pl-8">
          <li>
            This tool is useful for validators to monitor who is onboard during
            an upgrade
          </li>
          <li>
            If you want to change the default rpc endpoint. make sure that
            "https" and "CORS" are enabled on your server.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<route>
  {
    meta: {
      i18n: 'consensus',
    }
  }
</route>
