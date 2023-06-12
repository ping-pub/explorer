<script lang="ts" setup>

const props = defineProps(['value']);

</script>
<template>
  <div class="overflow-auto">
      {{ value["amount"] }} {{ value["denom"] }}
  </div>
</template>
