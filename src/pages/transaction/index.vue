<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { convertDateTime } from '@/utils';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';
import BlockChart from '@/components/charts/BlockChart.vue';
import { useBlock } from '@/stores';

const maxSocket = 20;
let isWebSocketOpen = false;
const transaction =  useBlock()
const dataSocket = ref([]);
const router = useRouter();

const ws = new WebSocket('wss://api-chain.onechain.game/websocket');
onMounted(async () => {
  try {
    if (!isWebSocketOpen) {
      await transaction.fetch10FirstTx();
    }
    transaction.firstRenderTx.result.txs.forEach((item) => {
      dataSocket.value.push({
         height: item.height || null,
        fee: item.tx_result.events[0].attributes[0].value || null,
        fee_payer: item.tx_result.events[0].attributes[1].value || null,
        hash: item.hash || null,
      });
    });
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ API:', error);
  }
});
ws.addEventListener('open', () => {
  try {
    const subscribeMessage = {
      jsonrpc: '2.0',
      method: 'subscribe',
      id: 0,
      params: {
        query: "tm.event='Tx'",
      },
    };
    ws.send(JSON.stringify(subscribeMessage));
  } catch (error) {
    console.error('Lỗi khi gửi subscribe message:', error);
  }
});

ws.addEventListener('message', async (event) => {
  try {
    const data = JSON.parse(event.data);
    if(dataSocket.value.length >= maxSocket){
      dataSocket.value.pop();
    }
    if (data?.result?.data && data?.result?.events) {
      const newData = {
        height: data?.result?.data?.value?.TxResult?.height || null,
        fee: data?.result?.events?.['tx.fee']?.[0] || null,
        fee_payer: data?.result?.events?.['tx.fee_payer']?.[0] || null,
        hash: data?.result?.events?.['tx.hash']?.[0] || null,
      };

      dataSocket.value.unshift(newData);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý dữ liệu từ WebSocket:', error);
  }
});

ws.addEventListener('error', (error) => {
  console.error('Lỗi kết nối WebSocket:', error);
});

const pageSize = 10;
const currentPage = ref(1);
const handleChangePage = (newPage) => {
  currentPage.value = newPage;
};
const totalRecords = computed(() => {
  return Math.ceil(dataSocket.value.length / pageSize);
});
// Sử dụng watch để theo dõi sự thay đổi của webSocketData

const headers = [
  {
    title: 'Height',
    key: 'height',
    sortable: false,
  },
  {
    title: 'hash',
    key: 'hash',
    sortable: false,
  },
  {
    title: 'fee_payer',
    key: 'fee_payer',
    sortable: false,
  },
  {
    title: 'fee',
    key: 'fee',
    sortable: false,
  },
];
const searchInput = ref("");

const handleSearchByHash = (e) => {
  router.push(`/transaction/hash/${searchInput.value}`);
};
</script>
<template>
   <div>
     <v-text-field
        v-model="searchInput"
        density="compact"
        variant="solo"
        class="pb-2"
        label="Search Tx By Hash"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        @click:append-inner="handleSearchByHash"
      ></v-text-field>

      <v-skeleton-loader :loading="transaction.isLoadingTx" type="table">
  
    <v-data-table
      :page="currentPage"
      :items-per-page="pageSize"
      :headers="headers"
      :items="dataSocket"
      :total-items="totalRecords"
      hide-default-footer
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item="props">
        <tr @click="handleRouter(props.item.selectable.height)">
          <td>{{ props.item.selectable.height }}</td>
          <td>{{ props.item.selectable.hash }}</td>
          <td>{{ props.item.selectable.fee_payer }}</td>
          <td>{{ props.item.selectable.fee }}</td>
        </tr>
      </template>
      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination
            v-model="currentPage"
            :length="totalRecords"
          ></v-pagination>
        </div>
      </template>
    </v-data-table>
    </v-skeleton-loader>
   </div>
</template>
