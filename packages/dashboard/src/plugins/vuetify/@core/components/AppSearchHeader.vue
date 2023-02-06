<script setup lang="ts">
import AppSearchHeaderBgDark from '@images/pages/app-search-header-bg-dark.png'
import AppSearchHeaderBgLight from '@images/pages/app-search-header-bg-light.png'

import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'

interface Props {
  title?: string
  subtitle?: string
  customClass?: string
}

const props = defineProps<Props>()

defineOptions({
  inheritAttrs: false,
})

const themeBackgroundImg = useGenerateImageVariant(AppSearchHeaderBgLight, AppSearchHeaderBgDark)
</script>

<template>
  <!-- 👉 Search Banner  -->
  <VCard
    flat
    class="text-center search-header"
    :class="props.customClass"
    :style="`background: url(${themeBackgroundImg});`"
  >
    <VCardText>
      <h5 class="text-h5 font-weight-semibold text-primary mb-2">
        {{ props.title }}
      </h5>
      <p>{{ props.subtitle }}</p>

      <!-- 👉 Search Input -->
      <VTextField
        v-bind="$attrs"
        placeholder="Ask a question.."
        class="search-header-input mx-auto my-6"
      >
        <template #prepend-inner>
          <VIcon
            icon="mdi-magnify"
            size="23"
          />
        </template>
      </VTextField>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.search-header {
  padding: 4rem !important;
  background-size: cover !important;
}

// search input
.search-header-input {
  border-radius: 0.5rem !important;
  background-color: rgb(var(--v-theme-surface));
  max-inline-size: 32.125rem;

  .v-field__prepend-inner {
    i {
      inset-block-start: 3px !important;
    }
  }
}

@media (max-width: 37.5rem) {
  .search-header {
    padding: 1.5rem !important;
  }
}
</style>
