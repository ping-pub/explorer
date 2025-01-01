<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import {
  useBankStore,
  useDistributionStore,
  useMintStore,
  useStakingStore,
  useFormatter
} from '@/stores';
import { Icon } from '@iconify/vue';

const selectedTab = ref(localStorage.getItem('selectedTab') || 'Delegators');
const amountTokens = ref(1000000);
const tokenPrice = ref(0.1);
const staking = useStakingStore();
const format = useFormatter();

const validatorSettings = reactive({
  validatorStake: 1000000,
  validatorCommission: 5,
});

const apr = computed((isVal: boolean) => {
  const commissionRate = Number(isVal ? validatorSettings.validatorCommission || 0 : 5) / 100;
  const inflation = Number(useMintStore().inflation || 0);
  const communityTax = Number(useDistributionStore().params.community_tax || 0);
  const bondedTokens = Number(staking.pool.bonded_tokens || 1);
  const totalSupply = Number(useBankStore().supply.amount);
  const bondedRatio = bondedTokens / totalSupply;
  if (bondedRatio === 0) return 0;

  return format.percent(
    (1 - communityTax) * inflation / bondedRatio
  );
});

const totalSupply = computed(() => {
  return Number(useBankStore().supply.amount);
});

const calculateValidatorROI = computed(() => {
  const stake = Number(validatorSettings.validatorStake || 0);
  const commissionRate = Number(validatorSettings.validatorCommission || 0) / 100;
  const aprValue = parseFloat(apr.value as string) / 100;
  if (!aprValue) return 0;
  const price = Number(tokenPrice.value || 0);

  return Number((stake * price * aprValue * commissionRate).toFixed(2));
});

const calculateDelegatorAPR = computed(() => {
  const tokens = Number(amountTokens.value || 0);
  const price = Number(tokenPrice.value || 0);
  const commissionRate = Number(validatorSettings.validatorCommission || 0) / 100;

  const aprValue = parseFloat(apr.value as string) / 100;
  if (!aprValue) return 0;

  return Number((tokens * price * aprValue * (1 - commissionRate)).toFixed(2));
});

watch(selectedTab, (newTab) => {
  localStorage.setItem('selectedTab', newTab);
});


</script>

<template>
  <div class="apr-calculator bg-gray-800 p-4 rounded text-center w-[400px] mx-auto flex flex-col gap-3 items-center">
    <!-- Tabs -->
    <div class="tabs-boxed bg-transparent flex justify-center  space-x-2 mb-4">
      <button class="tab px-4 rounded" :class="selectedTab === 'Delegators' ? 'bg-vector-bg text-white' : 'bg-gray-700'"
        @click="selectedTab = 'Delegators'">
        Delegators
      </button>
      <button class="tab px-4 rounded" :class="selectedTab === 'Validators' ? 'bg-vector-bg text-white' : 'bg-gray-700'"
        @click="selectedTab = 'Validators'">
        Validators
      </button>
    </div>
    <span class='badge py-4 px-4 bg-vector-bg text-white'>APR: {{ apr }}</span>

    <!-- Delegators View -->
    <div v-if="selectedTab === 'Delegators'" class="delegators-view">
      <div class="flex flex-col items-center space-y-4 card card-body bg-[#161616] w-[450px]">
        <label class="text-white">Token Amount</label>
        <div class="flex items-center gap-2">
          <input type="number" v-model="amountTokens" min="1" :max="totalSupply" step="1"
            class="input-field max-w-[150px] " /> <span> VCTR </span>
        </div>
        <label class="text-white pt-4">Token Price: ${{ tokenPrice }}</label>
        <input type="range" v-model="tokenPrice" min="0.01" max="100" step="0.01" class="slider" />

        <div class="text-main mt-4 w-full card card-body bg-vector-bg">
          <div class="flex justify-center gap-1">
            <h4>Estimated Staking Revenue</h4>
            <span class='tooltip text-gray-500 whitespace-nowrap' :data-tip="`assuming 5% validator comission`">
              <Icon icon="mdi:info" />
            </span>
          </div>
          <p class="text-white">Daily: <strong class='text-vector-primary'>${{ (calculateDelegatorAPR / 365).toFixed(2)
              }}</strong></p>
          <p class="text-white">Monthly: <strong class='text-vector-primary'> ${{ (calculateDelegatorAPR /
            12).toFixed(2) }}</strong></p>
          <p class="text-white">Yearly: <strong class='text-vector-primary'>${{ calculateDelegatorAPR }}</strong></p>
        </div>
      </div>
    </div>

    <!-- Validators View -->
    <div v-if="selectedTab === 'Validators'" class="validators-view">
      <div class="flex flex-col items-center space-y-4 card card-body bg-[#161616]  w-[450px]">
        <label class="text-white">Amount staked to you</label>
        <div class="flex items-center gap-2">
          <input type="number" v-model="validatorSettings.validatorStake" min="0" :max="totalSupply"
            class="input-field max-w-[150px]" /> <span> VCTR </span>
        </div>
        <label class="text-white pt-4">Token Price: ${{ tokenPrice }}</label>
        <input type="range" v-model="tokenPrice" min="0.01" max="100" step="0.01" class="slider" />
        <label class="text-white pt-4">Validator Commission: {{ validatorSettings.validatorCommission }}%</label>
        <input type="range" v-model="validatorSettings.validatorCommission" min="1" max="100" step="1" class="slider" />


        <div class="text-main mt-4 w-full card card-body bg-vector-bg">
          <h4>Estimated Staking Revenue</h4>
          <p class="text-white">Daily: <strong class='text-vector-primary'>${{ (Number(calculateValidatorROI) /
            365).toFixed(2) }}</strong></p>
          <p class="text-white">Monthly: <strong class='text-vector-primary'>${{ (Number(calculateValidatorROI) /
            12).toFixed(2) }}</strong></p>
          <p class="text-white">Yearly: <strong class='text-vector-primary'>${{
            calculateValidatorROI.toFixed(2) }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tabs {
  border-bottom: 2px solid #444;
}

.tab {
  cursor: pointer;
}

.slider {
  width: 100%;
}

.input-field {
  background-color: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
}
</style>
