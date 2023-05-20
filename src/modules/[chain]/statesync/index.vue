<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import type { NodeInfo } from '@/types';
import { fromBase64, toHex } from '@cosmjs/encoding';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';

const props = defineProps(['hash', 'chain']);
const blockchain = useBlockchain();
const base = useBaseStore();
const nodeInfo = ref({} as NodeInfo);

const height = ref(Number(base.latest.block?.header?.height|| 2001))
const hash = ref("")

if(height.value > 2000) {
  height.value = Math.round((height.value - 2000) / 1000) * 1000
  base.fetchBlock(height.value).then(res => {
    hash.value = toHex(fromBase64(res.block_id.hash)).toUpperCase()
  })
}
const rpcs = computed(() => {
  return blockchain.current?.endpoints?.rpc
    ?.map((x) => x.address)
    .join(',');
});

const appName = computed(() => {
  return nodeInfo.value.application_version?.app_name || 'gaiad';
});

onMounted(() => {
  blockchain.rpc.getBaseNodeInfo().then((x) => {
    nodeInfo.value = x;
  });
});
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title truncate mb-2">What's State Sync?</h2>
      <div class="text-sm">
        The Tendermint Core 0.34 release includes support for state sync, which
        allows a new node to join a network by fetching a snapshot of the
        application state at a recent height instead of fetching and replaying
        all historical blocks. This can reduce the time needed to sync with the
        network from days to minutes. Click
        <a
          class="text-primary"
          href="https://blog.cosmos.network/cosmos-sdk-state-sync-guide-99e4cf43be2f"
          >here</a
        >
        for more infomation.
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title truncate mb-2">
        Starting New Node From State Sync
      </h2>
      <div class="text-sm">
        1. Install Binary ({{ appName }} Version:
        {{ nodeInfo.application_version?.version || '' }})
        <br />
        We need to install the binary first and make sure that the version is
        the one currently in use on mainnet.
        <br />
        <br />
        2. Enable State Sync<br />
        We can configure Tendermint to use state sync in
        $DAEMON_HOME/config/config.toml.
        <br /><br />
        <div class="mockup-code my-2">
            <pre data-prefix=">"><code class="text-gray-400">[state-sync]</code></pre>
            <pre data-prefix=">"><code class="text-gray-400">enable = true</code></pre>
            <pre data-prefix=">"><code class="text-gray-400"></code></pre>
            <pre data-prefix=">"><code class="text-gray-400">rpc_servers = "{{ rpcs }}"</code></pre>
            <pre data-prefix=">"><code class="text-gray-400">trust_height = {{ height }} </code></pre>
            <pre data-prefix=">"><code class="text-gray-400">trust_hash = "{{hash}}"</code></pre>
            <pre data-prefix=">"><code class="text-gray-400"></code></pre>
            <pre data-prefix=">"><code class="text-green-400"># 2/3 of unbonding time</code></pre>
            <pre data-prefix=">"><code class="text-gray-400">trust_period = "168h"</code></pre>
        </div>
        <br />
        3. Start the daemon: <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow">{{ appName }} start</code>
        <br />
        If you are resetting node, run
        <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow">{{ appName }} unsafe-reset-all</code> or
        <code class="bg-base-200 text-gray-600 px-2 py-px mx-1 rounded shadow">{{ appName }} tendermint unsafe-reset-all --home ~/.HOME</code>
        before you start the daemon.
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title truncate mb-2">Enable Snapshot For State Sync</h2>
      <div class="text-sm">
        To make state sync works, we can enable snapshot in
        $DAEMON_HOME/config/app.toml
        <br /><br />
        <div class="mockup-code my-2">
            <pre data-prefix=">"><code class="text-gray-400">[state-sync]</code></pre>
            <pre data-prefix=">"><code class="text-green-400"># snapshot-interval specifies the block interval at which local state sync snapshots are</code></pre>
            <pre data-prefix=">"><code class="text-green-400"># taken (0 to disable). Must be a multiple of pruning-keep-every.</code></pre>
            <pre data-prefix=">"><code class="text-gray-400">snapshot-interval = 1000</code></pre>
            <pre data-prefix=">"><code class="text-gray-400"></code></pre>
            <pre data-prefix=">"><code class="text-green-400"># snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all). Each snapshot is about 500MiB</code></pre>
            <pre data-prefix=">"><code class="text-gray-400">snapshot-keep-recent = 2</code></pre>
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
