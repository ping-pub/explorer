<script lang="ts" setup>
import { Table, Pagination } from "ant-design-vue";
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  dataSource:Any,
  pageSize: Number,
  totalRecords:Any,
  current:Number
});
</script>
<template>
   <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Username</th>
          <th class="text-left">Adrress Wallet</th>
          <th class="text-left">User Name</th>
          <th class="text-left">Level</th>
          <th class="text-left">NFT Name</th>
          <th class="text-left">Balance</th>
          <th class="text-left">EP</th>
        </tr>
      </thead>
      <tbody>
        {{dataSource}}
      </tbody>
    </v-table>
    <v-pagination
      v-model="current"
      class="my-4"
      :length="Math.ceil(totalRecords / pageSize)"
    ></v-pagination>
</template>
