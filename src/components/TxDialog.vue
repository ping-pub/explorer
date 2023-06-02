<script lang="ts" setup>
import { useTxDialog } from '@/stores';
const store = useTxDialog();
</script>
<template>
  <ping-tx-dialog
    :type="store.type"
    :sender="store.sender"
    :endpoint="store.endpoint"
    :params="store.params"
    @view="store.view"
    @confirmed="store.confirmed"
  ></ping-tx-dialog>
</template>
