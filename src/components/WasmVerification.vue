<script setup lang="ts">
import { get, post } from "@/libs/http"
import { useBaseStore } from "@/stores";
import { computed, onMounted, ref } from "vue";

import DynamicComponent from '@/components/dynamic/DynamicComponent.vue';


const props = defineProps({
  contract: { type: String },
});

const baseurl = "https://prod.compiler.welldonestudio.io"

const verification = ref({});

const chainId = computed(() => {
    const base = useBaseStore()
    return base.latest?.block?.header?.chain_id || "unknown"
}) 

console.log("contract:", props.contract)

onMounted(() => {

    console.log("mounted", `${baseurl}/deploy-histories/neutron-1?contract=${props.contract}`, chainId.value)
    get(`${baseurl}/deploy-histories/${chainId.value}?contract=${props.contract}`).then((x) => {
        console.log("x:", x)
        verification.value = x
    }).catch(e => {
        console.error(e)
    })
})

function verify() {

    const base = useBaseStore()
    const id =  base.latest?.block?.header?.chain_id || "unknown"
    const data = {"contractAddress": props.contract, "chainId": "neutron"}
    console.log(data)
    post(`${baseurl}/verification/neutron`, data).then((x)=> {
        console.log("x", x)
    })
}
</script>
<template>
    <div class="bg-base-100 px-4 pt-3 pb-4 rounded mb-4 shadow">
        <h2 class="card-title truncate w-full mt-4">Verification {{ chainId }}</h2>
        <div><DynamicComponent :value="verification"/></div>
        <button class="btn btn-primary" @click="verify">verify</button>
    </div>
</template>