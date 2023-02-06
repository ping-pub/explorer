<script setup lang="ts">
import pixinventQr from '@images/pages/pixinvent-qr.png'

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: string): void
}
interface Props {
  authCode?: string
  isDialogVisible: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const authCode = ref(structuredClone(toRaw(props.authCode)))

const formSubmit = () => {
  if (authCode.value) {
    emit('submit', authCode.value)
    emit('update:isDialogVisible', false)
  }
}

const resetAuthCode = () => {
  authCode.value = structuredClone(toRaw(props.authCode))
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VDialog
    max-width="600"
    :model-value="props.isDialogVisible"
    @update:model-value="(val) => $emit('update:isDialogVisible', val)"
  >
    <VCard class="pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="resetAuthCode"
      />

      <VCardItem>
        <VCardTitle class="text-h5 font-weight-medium text-center">
          Add Authenticator App
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-6">
        <h6 class="text-h6 font-weight-medium mb-3">
          Authenticator Apps
        </h6>

        <p class="mb-6">
          Using an authenticator app like Google Authenticator, Microsoft Authenticator, Authy, or 1Password, scan the QR code. It will generate a 6 digit code for you to enter below.
        </p>

        <div class="my-6">
          <VImg
            width="122"
            :src="pixinventQr"
            class="mx-auto"
          />
        </div>

        <VForm @submit.prevent="() => {}">
          <VTextField
            v-model="authCode"
            name="auth-code"
            label="Enter Authentication Code"
            class="mb-4"
          />

          <div class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              color="secondary"
              variant="tonal"
              @click="resetAuthCode"
            >
              Cancel
            </VBtn>

            <VBtn
              type="submit"
              @click="formSubmit"
            >
              Continue
              <VIcon
                end
                icon="mdi-chevron-right"
                class="flip-in-rtl"
              />
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
