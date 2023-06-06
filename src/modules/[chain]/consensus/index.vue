<script lang="ts" setup>
import fetch from 'cross-fetch';
import { onMounted, ref, computed } from 'vue';
import {
  useBaseStore,
  useBlockchain,
  useFormatter,
  useDashboard,
  useStakingStore,
} from '@/stores';
const format = useFormatter();
const chainStore = useBlockchain();
const dashboard = useDashboard();
const stakingStore = useStakingStore();
import { consensusPubkeyToHexAddress } from '@/libs';
const rpcList = ref(
  chainStore.current?.endpoints?.rpc || [{ address: '', provider: '' }]
);
let rpc = ref('');
const validators = ref(stakingStore.validators);

let httpstatus = ref(200);
let httpStatusText = ref('');
let roundState = {};
let rate = ref('');
let height = ref('');
let round = ref('');
let step = ref('');
let timer = null;
let updatetime = ref(new Date());
let positions = ref([]);
onMounted(() => {
  stakingStore.init();
  rpc.value =
    'https://rpc-osmosis-ia.cosmosia.notional.ventures:443/consensus_state';
  // 'https://rpc-osmosis-ia.cosmosia.notional.ventures/consensus_state';
  // rpcList.value[0].address + '/consensus_state';
  fetchPosition();
  console.log(stakingStore.rpc, 'stakingStore', validators);
  update();
  timer = setInterval(() => {
    update();
  }, 6000);
});
console.log(chainStore.current?.endpoints?.rpc, 9998888, chainStore.rpc);

const newTime = computed(() => {
  return format.toDay(updatetime.value || '', 'time');
});

const vals = computed(() => {
  return validators.value.map((x) => {
    const x2 = x;
    x2.hex = consensusPubkeyToHexAddress(x.consensus_pubkey);
    return x2;
  });
});

function showName(i, text) {
  if (text === 'nil-Vote') {
    if (positions.value?.[i]?.address) {
      console.log(validators.value, 9999);
      const val = vals.value.find(
        (x) => x.hex === positions.value?.[i]?.address
      );
      console.log('valvalllllllllllllllll', val);
      return val?.description?.moniker || i;
    }
    return i;
  }
  const txt = text.substring(text.indexOf(':') + 1, text.indexOf(' '));
  const sig = text.split(' ');
  const val = validators.value.find((x) => x.hex.startsWith(txt));
  return `${val?.description?.moniker || txt} - ${sig[2]}`;
}
function onChange() {
  httpstatus.value = 200;
  httpStatusText.value = '';
  roundState = {};
}

async function fetchPosition() {
  let dumpurl = rpc.value.replace('consensus_state', 'dump_consensus_state');
  try {
    const response = await fetch(dumpurl);
    console.log(3333, 'data', response);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    httpstatus.value = response.status;
    httpStatusText.value = response.statusText;

    const data = await response.json();
    positions.value = data.result.round_state.validators.validators;
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

async function update() {
  rate.value = '0%';
  updatetime.value = new Date();
  if (httpstatus.value === 200) {
    fetch(rpc.value)
      .then((data) => {
        console.log(data, 'tataass');
        httpstatus.value = data.status;
        httpStatusText.value = data.statusText;
        return data.json();
      })
      .then((res) => {
        roundState = res.result.round_state;
        console.log(5555, 999, res, roundState);
        const raw = roundState['height/round/step']?.split('/');
        // eslint-disable-next-line prefer-destructuring
        height.value = raw[0];
        // eslint-disable-next-line prefer-destructuring
        round.value = raw[1];
        // eslint-disable-next-line prefer-destructuring
        step.value = raw[2];

        // find the highest onboard rate
        roundState?.height_vote_set?.forEach((element) => {
          const rates = Number(
            element.prevotes_bit_array.substring(
              element.prevotes_bit_array.length - 4
            )
          );
          if (rates > 0) {
            rate.value = `${(rates * 100).toFixed()}%`;
          }
        });
      })
      .catch((err) => {
        httpstatus.value = 500;
        httpStatusText.value = err;
      });
  }
}
</script>

<template>
  <div>
    <!--  -->
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <!-- @click="changeMode()" -->
      <!-- <div v-for="(item, index) in rpcList" :key="index">
        {{ item?.address }}
      </div> -->
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
            <h4 class="text-lg font-semibold text-main">{{ rate }}</h4>
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
            <h4 class="text-lg font-semibold text-main">{{ height }}</h4>
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
            <h4 class="text-lg font-semibold text-main">{{ round }}</h4>
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
            <h4 class="text-lg font-semibold text-main">{{ step }}</h4>
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
        <h2 class="text-sm card-title text-error">
          Updated at {{ newTime || '' }}
        </h2>
        <!-- <span class="text-xs truncate"> 8</span> -->
        <div v-for="item in roundState.height_vote_set" :key="item.round">
          <div class="text-xs">Round: {{ item.round }}</div>
          <div class="text-xs">{{ item.prevotes_bit_array }}</div>
          <small></small>
          <div class="flex flex-wrap">
            <span
              class="badge"
              v-for="(pre, i) in item.prevotes"
              :key="i"
              size="sm"
              style="margin: 2px"
            >
              {{ showName(i, pre) }}</span
            >
          </div>
          <!-- <b-card-body class="px-0">
            <b-badge
              v-for="(pre, i) in item.prevotes"
              :key="i"
              size="sm"
              style="margin: 2px"
              :variant="color(i, pre)"
            >
              <small class="small">{{ showName(i, pre) }}</small>
            </b-badge>
          </b-card-body> -->
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex">
        <button class="btn btn-xs btn-primary px-4 mr-1"></button> Proposer
        Signed <button class="btn btn-xs px-4 ml-2 mr-1"></button> Proposer Not
        Signed
        <button class="btn btn-xs btn-success px-4 ml-2 mr-1"></button> Signed
        <button class="btn btn-xs btn-secondary px-4 ml-2"></button> Not Signed
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
