<script lang="ts" setup>
import DynamicComponent from './DynamicComponent.vue';
import { ref } from 'vue';
const props = defineProps(['value']);
const tab = ref(Object.keys(props.value)[0] || '');

const changeTab = (val: string) => {
  tab.value = val;
};
</script>
<template>
  <div>
    <div class="tabs">
      <a
        class="tab tab-bordered text-gray-400 capitalize"
        v-for="(item, index) of value"
        :value="index"
        :class="{ 'tab-active': tab === String(index) }"
        @click="changeTab(String(index))"
        >{{ index }}</a
      >
    </div>
    <div class="min-h-[25px] mt-4">
      <div v-for="(v, k) of value" :value="k">
        <DynamicComponent :value="v" v-show="tab === String(k)" />
      </div>
    </div>
  </div>
</template>
