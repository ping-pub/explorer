<script lang="ts" setup>

</script>
<template>
    <div class="bg-card px-4 pt-3 pb-4 rounded-sm">
        <div class="text-base mb-3 text-main">Minting Parameters</div>
        <div class="grid grid-cols-5 gap-4">
            <div v-for="item in 10" :key="item" class="rounded-sm bg-active px-4 py-2">
            <div class="text-xs mb-2 text-secondary">Blocks Per Year</div>
            <div class="text-base text-main">4,360,000</div>
            </div>
        </div>
    </div>
</template>
<route>
{
    meta: {
    i18n: 'parameters'
    }
}
</route>