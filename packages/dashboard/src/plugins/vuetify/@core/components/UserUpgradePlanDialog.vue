<script setup lang="ts">
interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

interface Prop {
  isDialogVisible: boolean
}

const props = defineProps<Prop>()

defineEmits<Emit>()

const selectedPlan = ref('standard')

const plansList = [
  { text: 'Basic - $0/month', value: 'basic' },
  { text: 'Standard - $99/month', value: 'standard' },
  { text: 'Enterprise - $499/month', value: 'enterprise' },
  { text: 'Company - $999/month', value: 'company' },
]
</script>

<template>
  <!-- 👉 upgrade plan -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false)"
      />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-5">
          Upgrade Plan
        </VCardTitle>

        <VCardSubtitle>
          Choose the best plan for user.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="d-flex align-center flex-wrap flex-sm-nowrap px-15">
        <VSelect
          v-model="selectedPlan"
          label="Choose Plan"
          :items="plansList"
          item-title="text"
          item-value="value"
          density="compact"
          class="me-3"
        />
        <VBtn class="mt-3 mt-sm-0">
          Upgrade
        </VBtn>
      </VCardText>

      <VDivider class="my-3" />

      <VCardText class="px-15">
        <p class="font-weight-medium mb-2">
          User current plan is standard plan
        </p>
        <div class="d-flex justify-space-between flex-wrap">
          <div class="d-flex align-center me-3">
            <sup class="text-primary">$</sup>
            <h3 class="text-h3 font-weight-semibold text-primary">
              99
            </h3>
            <sub class="text-body-1 mt-3">/ month</sub>
          </div>
          <VBtn
            color="error"
            variant="tonal"
            class="mt-3"
          >
            Cancel Subscription
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
