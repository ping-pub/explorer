<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useThemeConfig } from '@/plugins/vuetify/@core/composable/useThemeConfig'
import { hexToRgb } from '@/plugins/vuetify/@layouts/utils'
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'
const { syncInitialLoaderTheme, syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme, isAppRtl } = useThemeConfig()

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()

onMounted(()=> {
  themeChange(false)
})
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
