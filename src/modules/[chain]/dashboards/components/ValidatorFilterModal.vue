<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useDomains } from '../composables/useValidatorPerformance';

const props = defineProps<{
  modelValue: boolean;
  initial: {
    domain?: string;
    owner_address?: string;
    supplier_address?: string;
    chain?: string;
    start_date: string;
    end_date: string;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'apply', payload: any): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const selectedDomain = ref<string | ''>(props.initial?.domain || '');
const ownerAddress = ref<string>(props.initial?.owner_address || '');
const supplierAddress = ref<string>(props.initial?.supplier_address || '');
const start = ref<string>(props.initial?.start_date);
const end = ref<string>(props.initial?.end_date);

const { data: domainsResp, load: loadDomains } = useDomains(200, props.initial?.chain);
const domainOptions = computed(() => (domainsResp.value?.data || []).map(d => ({
  value: d.domain || '',
  label: d.domain || 'Unknown',
  count: d.validator_count,
})));

function preset(days: number) {
  const e = new Date();
  const s = new Date(e.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  start.value = s.toISOString();
  end.value = e.toISOString();
}

function apply() {
  emit('apply', {
    domain: selectedDomain.value || undefined,
    owner_address: ownerAddress.value || undefined,
    supplier_address: supplierAddress.value || undefined,
    start_date: start.value,
    end_date: end.value,
  });
  open.value = false;
}

onMounted(() => loadDomains());
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box dark:bg-base-100 bg-base-200 w-11/12 max-w-3xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-lg">Validator Filters</h3>
        <button class="btn btn-sm btn-circle" @click="open=false">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label text-xs">Domain</label>
          <select v-model="selectedDomain" class="select select-bordered w-full">
            <option value="">All</option>
            <option v-for="opt in domainOptions" :key="opt.label" :value="opt.value">
              {{ opt.label }} ({{ opt.count }})
            </option>
          </select>
        </div>

        <div>
          <label class="label text-xs">Owner Address</label>
          <input v-model="ownerAddress" class="input input-bordered w-full font-mono" placeholder="pokt1..." />
        </div>

        <div>
          <label class="label text-xs">Supplier Operator Address</label>
          <input v-model="supplierAddress" class="input input-bordered w-full font-mono" placeholder="poktvaloper1..." />
        </div>

        <div class="grid grid-cols-1 gap-2">
          <label class="label text-xs">Date Range (UTC)</label>
          <input v-model="start" type="text" class="input input-bordered w-full" placeholder="Start ISO (e.g. 2025-10-01T00:00:00Z)" />
          <input v-model="end" type="text" class="input input-bordered w-full" placeholder="End ISO (e.g. 2025-10-07T23:59:59Z)" />
          <div class="flex gap-2">
            <button class="btn btn-xs" @click="preset(1)">Today</button>
            <button class="btn btn-xs" @click="preset(7)">Last 7d</button>
            <button class="btn btn-xs" @click="preset(30)">Last 30d</button>
            <button class="btn btn-xs" @click="preset(90)">Last 90d</button>
          </div>
        </div>

        <div>
          <label class="label text-xs">Group By</label>
          <div class="flex items-center gap-3 text-sm">
            <input type="radio" checked disabled /> <span>Day (fixed)</span>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="open=false">Cancel</button>
        <button class="btn btn-primary" @click="apply">Apply</button>
      </div>
    </div>
  </dialog>
</template>


