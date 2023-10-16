<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useBlock } from "@/stores";
import { convertDateTime } from "@/utils";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
const listValidator = ref([]);
const router = useRouter();
const validator = useBlock();
const pageSize = 10;
const currentPage = ref(1);
onMounted(async () => {
  try {
    await validator.fetchValidator(currentPage.value, pageSize);
    validator.validator.validators.forEach((item) => {
      listValidator.value.push({
        token: item.tokens,
        moniker: item.description.moniker,
        identify: item.description.identify,
        website: item.description.website,
        security_contact: item.description.security_contact,
        detail: item.description.details,
        rate: item.commission.commission_rates.rate,
        max_rate: item.commission.commission_rates.max_rate,
        max_change_rate: item.commission.commission_rates.max_change_rate,
      });
    });
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ API:", error);
  }
});
const headers = [
  [
    {
      title: "Token",
      align: "start",
      sortable: false,
      key: "token",
      rowspan: 2,
    },
    {
      title: "Description",
      key: "description",
      colspan: 5,
      sortable: false,
    },
    {
      title: "Commission Rates",
      key: "commission_rates",
      colspan: 3,
      sortable: false,
    },
  ],
  [
    {
      title: "Moniker",
      key: "moniker",
      sortable: false,
    },
    {
      title: "Identify",
      key: "identity",
      sortable: false,
    },
    {
      title: "Website",
      key: "website",
      sortable: false,
    },
    {
      title: "Security Contact",
      key: "security_contact",
      sortable: false,
    },
    {
      title: "Detail",
      key: "details",
      sortable: false,
    },
    {
      title: "Rate",
      key: "rate",
      sortable: false,
    },
    {
      title: "Max Rate",
      key: "max_rate",
      sortable: false,
    },
    {
      title: "Max Change Rate",
      key: "max_change_rate",
      sortable: false,
    },
  ],
];

const handleChangePage = (newPage) => {
  currentPage.value = newPage;
};
const totalRecords = computed(() => {
  return Math.ceil(listValidator.value.length / pageSize);
});
</script>

<template>
  <div class="list-blocks-page">
    <v-skeleton-loader :loading="validator.isLoadingValidator" type="table">
      <v-data-table
        :page="currentPage"
        :items-per-page="pageSize"
        :headers="headers"
        :items="listValidator"
        :total-items="0"
        hide-default-footer
        :search="search"
        class="elevation-1"
      >
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination v-model="currentPage" :length="totalRecords"></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </div>
</template>
