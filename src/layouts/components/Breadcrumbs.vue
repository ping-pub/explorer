<script setup lang="ts">
import { useBlockchain } from '@/stores/useBlockchain';
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const chain = useBlockchain()
const route = useRoute()
const i18n = useI18n()
/// To display human readable module name, we have to set the prefix("module.") + route name to the key in i18n. 
/// such as `module.chain` = 'Dashboard'
const moduleName = computed(() => i18n.t(`module.${route.name?.toString()||''}`))
const items = computed(() => [{title: String(chain.name).toUpperCase(), href: `/${chain.name}`}, moduleName.value])
</script>
<template>
  <div class="d-flex flex-rows align-center">
    <span class="text-h5 mr-3">{{ moduleName }}</span>
    <v-icon icon="mdi-dots-vertical"  />
    <VBreadcrumbs :items="items">
        <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
    </VBreadcrumbs>
  </div>
</template>