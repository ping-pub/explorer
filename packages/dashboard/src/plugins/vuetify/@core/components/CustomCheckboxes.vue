<script lang="ts" setup>
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
  selectedCheckbox: string[]
  checkboxContent: CustomInputContent[]
  gridColumn?: GridColumn
}

interface Emit {
  (e: 'update:selectedCheckbox', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const selectedOption = ref(structuredClone(toRaw(props.selectedCheckbox)))

watch(selectedOption, () => {
  emit('update:selectedCheckbox', selectedOption.value)
})
</script>

<template>
  <VRow
    v-if="props.checkboxContent && selectedOption"
    v-model="selectedOption"
  >
    <VCol
      v-for="item in props.checkboxContent"
      :key="item.title"
      v-bind="gridColumn"
    >
      <VLabel
        class="custom-input custom-checkbox rounded cursor-pointer"
        :class="selectedOption.includes(item.value) ? 'active' : ''"
      >
        <div>
          <VCheckbox
            v-model="selectedOption"
            :value="item.value"
          />
        </div>
        <div class="flex-grow-1">
          <div class="d-flex align-center mb-1">
            <h6 class="cr-title text-base">
              {{ item.title }}
            </h6>
            <VSpacer />
            <span v-if="item.subtitle">{{ item.subtitle }}</span>
          </div>
          <p class="text-sm mb-0">
            {{ item.desc }}
          </p>
        </div>
      </VLabel>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.custom-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;

  .v-checkbox {
    margin-block-start: -0.375rem;
  }

  .cr-title {
    font-weight: 500;
  }
}
</style>
