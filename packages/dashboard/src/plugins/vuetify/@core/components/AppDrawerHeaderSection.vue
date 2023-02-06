<script setup lang="ts">
interface Props {
  title: string
}
interface Emit {
  (e: 'cancel', el: MouseEvent): void
}
const props = defineProps<Props>()

defineEmits<Emit>()
</script>

<template>
  <div class="px-5 py-3 d-flex align-center bg-var-theme-background">
    <h3 class="font-weight-medium text-xl">
      {{ props.title }}
    </h3>
    <VSpacer />

    <slot name="beforeClose" />

    <IconBtn @click="$emit('cancel')">
      <VIcon
        size="18"
        icon="mdi-close"
      />
    </IconBtn>
  </div>
</template>
