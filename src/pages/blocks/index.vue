<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { useBlock } from '@/stores';
import { convertDateTime } from '@/utils';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';
import BlockChart from '@/components/charts/BlockChart.vue';

const router = useRouter();
const blocks = ref([]);
const maxBlockCount = 50;
const lastesHeight = ref(0);
const ws = new WebSocket('wss://api-chain.onechain.game/websocket');
let isWebSocketOpen = false;
const block = useBlock();
const missingHeight = ref([]);
onMounted(async () => {
  try {
    if (!isWebSocketOpen) {
      await block.fetch20FirstBlock();
    }
    block.firstRenderBlock.forEach((item) => {
      blocks.value.push({
        height: item?.header?.height,
        time: item?.header?.time,
        hash: item?.header?.last_block_id.hash,
        proposer_address: item?.header?.proposer_address,
      });
    });
    lastesHeight.value = block?.firstRenderBlock[0]?.header?.height;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu từ API:', error);
  }
});

ws.addEventListener('open', () => {
  try {
    const subscribeMessage = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ["tm.event='NewBlock'"],
      id: 1,
    };
    ws.send(JSON.stringify(subscribeMessage));
  } finally {
    isWebSocketOpen = true;
  }
});

ws.addEventListener('message', async (event) => {
  try {
    if (!isWebSocketOpen) {
      return;
    }
    const data = JSON.parse(event.data);
    const currentHeight = data?.result?.data?.value?.block?.header?.height;

    if (blocks.value.length >= maxBlockCount) {
      blocks.value.pop();
    }

    // Ví dụ để giải thích: lastestHeight = 305
    //                      currentHeight = 307
    //                      missHeight    = 306
    // =====> Thứ tự flow code như sau:
    //                              - 305 và 307 sẽ được kiểm tra tại (Number(currentHeight) !== Number(lastesHeight.value) + 1) và if (data.result && Object.keys(data.result).length > 0)

    //                              - -------------------------------------Nhận 305, 305 là current và lastestHeight là 304-------------------------------------
    //                              - Thấy phù hợp điều kiện trường hợp if data.result && Object.keys(data.result).length > 0
    //                              - lastestHeight = currentHeight = 305
    //                              - =============> Data 305 được đẩy vào mảng <=============

    //                              - -------------------------------------Nhận 307, 307 là current và lastestHeight là 305-------------------------------------
    //                              - Nhận thấy sẽ vào trường hợp (Number(307) !== Number(305) + 1) --VÀ-- if (data.result && Object.keys(data.result).length > 0)
    //                              - Fetch data block 306 và đẩy vào mảng
    //                              - =============> Data [305, 306] được đẩy vào mảng <=============

    //                              - Tiếp tục vào trường hợp if (data.result && Object.keys(data.result).length > 0)
    //                              - lastestHeight = currentHeight = 306
    //                              - =============> Data [305, 306, 307] được đẩy vào mảng <=============

    if (currentHeight !== undefined) {
      if (Number(currentHeight) !== Number(lastesHeight.value) + 1) {
        console.log(
          'miss block from: to:',
          Number(lastesHeight.value) + 1,
          currentHeight - 1
        );
        await block.fetchBetweenBlock(
          Number(lastesHeight.value) + 1,
          Number(currentHeight) - 1
        );
        missingHeight.value = block.fromToBlock;
        missingHeight.value.forEach((item) => {
          blocks.value.unshift({
            height: item?.header?.height,
            time: item?.header?.time,
            hash: item?.header?.last_block_id?.hash,
            proposer_address: item?.header?.proposer_address,
          });
        });
      }

      if (data.result && Object.keys(data.result).length > 0) {
        blocks.value.unshift({
          height: data?.result?.data?.value?.block?.header?.height,
          time: data?.result?.data?.value?.block?.header?.time,
          hash: data?.result?.data?.value?.block?.header?.last_block_id?.hash,
          proposer_address:
            data?.result?.data?.value?.block?.header.proposer_address,
        });
      }

      lastesHeight.value = currentHeight;
    }
  } catch (error) {
    console.log(error);
  }
});
ws.addEventListener('error', () => {
  console.error('Lỗi kết nối!');
});
const headers = [
  {
    title: 'Height',
    key: 'height',
    sortable: false,
  },
  {
    title: 'Time',
    key: 'time',
    sortable: false,
  },
  {
    title: 'Hash',
    key: 'hash',
    sortable: false,
  },
  {
    title: 'Proposal Address',
    key: 'proposer_address',
    sortable: false,
  },
];
const pageSize = 10;
const currentPage = ref(1);
const handleChangePage = (newPage) => {
  currentPage.value = newPage;
};
const totalRecords = computed(() => {
  return Math.ceil(blocks.value.length / pageSize);
});
const handleRouter = (block) => {
  router.push(`/blocks/height/${block}`);
};
const searchInput = ref('');
const searchInputByHash = ref('');

const handleSearchByHeight = (e) => {
  router.push(`/blocks/height/${searchInput.value}`);
};
const handleSearchByHash = (e) => {
  router.push(`/blocks/hash/${searchInputByHash.value}`);
};
</script>

<template>
  <div class="list-blocks-page">
    <BlockChart></BlockChart>
    <v-text-field
      v-model="searchInput"
      density="compact"
      variant="solo"
      class="pb-2"
      label="Search Height"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
      @click:append-inner="handleSearchByHeight"
    ></v-text-field>
    <v-text-field
      v-model="searchInputByHash"
      density="compact"
      variant="solo"
      class="pb-2"
      label="Search Hash"
      append-inner-icon="mdi-magnify"
      single-line
      hide-details
      @click:append-inner="handleSearchByHash"
    ></v-text-field>
    <v-skeleton-loader :loading="block.isLoadingTable" type="table">
      <v-data-table
        :page="currentPage"
        :items-per-page="pageSize"
        :headers="headers"
        :items="blocks"
        :total-items="totalRecords"
        hide-default-footer
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item="props">
          <tr @click="handleRouter(props.item.selectable?.height)">
            <td>{{ props.item.selectable?.height }}</td>
            <td>{{ convertDateTime(props.item.selectable.time) }}</td>
            <td>{{ props.item.selectable.hash }}</td>
            <td>{{ props.item.selectable.proposer_address }}</td>
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
