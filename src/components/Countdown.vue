<script lang="ts" setup>
import Countdown from '@chenfengyuan/vue-countdown';

const props = defineProps({
  time: { type: Number },
  css: { type: String },
});
</script>
<template>
  <Countdown
    v-if="time"
    :time="time > 0 ? time : 0"
    v-slot="{ days, hours, minutes, seconds }"
  >
    <span class="text-primary font-bold" :class="css">{{ days }}</span> days 
    <span class="text-primary font-bold" :class="css">{{ hours }}</span> hours 
    <span class="text-primary font-bold" :class="css">{{ minutes }}</span> minutes 
    <span class="text-primary font-bold" :class="css">{{ seconds }}</span> seconds
  </Countdown>
</template>
