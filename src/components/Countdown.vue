<script lang="ts" setup>
import Countdown from '@chenfengyuan/vue-countdown';
import { ref } from 'vue';

const props = defineProps({
  time: { type: Number },
  css: { type: String },
});

const s = ref(0);
</script>
<template>
  <Countdown
    v-if="time"
    :time="time > 0 ? time : 0"
    v-slot="{ days, hours, minutes, seconds }"
    class="countdown-container flex justify-items-center items-start justify-center"
  >
    <div class="flex flex-col">
      <span
        class="!w-14 !h-14 flex items-center justify-center text-link !text-[18px] md:!text-[18px] leading-none !font-semibold border rounded border-link p-4"
        :class="css"
      >
        {{ days }}
      </span>
      <p class="text-[#B4B7BB] text-xs font-normal capitalize mt-3">days</p>
    </div>
    <span class="mt-4">:</span>
    <div class="flex flex-col">
      <span
        class="!w-14 !h-14 flex items-center justify-center text-link !text-[18px] md:!text-[18px] leading-none !font-semibold border rounded border-link p-4"
        :class="css"
      >
        {{ hours }}
      </span>
      <p class="text-[#B4B7BB] text-xs font-normal capitalize mt-3">hours</p>
    </div>
    <span class="mt-4">:</span>
    <div class="flex flex-col">
      <span
        class="!w-14 !h-14 flex items-center justify-center text-link !text-[18px] md:!text-[18px] leading-none !font-semibold border rounded border-link p-4"
        :class="css"
      >
        {{ minutes }}
      </span>
      <p class="text-[#B4B7BB] text-xs font-normal capitalize mt-3">minutes</p>
    </div>
    <span class="mt-4">:</span>
    <div class="flex flex-col">
      <span
        class="!w-14 !h-14 flex items-center justify-center text-link !text-[18px] md:!text-[18px] leading-none !font-semibold border rounded border-link p-4"
        :class="css"
      >
        <div class="relative">
          <Transition name="slide-up">
            <span v-if="seconds % 2 === 0" class="countdown">{{
              seconds
            }}</span>
            <span v-else="seconds % 2 === 1" class="countdown">{{
              seconds
            }}</span>
          </Transition>
        </div>
      </span>
      <p class="text-[#B4B7BB] text-xs font-normal capitalize mt-3">secs</p>
    </div>
  </Countdown>
</template>
