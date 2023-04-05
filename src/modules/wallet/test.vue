<script lang="ts" setup>
import { CosmosRestClient } from '@/libs/client';

async function tt() {
  const address = "echelon1uattqtrtv8944qkmh44ll97qjacj6tgrekqzm9"
  const validator = "echelonvaloper1uattqtrtv8944qkmh44ll97qjacj6tgr2cupk4"
  const client = new CosmosRestClient("https://api.ech.network")
  let response = await client.getTx("EFF175AF4D46532CFACA4A0F0748DFF1EF8CC1C96DA967D8AFB794EFE048461C");
  console.log('response:', response)
}
tt()
</script>
<template>
  <div>Hello wallet</div>
</template>