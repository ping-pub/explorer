<script lang="ts" setup>
import Countdown from '@chenfengyuan/vue-countdown';

const props = defineProps({
  time: { type: Number },
});
</script>
<template>
  <Countdown
    v-if="time"
    :time="time > 0 ? time : 0"
    v-slot="{ days, hours, minutes, seconds }"
  >
    {{ days }} days {{ hours }} hours {{ minutes }} minutes {{ seconds }} seconds
  </Countdown>
</template>
