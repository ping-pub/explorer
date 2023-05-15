<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { useBaseStore, useFormatter } from '@/stores';
const props = defineProps(['height', 'chain']);

const tab = ref('blocks');

const base = useBaseStore()

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
            <th style="position: relative; z-index: 2;">Height</th>
            <th>Hash</th>
            <th>Proposer</th>
            <th>Txs</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody  v-if="base.recents &&  base.recents.length > 0" >
          <tr v-for="(item, index) in base.recents" :key="index">
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

    <div
      v-show="tab === 'transactions'"
      class="bg-base-100 rounded overflow-x-auto"
    >
      <table class="table w-full">
        <thead>
          <tr>
            <th style="position: relative; z-index: 2;">Height</th>
            <th style="position: relative; z-index: 2;">Hash</th>
            <th>Messages</th>
            <th>Fees</th>
          </tr>
        </thead>
        <tbody >
          <tr v-for="(item,index) in base.txsInRecents" :index="index">
            <td>{{ item.height }}</td>
            <td class="text-xs truncate" width="50%">
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
        <div class="alert relative bg-transparent">
          <div class="alert  absolute inset-x-0 inset-y-0 w-full h-full bg-info opacity-10"></div>
          <div class="text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Only show txs in recent blocks</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route>
    {
      meta: {
        i18n: 'blocks',
        order: 5
      }
    }
  </route>
