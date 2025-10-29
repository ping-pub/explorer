<script lang="ts" setup>
import { useBaseStore, useBlockchain, useFormatter } from '@/stores';
import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';
import { computed, ref } from '@vue/reactivity';
import type { Tx, TxResponse } from '@/types';
import JsonTreeViewer from '@/components/common/JsonTreeViewer.vue'


import { JsonViewer } from "vue3-json-viewer"
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

import { watch } from 'vue'


const props = defineProps(['hash', 'chain']);

const blockchain = useBlockchain();
const baseStore = useBaseStore();
const format = useFormatter();
const tx = ref(
  {} as {
    tx: Tx;
    tx_response: TxResponse;
  }
)
// Initial fetch and reactive refetch when the hash changes
watch(
  () => props.hash,
  async (newHash) => {
    if (!newHash) return
    try {
      const result = await blockchain.rpc.getTx(newHash)
      tx.value = result
    } catch (error) {
      console.error('❌ Failed to fetch TX:', error)
      tx.value = null as any
    }
  },
  { immediate: true }
)

const messages = computed(() => {
    return tx.value.tx?.body?.messages.map(x=> {
        if(x.packet?.data) {
            // @ts-ignore
            x.message = format.base64ToString(x.packet.data)
        }
        return x
    }) || [];
});

 // 🧠 Clean formatted JSON
const formattedTxData = computed(() => {
  if (!tx.value || Object.keys(tx.value).length === 0) return {}
  try {
    const cache = new Set()
    const cleanData = JSON.parse(
      JSON.stringify(tx.value, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.has(value)) return '[Circular Reference]'
          cache.add(value)
        }
        return value
      })
    )
    return cleanData
  } catch (error) {
    return {}
  }
})

// 🎨 Theme adaptive syntax colors
const colors = computed(() => ({
  key: baseStore.theme === 'dark' ? '#c792ea' : '#7b1fa2',
  string: baseStore.theme === 'dark' ? '#c3e88d' : '#2e7d32',
  number: baseStore.theme === 'dark' ? '#f78c6c' : '#d84315',
  boolean: baseStore.theme === 'dark' ? '#89ddff' : '#0288d1',
  null: baseStore.theme === 'dark' ? '#ff5370' : '#d32f2f'
}))

// 🌈 JSON syntax highlight
const formattedJson = computed(() => {
  const json = JSON.stringify(formattedTxData.value, null, 2)
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let color = ''
        if (/^"/.test(match)) {
          color = /:$/.test(match) ? colors.value.key : colors.value.string
        } else if (/true|false/.test(match)) {
          color = colors.value.boolean
        } else if (/null/.test(match)) {
          color = colors.value.null
        } else {
          color = colors.value.number
        }
        return `<span style="color:${color}">${match}</span>`
      }
    )
})

</script>
<template>
<div>    
    <div>
        <h2 class="bg-[#09279F] dark:bg-base-100 text-3xl rounded-2xl px-4 py-4 my-4 font-bold text-[#ffffff;]">{{ $t('tx.title') }}</h2>
        <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 rounded-2xl mb-4 border dark:border-base-100">
            <div class="overflow-hidden">
               <table class="text-sm border-none divide-none w-full rounded-xl">
               <tbody>
                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.tx_hash') }}</td>
                        <td class="py-3 px-2 overflow-hidden dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx_response.txhash }}
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('account.height') }}</td>
                        <td class="py-3 px-2 overflow-hidden dark:text-warning text-[#09279F] font-bold">
                            <RouterLink
                                :to="`/${props.chain}/blocks/${tx.tx_response.height}`"
                                class="text-primary dark:invert"
                            >
                                {{ tx.tx_response.height }}
                            </RouterLink>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('staking.status') }}</td>
                        <td class="py-3 px-2">
                            <span
                                class="text-xs truncate relative py-2 px-4 w-fit mr-2 rounded"
                                :class="`text-${tx.tx_response.code === 0 ? '[#60BC29]' : 'error'}`"
                            >
                                <span
                                    class="inset-x-0 inset-y-0 opacity-10 absolute rounded-2xl"
                                    :class="`bg-${tx.tx_response.code === 0 ? '[#6AC13633]' : 'error'}`"
                                >
                                </span>
                                {{ tx.tx_response.code === 0 ? 'Success' : 'Failed' }}
                            </span>
                            <span>
                                {{ tx.tx_response.code === 0 ? '' : tx?.tx_response?.raw_log }}
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('account.time') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ format.toLocaleDate(tx.tx_response.timestamp) }}
                            ({{ format.toDay(tx.tx_response.timestamp, 'from') }})
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.gas') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx_response.gas_used }} / {{ tx.tx_response.gas_wanted }}
                        </td>
                    </tr>

                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.fee') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{format.formatTokens(tx.tx?.auth_info?.fee?.amount, true, '0,0.[00]')}}
                        </td>
                    </tr>
                    <tr>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#64748B]">{{ $t('tx.memo') }}</td>
                        <td class="py-3 px-2 dark:text-gray-400 text-[#171C1F]">
                            {{ tx.tx.body.memo }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
        <div v-if="tx.tx_response" class="bg-[#EFF2F5;] dark:bg-base-100 rounded-xl border dark:border-base-100 mb-4">
            <h2 class="card-title truncate text-2xl mt-2 ml-4 font-semibold align-middle">
                {{ $t('account.messages') }} ({{ messages.length }})
            </h2>
            <div v-for="(msg, i) in messages">
                <div class="mt-2 mb-4">
                    <DynamicComponent :value="msg" />
                </div>
            </div>
            <div v-if="messages.length === 0">{{ $t('tx.no_messages') }}</div>
        </div>

        <!-- <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 mb-4 rounded-xl shadow">
            <div class="flex items-center justify-between mb-2">
                <h2 class="card-title truncate text-2xl">JSON</h2>
            </div>
            <div v-if="Object.keys(formattedTxData).length > 0" class="bg-base-200 p-4 rounded-xl overflow-auto max-h-[600px]">
                <pre v-html="formattedJson"></pre>
            </div>
            <div v-else class="p-4 text-center text-gray-500">
                Loading transaction data...
            </div>
        </div> -->



                <div v-if="tx.tx_response" class="bg-base-100 px-4 pt-3 pb-4 mb-4 rounded-xl shadow">
            <div class="flex items-center justify-between mb-2">
                <h2 class="card-title truncate text-2xl">JSON</h2>
            </div>

            <div v-if="Object.keys(formattedTxData).length > 0"
                 class="bg-base-200 p-4 rounded-xl overflow-auto max-h-[600px]">
                
                <!-- ✅ Interactive JSON Viewer -->
                <JsonTreeViewer :data="formattedTxData" />
            </div>

            <div v-else class="p-4 text-center text-gray-500">
                Loading transaction data...
            </div>
        </div>

    </div>
</div>    
</template>
