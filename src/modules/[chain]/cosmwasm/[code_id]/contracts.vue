<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import { useWasmStore } from '../WasmStore';
import { ref } from 'vue';
import type { PaginabledCodeInfos, PaginabledContracts } from '../types';

const props = defineProps(['code_id', 'chain', ])

const response = ref({} as PaginabledContracts)

const wasmStore = useWasmStore()
wasmStore.wasmClient.getWasmCodeContracts(props.code_id).then(x =>{ 
    response.value = x
})
</script>
<template>
    <div>
        <VCard>
            <VCardTitle>Contract List of Code: {{ props.code_id }}</VCardTitle>
            <VTable>
                <thead>
                    <tr><th>Contract List</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <tr v-for="v in response.contracts">
                        <td>{{ v }}</td><td></td>
                    </tr>
                </tbody>
            </VTable>
        </VCard> 
    </div>
</template>
