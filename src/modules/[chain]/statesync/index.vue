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

const state = computed(() => {
  const rpcs = blockchain.current?.endpoints?.rpc
    ?.map((x) => x.address)
    .join(',');
  return `[statesync]
enable = true
rpc_servers = "${rpcs}"
trust_height = ${base.latest.block?.header?.height || 'loading'}
trust_hash = "${
    base.latest.block_id ? toHex(fromBase64(base.latest.block_id?.hash)) : ''
  }"
trust_period = "168h"  # 2/3 of unbonding time"
`;
});

const appName = computed(() => {
  return nodeInfo.value.application_version?.app_name || 'gaiad';
});

onMounted(() => {
  blockchain.rpc.getBaseNodeInfo().then((x) => {
    console.log('node info', x);
    nodeInfo.value = x;
  });
});
</script>
<template>
  <div>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
      <h2 class="card-title truncate mb-2">
        What's State Sync?
      </h2>
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
      <h2 class="card-title truncate mb-2">Starting New Node From State Sync</h2>
      <div class="text-sm">
        1. Install Binary ({{ appName }} Version:
        {{ nodeInfo.application_version?.version || '' }})
        <br />
        We need to install the binary first and make sure that the version is
        the one currently in use on mainnet.
        <br /> <br />
        2. Enable State Sync<br />
        We can configure Tendermint to use state sync in
        $DAEMON_HOME/config/config.toml.
        <br /><br />
        <VTextarea auto-grow :model-value="state"></VTextarea>
        <br />
        3. Start the daemon: <code>{{ appName }} start</code>
        <br />
        If you are resetting node, run
        <code>{{ appName }} unsafe-reset-all</code> or
        <code>{{ appName }} tendermint unsafe-reset-all --home ~/.HOME</code>
        before you start the daemon.
      </div>
    </div>

    <div class="bg-base-100 px-4 pt-3 pb-4 rounded shadow">
      <h2 class="card-title truncate mb-2">Enable Snapshot For State Sync</h2>
      <div class="text-sm">
        To make state sync works, we can enable snapshot in
        $DAEMON_HOME/config/app.toml
        <br/><br/>
        <VTextarea
          auto-grow
          model-value="[state-sync]
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable). Must be a multiple of pruning-keep-every.
snapshot-interval = 1000

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all). Each snapshot is about 500MiB
snapshot-keep-recent = 2"
        >
        </VTextarea>
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
