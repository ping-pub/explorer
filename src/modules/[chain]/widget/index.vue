<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import type { Connection } from '@/types';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['chain']);
const chainStore = useBlockchain();
const baseStore = useBaseStore();
const endpoint = ref(chainStore.current?.endpoints?.rpc?.at(0)?.address);

const chainId = computed(() => baseStore.latest?.block?.header?.chainId || '');
const chainName = computed(() => chainStore?.current?.prettyName || '');
const hdPath = computed(() => {
  return `m/44'/${chainStore.current?.coinType}/0'/0/0`;
});
</script>
<template>
  <div>
    <div
      class="p-6 rounded-2xl mb-4 shadow border border-[#242627] dark:bg-[#141416]"
    >
      <h2 class="card-title text-white">{{ $t('widget.title') }}</h2>
      <div class="my-4 grid grid-flow-col auto-cols-max overflow-auto">
        <div class="form-control">
          <div class="input-group">
            <span>{{ $t('widget.endpoint') }}</span>
            <select v-model="endpoint" class="select select-bordered w-fit">
              <option disabled selected>
                {{ $t('widget.select_endpoint') }}
              </option>
              <option
                v-for="v in chainStore.current?.endpoints.rpc"
                :value="v.address"
              >
                {{ v.address }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <span class="text-base text-white font-semibold">{{
        $t('widget.text_1')
      }}</span>
      <div class="mockup-code bg-[#1A1E25] my-2">
        <pre
          data-prefix="1"
        ><code class="text-gray-800 dark:invert">&lt;script type="module" src="https://unpkg.com/@oraichain/oraiscan-widget@latest/dist/ping-widget.js"&gt;</code></pre>
      </div>
    </div>
    <div
      class="p-6 rounded-2xl mb-4 shadow border border-[#242627] dark:bg-[#141416]"
    >
      <h2 class="card-title text-white">{{ $t('module.widget') }}</h2>
      <div class="mt-4">
        <span class="text-base text-white font-semibold">
          1. {{ $t('widget.text_2') }}</span
        >
        <div class="mockup-code bg-[#1A1E25] my-4">
          <pre
            data-prefix=">"
          ><code class="text-green-400">&lt;!-- This widget is optional. --&gt; </code></pre>
          <pre
            data-prefix=">"
          ><code  class="text-gray-800 dark:invert">&lt;ping-connect-wallet chain-id="{{ chainId }}" hd-path="{{ hdPath }}"/&gt;</code></pre>
        </div>

        <span class="text-base text-white font-semibold">
          2. {{ $t('widget.text_3') }}</span
        >
        <div class="mockup-code bg-[#1A1E25] my-2">
          <pre
            data-prefix=">"
          ><code class=" text-gray-800 dark:invert">&lt;ping-token-convert chain-name="{{ chainName }}" endpoint="{{endpoint}}" hd-path="{{hdPath}}"/&gt;</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">&lt;label for="PingTokenConvert" class="btn btn-sm"&gt;Buy {{chainName.toUpperCase()}}&lt;/label&gt;</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'widget',
        order: 300
      }
    }
</route>
