<script lang="ts" setup>
import VueCountdown from '@chenfengyuan/vue-countdown';

const props = defineProps({
  time: { type: Number },
});
</script>
<template>
  <vue-countdown
    v-if="time"
    :time="time > 0 ? time : 0"
    v-slot="{ days, hours, minutes, seconds }"
  >
    Time Remaining：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes,
    {{ seconds }} seconds.
  </vue-countdown>
</template>
