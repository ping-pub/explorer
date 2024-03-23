<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getClient, getUnit } from './ad';

const props = defineProps({
  id: { type: String, required: true},
  unit: { type: String, required: true},
  width: { type: String },
  height: { type: String },
});

const show = ref(false)
onMounted(() => {
  const adClient = getClient();
  const adUnitId = getUnit(props.unit);
  show.value = adClient !== undefined && adUnitId !== undefined;

  if(show.value) {
    adClient.showBannerAd({
        adUnitId,
        containerId: props.id,
    });
  }
});

</script>
<template>
  <div v-show="show" class="grid justify-items-center overflow-auto">
    <div :id="id" class="mt-6"></div>
  </div>
</template>
