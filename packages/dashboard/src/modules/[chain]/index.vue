<script lang="ts" setup>
import { useBlockchain } from '@/stores/useBlockchain';
import { useBankStore } from '@/stores/useBankStore';
import { useBank } from '@/stores/useBank';
import { computed } from 'vue';

const chainStore = useBlockchain()
const bankStore = useBankStore()

const bank = useBank()

</script>

<template>
  <div>
    Hello module index

    result from supply:
    endpoint: {{ chainStore.availableEndpoint }}
    <br>
    ===== 
    <br>
    <VBtn @click="bankStore.fetchTotalSupply({})">Query Supply from "Option style"</VBtn>
    <div></div>{{ bankStore.totalSupply }}

    <br>
    ===== 
    <br>
    <VBtn @click="bank.fetchTotalSupply({})">Query Supply from "API style"</VBtn>
    <div></div>{{ bank.totalSupply }}
  </div>
</template>