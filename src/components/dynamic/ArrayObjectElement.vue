<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import DynamicComponent from './DynamicComponent.vue';

const props = defineProps({
  value: { type: null as any },
  thead: {
    type: Boolean,
    default: true,
  },
});

const header = computed(() => {
  if (props.value && props.value.length > 0) {
    return Object.keys(props.value[0]);
  }
  return [];
});
</script>
<template>
  <div class="overflow-auto h-[500px] p-4">
    <div
      v-if="header.length > 0"
      class="table table-compact w-full"
      density="compact"
      :height="value.length > 5? '300px': ''"
      fixed-header
      hover
     
    >
      <thead v-if="thead">
        <tr>
          <th
            v-for="(item, index) in header"
            :key="index"
            class="text-left text-capitalize"
          >
            {{ item }} 
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in value" :key="index">
          <td v-for="(el, key) in header" :key="key">
            <DynamicComponent :value="item[el]" />
          </td>
        </tr>
      </tbody>
    </div>

    <div v-else class="h-[300px]"></div>
  </div>
</template>
