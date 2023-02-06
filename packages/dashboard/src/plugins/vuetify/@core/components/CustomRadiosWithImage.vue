<script lang="ts" setup>
import type { GridColumn } from '@core/types'

interface Props {
  selectedRadio: string
  radioContent: { bgImage: string; value: string }[]
  gridColumn?: GridColumn
}

interface Emit {
  (e: 'update:selectedRadio', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const selectedOption = ref(structuredClone(toRaw(props.selectedRadio)))

watch(selectedOption, () => {
  emit('update:selectedRadio', selectedOption.value)
})
</script>

<template>
  <VRadioGroup
    v-if="props.radioContent"
    v-model="selectedOption"
  >
    <VRow>
      <VCol
        v-for="item in props.radioContent"
        :key="item.bgImage"
        v-bind="gridColumn"
      >
        <VLabel
          class="custom-input custom-radio rounded cursor-pointer"
          :class="selectedOption === item.value ? 'active' : ''"
        >
          <img
            :src="item.bgImage"
            alt="bg-img"
            class="custom-radio-image"
          >
          <VRadio :value="item.value" />
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</template>

<style lang="scss" scoped>
.custom-radio {
  padding: 0;
  border-width: 2px;

  .custom-radio-image {
    block-size: 100%;
    inline-size: 100%;
  }

  .v-radio {
    visibility: hidden;
  }
}
</style>
