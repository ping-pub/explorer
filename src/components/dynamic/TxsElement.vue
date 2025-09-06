<script lang="ts" setup>
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { computed } from '@vue/reactivity';
import { hashTx } from '@/libs';
import { useBlockchain, useFormatter } from '@/stores';
const props = defineProps({
  value: { type: Array<string> },
});

const txs = computed(() => {
  return props.value?.map((x) => ({
    hash: hashTx(fromBase64(x)),
    tx: decodeTxRaw(fromBase64(x)),
  })) || []
});

const format = useFormatter();
const chain = useBlockchain();
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-3 text-sm dark:bg-base-200 bg-[#ffffff;] px-4 py-2 pt-0.5 pb-0.5 overflow-x-auto txsContainer"
  >
    <table
      class="table w-full border-separate border-spacing-0"
      density="compact"
      v-if="txs.length > 0"
    >
      <thead>
        <tr>
          <th style="position: relative; z-index: 2;">Hash</th>
          <th>Messages</th>
          <th>Memo</th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr v-for="item in txs">
          <td>
            <RouterLink
              :to="`/${chain.chainName}/tx/${item.hash}`"
              class="text-[#153cd8;] dark:invert"
              >{{ item.hash }}</RouterLink
            >
          </td>
          <td>
            {{
              format.messages(
                item.tx.body.messages.map((x) => ({ '@type': x.typeUrl }))
              )
            }}
          </td>
          <td>{{ item.tx.body.memo }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">No Transactions</div>
  </div>
</template>
