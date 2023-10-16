<script lang="tsx" setup>
import { useCitizen } from "@/stores";
import { ref } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

const listCitizen = useCitizen();
const currentPage = ref(1);
const rawData = ref([]);
const pageSize = 10;

onMounted(async () => {
  await listCitizen.fetchBlocks();
  rawData.value = listCitizen.blocks;
});

const totalRecords = computed(() => {
  return Math.ceil(rawData.value.length / pageSize);
});

const handleChangePage = (newPage) => {
  currentPage.value = newPage;
};
const headers = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Username",
    key: "userName",
  },
  {
    title: "Address Wallet",
    key: "addressWallet",
  },
  {
    title: "Level",
    key: "level",
  },
  {
    title: "Actions",
    key: "actions",
  },
];
</script>
<template>
  <div class="wrapper-citizen">
    <v-data-table
      :page="currentPage"
      :items-per-page="pageSize"
      :headers="headers"
      :items="rawData"
      :total-items="totalRecords"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <div class="text-truncate">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn variant="outlined" v-bind="props"> Activator slot </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <RouterLink :to="`/citizen/${item.selectable.id}`"
                  ><v-list-item-title>Detail</v-list-item-title></RouterLink
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination v-model="currentPage" :length="totalRecords"></v-pagination>
        </div>
      </template>
    </v-data-table>
    <!-- 
   <line-chart
      :chart-data="chartData"
      :chart-options="chartOptions"
    ></line-chart> -->
  </div>
</template>
