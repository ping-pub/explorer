<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import DynamicComponent from './DynamicComponent.vue';

const props = defineProps({
  value: { type: Array<Object>},
})

const header = computed(() => {
  if(props.value && props.value.length > 0) {
    return Object.keys(props.value[0])
  }
  return []
})

</script>
<template>
  <VTable v-if="header.length > 0" density="compact" height="300px" fixed-header>
    <thead>
      <tr>
        <th v-for="k in header" class="text-left text-capitalize">{{ k }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="v in props.value">
        <td v-for="k in header"> <DynamicComponent :value="v[k]" /></td>
      </tr>
    </tbody>
  </VTable>
</template>