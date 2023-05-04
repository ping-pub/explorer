<script lang="ts" setup>
import { useBlockchain, useFormatter } from '@/stores';
import type { Connection } from '@/types';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['chain'])
const chainStore = useBlockchain()
const list = ref([] as Connection[])
onMounted(() => {
    chainStore.rpc.getIBCConnections().then(x => {
        list.value = x.connections
    })
})

function color(v: string) {
    if(v && v.indexOf("_OPEN") > -1) {
        return "success"
    }
    return "warning"
}

</script>
<template>
    <div>
        <VCard>
            <VCardTitle>IBC Connections</VCardTitle>
            <VTable>
                <thead>
                    <tr><th>Connection Id</th><th>Connection</th><th>Delay Period</th><th>State</th></tr>
                </thead>
                <tbody>
                    <tr v-for="v in list">
                        <td><RouterLink :to="`/${chain}/ibc/${v.id}`">{{ v.id }}</RouterLink></td>
                        <td>{{ v.client_id }} {{ v.id }} <br> {{v.counterparty.client_id }} {{ v.counterparty.connection_id }} </td>
                        <td>{{ v.delay_period }}</td>
                        <td><VChip :color="color(v.state)">{{ v.state }}</VChip></td>
                    </tr>
                </tbody>
            </VTable>
        </VCard> 
    </div>
</template>

<route>
    {
      meta: {
        i18n: 'ibc'
      }
    }
</route>