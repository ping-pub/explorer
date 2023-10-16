<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

const props = defineProps({
  rawData: Array,
  headers: Array,
  pageSize: Number,
  totalRecords: Number,
  currentPage: Number,
  onChange: Function,
});
const currentPage = ref(props.currentPage);

const { emit } = defineEmits();
const updatePage = (page) => {
  currentPage.value = page;
  emit('update:currentPage', page);
};
</script>
<template>
  <v-data-table
    :page="props.currentPage"
    :items-per-page="props.pageSize"
    :headers="props.headers"
    :items="props.rawData"
    :total-items="props.totalRecords"
    hide-default-footer
    class="elevation-1"
      @page-change="updatePage"
  >
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination
          v-model="currentPage"
          :total-visible="5"
          :length="totalRecords"
        ></v-pagination>
      </div>
    </template>
  </v-data-table>
</template>
