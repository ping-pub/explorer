<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';

async function tt() {
  const address = "echelon1uattqtrtv8944qkmh44ll97qjacj6tgrekqzm9"
  const validator = "echelonvaloper1uattqtrtv8944qkmh44ll97qjacj6tgr2cupk4"
  const client = new CosmosRestClient("https://api.ech.network")
  let response = await client.getBaseBlockLatest();
  console.log('response:', response)
}
tt()
</script>
<template>
  <div>Hello wallet</div>
</template>