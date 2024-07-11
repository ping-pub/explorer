<script setup lang="ts">
import { useWalletStore } from '@/stores';
import { Icon } from '@iconify/vue';
import { ref, computed, type PropType } from 'vue';

defineProps({
  fillSvg: { type: Object as PropType<string> },
});

const walletStore = useWalletStore();

let showCopyToast = ref(0);
async function copyAdress(address: string) {
  try {
    await navigator.clipboard.writeText(address);
    showCopyToast.value = 1;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  } catch (err) {
    showCopyToast.value = 2;
    setTimeout(() => {
      showCopyToast.value = 0;
    }, 1000);
  }
}
const tipMsg = computed(() => {
  return showCopyToast.value === 2
    ? { class: 'error', msg: 'Copy Error!' }
    : { class: 'success', msg: 'Copy Success!' };
});
</script>

<template>
  <div class="cursor-pointer">
    <svg
      v-if="showCopyToast !== 1"
      @click="copyAdress(walletStore.currentAddress)"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M1.33325 1.33398H9.99992V5.00065H8.66658V2.66732H2.66659V8.66732H4.99992V10.0007H1.33325V1.33398ZM5.99992 6.00065H14.6666V14.6673H5.99992V6.00065ZM7.33325 7.33398V13.334H13.3333V7.33398H7.33325Z"
        :fill="fillSvg ?? '#fff'"
      />
    </svg>
    <Icon
      v-if="showCopyToast === 1"
      :style="{ color: fillSvg ?? '#fff' }"
      icon="mdi:check"
      width="16"
      height="16"
    />
    <!-- <div class="toast" v-show="showCopyToast === 1">
      <div class="alert alert-success">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div>
    <div class="toast" v-show="showCopyToast === 2">
      <div class="alert alert-error">
        <div class="text-xs md:!text-sm">
          <span>{{ tipMsg.msg }}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>
