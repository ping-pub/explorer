<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  stats: string
  change: number
  image: string
  imgWidth: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const isPositive = controlledComputed(() => props.change, () => Math.sign(props.change) === 1)
</script>

<template>
  <VCard>
    <VCardText>
      <h6 class="text-base font-weight-semibold mb-2">
        {{ props.title }}
      </h6>
      <VChip
        v-if="props.subtitle"
        size="x-small"
        :color="props.color"
        class="mb-5"
      >
        {{ props.subtitle }}
      </VChip>

      <div class="d-flex align-center flex-wrap">
        <h5 class="text-h5 me-2">
          {{ props.stats }}
        </h5>
        <span
          class="text-caption"
          :class="isPositive ? 'text-success' : 'text-error'"
        >
          {{ isPositive ? `+${props.change}` : props.change }}%
        </span>
      </div>
    </VCardText>

    <VSpacer />

    <div class="illustrator-img">
      <VImg
        v-if="props.image"
        :src="props.image"
        :width="props.imgWidth"
      />
    </div>
  </VCard>
</template>

<style lang="scss">
.illustrator-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 5%;
}
</style>
