<script lang="ts" setup>
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
const rpcList = ref(chainStore.current?.endpoints?.rpc || []);
const httpstatus = 300;
const httpStatusText = 'error';
let rpc = ref('');
onMounted(() => {
  stakingStore.init();
});
console.log(chainStore.current?.endpoints?.rpc, 9998888, chainStore.rpc);
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
          <select v-model="rpc" class="select select-bordered flex-1">
            <option v-for="(item, index) in rpcList" :key="index">
              {{ item?.address }}/consensus_state
            </option>
          </select>
          <button class="btn btn-primary">Monitor</button>
        </label>
      </div>
      <div v-if="httpstatus !== 200" class="text-error mt-1">
        {{ httpstatus }}: {{ httpStatusText }}
      </div>
    </div>
    <!--  -->
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

    <!--  -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <div class="flex flex-1 flex-col truncate">
        <!-- format(updatetime) -->
        <h2 class="text-sm card-title text-error">Updated at {{  }}</h2>
        <!-- <span class="text-xs truncate"> 8</span> -->
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
