<script setup lang="ts">

import { useBlockchain } from '@/stores/useBlockchain';
const chainStore = useBlockchain()

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
            <VListSubheader v-if="chainStore.current.apis?.rest" title="Rest Endpoint" />
            <VListItem v-for="i in chainStore.current.apis?.rest" link @click="chainStore.setRestEndpoint(i.address)">
              <VListItemTitle>{{ i.provider }} <VIcon v-if="chainStore.availableEndpoint && i.address === chainStore.availableEndpoint" icon="mdi-check" color="success" /></VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>

            <VListSubheader v-if="chainStore.current.apis?.grpc" title="gRPC Endpoint" />
            <VListItem v-for="i in chainStore.current.apis?.grpc" link>
              <VListItemTitle>{{ i.provider }}</VListItemTitle>
              <VListItemSubtitle>{{ i.address }}</VListItemSubtitle>
            </VListItem>
          </VList>
        </VMenu>
        <!-- !SECTION -->
      </VAvatar>
    </VBadge>
  </template>
  <VListItemTitle>{{ chainStore.current?.chain_id || '' }}</VListItemTitle>
  <VListItemSubtitle> {{ chainStore.availableEndpoint }}</VListItemSubtitle>
  </VListItem>
</template>
