<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import { fromBase64, toHex } from '@cosmjs/encoding';
import type { NodeInfo } from '@cosmjs/tendermint-rpc';
import type { GetNodeInfoResponse } from 'cosmjs-types/cosmos/base/tendermint/v1beta1/query';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';

const props = defineProps(['hash', 'chain']);
const blockchain = useBlockchain();
const base = useBaseStore();
const nodeInfo = ref({} as GetNodeInfoResponse | undefined);

const height = ref(0);
const hash = ref('');

base.$subscribe((m, { latest }) => {
  let h = Number(latest.block?.header?.height);
  h = Math.round((h - 2000) / 1000) * 1000;
  if (h > height.value) {
    height.value = h;
    base.fetchBlock(h).then((res) => {
      hash.value = toHex(res.blockId.hash).toUpperCase();
    });
  }
});

const rpcs = computed(() => {
  return blockchain.current?.endpoints?.rpc?.map((x) => x.address).join(',');
});

const appName = computed(() => {
  return nodeInfo.value?.applicationVersion?.appName || 'gaiad';
});

onMounted(() => {
  blockchain.rpc.getBaseNodeInfo().then((x) => {
    nodeInfo.value = x;
  });
});
</script>
<template>
  <div>
    <div
      class="p-6 rounded-2xl mb-4 shadow border border-[#242627] dark:bg-[#141416]"
    >
      <h2 class="card-title truncate mb-2 text-white">
        {{ $t('statesync.title') }}
      </h2>
      <div class="text-sm text-[#B4B7BB] w-8/12">
        {{ $t('statesync.description') }}
        <a
          class="text-primary lowercase"
          href="https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f"
          >{{ $t('statesync.here') }}&nbsp;</a
        >
        <a class="lowercase"> {{ $t('statesync.for_more_info') }}.</a>
      </div>
    </div>

    <div
      class="p-6 rounded-2xl mb-4 shadow border border-[#242627] dark:bg-[#141416]"
    >
      <h2 class="card-title truncate mb-2 text-white">
        {{ $t('statesync.title_2') }}
      </h2>
      <div class="text-sm text-[#B4B7BB]">
        1. {{ $t('statesync.text_1') }} ({{ appName }}
        {{ $t('statesync.version') }}:
        {{ nodeInfo?.applicationVersion?.version || '' }})
        <br />
        {{ $t('statesync.text_1_1') }}.
        <br />
        <br />
        2. {{ $t('statesync.text_2') }}<br />
        {{ $t('statesync.text_2_1') }}. <br /><br />
        <div class="mockup-code bg-base-200 my-2">
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">[state-sync]</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">enable = true</code></pre>
          <pre data-prefix=">"><code class="text-gray-800"></code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">rpc_servers = "{{ rpcs }}"</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">trust_height = {{ height }} </code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">trust_hash = "{{ hash }}"</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert"></code></pre>
          <pre
            data-prefix=">"
          ><code class="text-green-400"># 2/3 of unbonding time</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">trust_period = "168h"</code></pre>
        </div>
        <br />
        3. {{ $t('statesync.text_3') }}:
        <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow"
          >{{ appName }} start</code
        >
        <br />
        {{ $t('statesync.text_3_1') }}
        <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow"
          >{{ appName }} unsafe-reset-all</code
        >
        or
        <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow"
          >{{ appName }} tendermint unsafe-reset-all --home ~/.HOME</code
        >
        {{ $t('statesync.text_3_2') }}.
      </div>
    </div>

    <div
      class="p-6 rounded-2xl mb-4 shadow border border-[#242627] dark:bg-[#141416]"
    >
      <h2 class="card-title truncate mb-2 text-white">
        {{ $t('statesync.title_3') }}
      </h2>
      <div class="text-sm text-[#B4B7BB]">
        {{ $t('statesync.text_title_3') }}
        <br /><br />
        <div class="mockup-code bg-base-200 my-2">
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">[state-sync]</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-green-400"># snapshot-interval specifies the block interval at which local state sync snapshots are</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-green-400"># taken (0 to disable). Must be a multiple of pruning-keep-every.</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">snapshot-interval = 1000</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert"></code></pre>
          <pre
            data-prefix=">"
          ><code class="text-green-400"># snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all). Each snapshot is about 500MiB</code></pre>
          <pre
            data-prefix=">"
          ><code class="text-gray-800 dark:invert">snapshot-keep-recent = 2</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'state-sync'
      }
    }
  </route>
