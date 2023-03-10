<script setup lang="ts">

import { useBlockchain, useBaseStore } from '@/stores';
const chainStore = useBlockchain()
const baseStore = useBaseStore()
chainStore.initial()
</script>

<template>
  <VListItem class="m-0 p-0">
    <template #prepend>
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      bordered
      color="success"
      class="mr-2"
    >
      <VAvatar
        class="cursor-pointer"
        color="primary"
        variant="tonal"
      >
        <VImg :src="chainStore.logo" /> 

        <!-- SECTION Menu -->
        <VMenu
          activator="parent"
          location="bottom start"
          offset="14px"
        >
          <VList>
            <!-- 👉 Rest -->
            <VListSubheader v-if="chainStore.current?.endpoints?.rpc" title="Rest Endpoint" />
            <VListItem v-for="i in chainStore.current?.endpoints?.rpc" link @click="chainStore.setRestEndpoint(i)">
              <VListItemTitle>{{ i.provider }} <VIcon v-if="i.address === chainStore.endpoint?.address" icon="mdi-check" color="success" /></VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>

            <VListSubheader v-if="chainStore.current?.endpoints?.grpc" title="gRPC Endpoint" />
            <VListItem v-for="i in chainStore.current?.endpoints?.grpc" link>
              <VListItemTitle>{{ i.provider }}</VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>
          </VList>
        </VMenu>
        <!-- !SECTION -->
      </VAvatar>
    </VBadge>
  </template>
  <VListItemTitle>{{ baseStore.latest.block?.header?.chain_id || chainStore.chainName || '' }}</VListItemTitle>
  <VListItemSubtitle> {{ chainStore.connErr|| chainStore.endpoint.address }}</VListItemSubtitle>
  </VListItem>
</template>
