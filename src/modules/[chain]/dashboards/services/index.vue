<script lang="ts" setup>
import { ref } from 'vue';
import { useBlockchain } from '@/stores';
import ServiceDashboardByComputeUnits from '../components/ServiceDashboardByComputeUnits.vue';
import ServiceDashboardByRelays from '../components/ServiceDashboardByRelays.vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const selectedDashboard = ref<'computeunits' | 'relays'>('computeunits');
</script>

<template>
  <div>
    <div class="flex items-center justify-between my-4">
      <p class="text-2xl rounded-xl px-4 py-2 font-bold card-title">
      {{ $t('module.services') }} Dashboard
    </p>
        <div class="flex items-center gap-2">
        <span class="text-sm text-secondary">Stats Type:</span>
        <select v-model="selectedDashboard" class="select select-bordered select-sm">
          <option value="computeunits">Compute Units</option>
          <option value="relays">Relays</option>
          </select>
      </div>
    </div>

    <div v-if="selectedDashboard === 'computeunits'">
      <ServiceDashboardByComputeUnits :chain="chainStore?.current?.chainName || props.chain" />
    </div>

    <div v-else>
      <ServiceDashboardByRelays :chain="chainStore?.current?.chainName || props.chain" />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .table { font-size: 0.75rem; }
  th, td { padding: 0.5rem; }
}
</style>

