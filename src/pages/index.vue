<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { useBlockchain } from '@/stores';

import { ref } from 'vue';

let errorMessage = ref('');
let searchQuery = ref('');
const vueRouters = useRouter();
const blockStore = useBlockchain();

function preventClick(event: any) {
  event.preventDefault();
  event.stopPropagation();
}
function confirm() {
  errorMessage.value = '';
  const key = searchQuery.value;
  if (!key) {
    errorMessage.value = 'Please enter a value!';
    return;
  }
  const height = /^\d+$/;
  const txhash = /^[A-Z\d]{64}$/;
  const addr = /^[a-z\d]+1[a-z\d]{38,58}$/;

  const current = blockStore?.current?.chainName || '';
  const routeParams = vueRouters?.currentRoute?.value;

  if (!Object.values(routeParams?.params).includes(key)) {
    if (height.test(key)) {
      vueRouters.push({ path: `/${current}/block/${key}` });

    } else if (txhash.test(key)) {
      vueRouters.push({ path: `/${current}/tx/${key}` });

      //     this.$router.push({ name: 'transaction', params: { chain: c.chain_name, hash: key } })
    } else if (addr.test(key)) {
      vueRouters.push({ path: `/${current}/account/${key}` });
    } else {
      errorMessage.value = 'The input not recognized';
    }
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    confirm();
  }
}
</script>
<template>
  <div class="mt-20  ">
    <div class="flex h-full  flex-col items-center justify-center mb-6 mt-14 gap-16">
      <div class="rounded-full">
        <img class="mx-auto w-96 h-16" src="../assets/logo.svg" />
      </div>
      <h1 class="text-primary  text-3xl font-bold">
        {{ $t('pages.title') }}
      </h1>
      <div class="flex w-full max-w-[600px] ">
        <input class="input flex-1 w-full !input-bordered"  @keypress="handleKeyPress" v-model="searchQuery"
          placeholder="Search for Height/Transaction/Account Address" />
      </div>
      <div class="text-center text-base">
        <p class="mb-1">
          {{ $t('pages.slogan') }}
        </p>
        <div class="">
          <div class="mt-2 text-right text-sm text-error" v-show="errorMessage">
            {{ errorMessage }}
          </div>
        </div>
      </div>
      <!-- Socials -->
      <div class="flex gap-8">
        <a href="https://playonvector.com/" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:globe" class="text-2xl text-primary" />
          <p>Website</p>
        </a>
        <a href="https://x.com/playonvector/" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:x-fill" class="text-2xl text-primary" />
          <p>Twitter</p>
        </a>
        <a href="https://discord.gg/r5JacJAt" class="flex bg-vector-green rounded px-6 py-2 gap-2">
          <Icon icon="akar-icons:discord-fill" class="text-2xl text-primary" />
          <p>Discord</p>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo path {
  fill: #212121;
}
</style>
