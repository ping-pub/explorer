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

    <div v-show="tab === 'blocks'" class="bg-base-100 rounded overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th style="position: relative;">Height</th>
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
      </table>
    </div>

    <div v-show="tab === 'transactions'" class="bg-base-100 rounded overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th style="position: relative;">Hash</th>
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
      </table>
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
