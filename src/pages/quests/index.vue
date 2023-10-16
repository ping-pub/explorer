<script lang="tsx" setup>
import { useCitizen } from "@/stores";
import { ref } from 'vue';
import { VDataTable } from "vuetify/labs/VDataTable";

const quests = useCitizen();
const currentPage = ref(1);
const rawData = ref([]);
const pageSize = 10; 

onMounted(async () => {
  await quests.fetchQuests();
  rawData.value = quests.quests;
});

const totalRecords = computed(() => {
  return Math.ceil(rawData.value.length / pageSize);
});

const handlePageChange=(newPage:number)=>{
  currentPage.value = newPage;
}

const headers = [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Quest",
    key: "quest",
  },
  {
    title: "Status",
    key: "status",
  },
    { title: "Action", key: "actions", sortable: false },

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
                <RouterLink :to="`/quests/${item.selectable.id}`"
                  ><v-list-item-title>Detail</v-list-item-title></RouterLink
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
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
  </div>
</template>