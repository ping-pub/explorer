<script setup lang="ts">
import { ref, computed } from 'vue';

// State Management
const selectedTab = ref('Delegators'); // Default to Delegators tab
const amountTokens = ref(50); // Default slider value for Delegators
const tokenPrice = ref(1); // Default Token Price for Delegators

const validatorSettings = {
  validatorStake: ref(10), // Percentage (default 10%)
  validatorCommission: ref(5), // Percentage (default 5%)
  stakingAPR: ref(6), // Default APR
};

const rpcData = ref({
  inflation: 7, // Example default inflation
  bondedRatio: 0.67, // 67% Staked
  communityTax: 0.02, // 2% Tax
});

const calculateDelegatorAPR = computed(() => {
  return Number((amountTokens.value * tokenPrice.value * rpcData.value.inflation * (1 - rpcData.value.communityTax)).toFixed(2));
});

const calculateValidatorROI = computed(() => {
  const { validatorStake, validatorCommission, stakingAPR } = validatorSettings;

  return Number(
    (
      ((rpcData.value.bondedRatio || 0) *
        (validatorStake.value || 0) *
        (stakingAPR.value || 0) *
        (validatorCommission.value || 0)) /
      100
    ).toFixed(2)
  );
});
</script>

<template>
  <div class="apr-calculator bg-gray-800 p-4 rounded text-center">
    <!-- Tabs -->
    <div class="tabs flex justify-center space-x-4 mb-4">
      <button class="tab px-4 py-2 rounded"
        :class="selectedTab === 'Delegators' ? 'bg-primary text-white' : 'bg-gray-700'"
        @click="selectedTab = 'Delegators'">
        Delegators
      </button>
      <button class="tab px-4 py-2 rounded"
        :class="selectedTab === 'Validators' ? 'bg-primary text-white' : 'bg-gray-700'"
        @click="selectedTab = 'Validators'">
        Validators
      </button>
    </div>

    <!-- Delegators View -->
    <div v-if="selectedTab === 'Delegators'" class="delegators-view">
      <h3 class="text-lg text-white mb-2">Delegator APR Calculator</h3>
      <div class="flex flex-col items-center space-y-4">
        <label class="text-white">Token Amount: {{ amountTokens }}</label>
        <input type="range" v-model="amountTokens" min="1" max="100" step="1" class="slider" />

        <label class="text-white">Token Price: ${{ tokenPrice }}</label>
        <input type="range" v-model="tokenPrice" min="0.01" max="100" step="0.01" class="slider" />

        <div class="text-main mt-4">
          <h4>Estimated ROI</h4>
          <p class="text-white">Daily: ${{ calculateDelegatorAPR / 365 }}</p>
          <p class="text-white">Monthly: ${{ calculateDelegatorAPR / 12 }}</p>
          <p class="text-white">Yearly: ${{ calculateDelegatorAPR }}</p>
        </div>
      </div>
    </div>

    <!-- Validators View -->
    <div v-if="selectedTab === 'Validators'" class="validators-view">
      <h3 class="text-lg text-white mb-2">Validator ROI Calculator</h3>
      <div class="flex flex-col space-y-4">
        <label class="text-white">Validator Stake (%)</label>
        <input type="number" v-model="validatorSettings.validatorStake" class="input-field" />

        <label class="text-white">Validator Commission (%)</label>
        <input type="number" v-model="validatorSettings.validatorCommission" class="input-field" />

        <label class="text-white">Staking APR (%)</label>
        <input type="number" v-model="validatorSettings.stakingAPR" class="input-field" />

        <div class="mt-4">
          <h4 class="text-white">Estimated ROI</h4>
          <p class="text-white">Daily: ${{ calculateValidatorROI / 365 }}</p>
          <p class="text-white">Monthly: ${{ calculateValidatorROI / 12 }}</p>
          <p class="text-white">Yearly: ${{ calculateValidatorROI }}</p>
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
