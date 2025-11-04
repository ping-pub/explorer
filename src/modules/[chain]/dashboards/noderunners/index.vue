<script lang="ts" setup>
import { useBlockchain } from '@/stores';
import ServiceDashboardByRelays from '../components/ServiceDashboardByRelays.vue';
import { ref, computed, watch } from 'vue';
import ValidatorFilterModal from '../components/ValidatorFilterModal.vue';
import ValidatorPerformanceDashboard from '../components/ValidatorPerformanceDashboard.vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();

// Map frontend chain names to API chain names
const getApiChainName = (chainName: string) => {
  const chainMap: Record<string, string> = {
    'pocket-beta': 'pocket-testnet-beta',
    'pocket-alpha': 'pocket-testnet-alpha',
    'pocket-mainnet': 'pocket-mainnet'
  };
  return chainMap[chainName] || chainName || 'pocket-testnet-beta';
};

// Chain comes from route params (props.chain)
const current = props.chain || chainStore?.current?.chainName || 'pocket-beta';
const apiChainName = computed(() => getApiChainName(String(current)));

// Defaults: group_by=day, last 7 days
const end = new Date();
const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);

const showFilters = ref(false);
const filters = ref({
  domain: undefined as string | undefined,
  owner_address: undefined as string | undefined,
  supplier_address: undefined as string | undefined,
  chain: apiChainName.value,
  start_date: start.toISOString(),
  end_date: end.toISOString(),
});

// Keep chain updated when route params change
watch(apiChainName, (newChain) => {
  filters.value.chain = newChain;
});

function openFilters() { showFilters.value = true; }
function onApply(newFilters: any) { filters.value = { ...filters.value, ...newFilters }; }
</script>

<template>
  <div>
    <p class="bg-[#09279F] dark:bg-base-100 text-2xl rounded-xl px-4 py-2 my-4 font-bold text-[#ffffff]">
      Node Operator Performance
    </p>
    <div class="flex justify-end mb-3">
      <button class="btn btn-sm" @click="openFilters">Filter</button>
    </div>

    <ValidatorPerformanceDashboard :filters="filters" />

    <ValidatorFilterModal
      v-model="showFilters"
      :initial="filters"
      @apply="onApply"
    />
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .table { font-size: 0.75rem; }
  th, td { padding: 0.5rem; }
}
</style>

