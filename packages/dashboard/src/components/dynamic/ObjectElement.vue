<script lang="ts" setup>
import DynamicComponent from './DynamicComponent.vue';
import {select} from './index'

const props = defineProps(["value"]);

</script>
<template>
    <VTable>
        <tbody>
            <tr v-for="(v, k) of value">
                <td class="text-capitalize">{{ k }}</td>
                <td><div class="overflow-hidden w-auto" style="max-width: 1000px;">
                    <Component v-if="v" :is="select(v, k)" :value="v"></Component></div>
                </td>
            </tr>
        </tbody>
    </VTable>
</template>