<script lang="ts" setup>
import { useBlockModule } from './block';
import { computed, ref } from '@vue/reactivity';
import { useFormatter } from '@/stores';
const props = defineProps(['height', 'chain']);

const store = useBlockModule();
// store.fetchBlock(props.height)
const tab = ref('blocks');

const format = useFormatter();
</script>
<template>
  <div>
    <div class="tabs tabs-boxed bg-transparent mb-4">
      <a
        class="tab text-gray-400 uppercase"
        :class="{ 'tab-active': tab === 'blocks' }"
        @click="tab = 'blocks'"
        >Blocks</a
      >
      <a
        class="tab text-gray-400 uppercase"
        :class="{ 'tab-active': tab === 'transactions' }"
        @click="tab = 'transactions'"
        >Transactions</a
      >
    </div>

    <div v-if="tab === 'blocks'" class="bg-base-100 rounded">
      <VTable>
        <thead>
          <tr>
            <th>Height</th>
            <th>Hash</th>
            <th>Proposer</th>
            <th>Txs</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.recents">
            <td class="text-sm text-primary">
              <RouterLink
                :to="`/${props.chain}/block/${item.block?.header?.height}`"
                >{{ item.block?.header?.height }}</RouterLink
              >
            </td>
            <td>{{ item.block_id?.hash }}</td>
            <td>
              {{ format.validator(item.block?.header?.proposer_address) }}
            </td>
            <td>{{ item.block?.data?.txs.length }}</td>
            <td>{{ format.toDay(item.block?.header?.time, 'from') }}</td>
          </tr>
        </tbody>
      </VTable>
    </div>

    <div class="bg-base-100 rounded" v-if="tab === 'transactions'">
      <VTable>
        <thead>
          <tr>
            <th>Hash</th>
            <th>Messages</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.txsInRecents">
            <td>
              <RouterLink :to="`/${props.chain}/tx/${item.hash}`">{{
                item.hash
              }}</RouterLink>
            </td>
            <td>{{ format.messages(item.tx.body.messages) }}</td>
            <td>{{ format.formatTokens(item.tx.authInfo.fee?.amount) }}</td>
          </tr>
        </tbody>
      </VTable>
      <div class="p-4">
        <v-alert
          type="info"
          text="Only show txs in recent blocks"
          variant="tonal"
        ></v-alert>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks'
      }
    }
  </route>
