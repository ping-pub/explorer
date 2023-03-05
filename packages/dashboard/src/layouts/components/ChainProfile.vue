<script setup lang="ts">

import { useBlockchain, useBaseStore } from '@/stores';
const chainStore = useBlockchain()
const baseStore = useBaseStore()

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
            <VListSubheader v-if="chainStore.current.endpoints?.rest" title="Rest Endpoint" />
            <VListItem v-for="i in chainStore.current.endpoints?.rest" link @click="chainStore.setRestEndpoint(i.address)">
              <VListItemTitle>{{ i.provider }} <VIcon v-if="chainStore.availableEndpoint && i.address === chainStore.availableEndpoint" icon="mdi-check" color="success" /></VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>

            <VListSubheader v-if="chainStore.current.endpoints?.grpc" title="gRPC Endpoint" />
            <VListItem v-for="i in chainStore.current.endpoints?.grpc" link>
              <VListItemTitle>{{ i.provider }}</VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>
          </VList>
        </VMenu>
        <!-- !SECTION -->
      </VAvatar>
    </VBadge>
  </template>
  <VListItemTitle>{{ baseStore.latest.block?.header?.chain_id || '' }}</VListItemTitle>
  <VListItemSubtitle> {{ chainStore.availableEndpoint }}</VListItemSubtitle>
  </VListItem>
</template>
