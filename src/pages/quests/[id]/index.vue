<script lang="ts" setup>
import { useCitizen } from "@/stores";
const getNumberFromUrl = () => {
  const currentPath = window.location.pathname; // Lấy đường link URL hiện tại
  const parts = currentPath.split("/"); // Tách đường link thành các phần
  const numberPart = parts[parts.length - 1]; // Lấy phần cuối cùng
  return parseInt(numberPart); // Chuyển chuỗi thành số
};
const listCitizen = useCitizen();

const numberFromUrl = getNumberFromUrl();

onMounted(async () => {
  listCitizen.fetchQuest(numberFromUrl);
});
const dataCitizen = computed(() => {
  return listCitizen.quest;
});
</script>
<template>
  <div class="bg-base-100 px-4 pt-3 pb-4 rounded mt-5">
    <div class="text-base mb-3 text-main">Citizen Info</div>
    <div class="grid grid-cols-2 md:!grid-cols-4 lg:!grid-cols-5 2xl:!grid-cols-6 gap-4">
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Id</div>
        <div class="text-base text-main">{{dataCitizen.id}}</div>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Quest Name</div>
        <div class="text-base text-main">{{dataCitizen.quest}}</div>
      </div>
      <div class="rounded-sm bg-active px-4 py-2">
        <div class="text-xs mb-2 text-secondary capitalize">Status</div>
        <div class="text-base text-main">{{dataCitizen.status}}</div>
      </div>
    </div>
  </div>
</template>
