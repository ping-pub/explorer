<script setup lang="ts">
import AddAuthenticatorAppDialog from '@core/components/AddAuthenticatorAppDialog.vue'
import EnableOneTimePasswordDialog from '@core/components/EnableOneTimePasswordDialog.vue'

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
}
interface Props {
  isDialogVisible: boolean
  smsCode?: string
  authAppCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  isDialogVisible: false,
  smsCode: '',
  authAppCode: '',
})

const emit = defineEmits<Emit>()

const authMethods = [
  {
    icon: 'mdi-cog-outline',
    title: 'Authenticator Apps',
    subtitle: 'Get code from an app like Google Authenticator or Microsoft Authenticator.',
    method: 'authApp',
  },
  {
    icon: 'mdi-message-outline',
    title: 'SMS',
    subtitle: 'We will send a code via SMS if you need to use your backup login method.',
    method: 'sms',
  },
]

const selectedMethod = ref(['authApp'])
const isAuthAppDialogVisible = ref(false)
const isSmsDialogVisible = ref(false)

const openSelectedMethodDialog = () => {
  if (selectedMethod.value[0] === 'authApp') {
    isAuthAppDialogVisible.value = true
    isSmsDialogVisible.value = false
    emit('update:isDialogVisible', false)
  }
  if (selectedMethod.value[0] === 'sms') {
    isAuthAppDialogVisible.value = false
    isSmsDialogVisible.value = true
    emit('update:isDialogVisible', false)
  }
}
</script>

<template>
  <VDialog
    max-width="900"
    :model-value="props.isDialogVisible"
    @update:model-value="(val) => $emit('update:isDialogVisible', val)"
  >
    <VCard class="pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false)"
      />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Select Authentication Method
        </VCardTitle>
        <VCardSubtitle>
          You also need to select a method by which the proxy authenticates to the directory serve.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VList
          v-model:selected="selectedMethod"
          mandatory
          class="card-list auth-method-card"
          :class="$vuetify.display.xs ? 'responsive-card' : ''"
        >
          <VListItem
            v-for="item of authMethods"
            :key="item.title"
            rounded
            border
            :value="item.method"
            class="py-5 px-6 my-6"
            :class="selectedMethod[0] === item.method ? 'bg-light-primary border-primary' : 'bg-light-secondary border-secondary'"
            style="/* stylelint-disable-next-line max-empty-lines */
--v-border-opacity: 1;"
          >
            <template #prepend>
              <VIcon
                :icon="item.icon"
                size="38"
              />
            </template>

            <VListItemTitle class="text-xl font-weight-medium">
              {{ item.title }}
            </VListItemTitle>
            <p class="text-base mb-0">
              {{ item.subtitle }}
            </p>
          </VListItem>
        </VList>

        <div class="text-end">
          <VBtn @click="openSelectedMethodDialog">
            continue
            <VIcon
              end
              icon="mdi-chevron-right"
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <AddAuthenticatorAppDialog
    v-model:isDialogVisible="isAuthAppDialogVisible"
    :auth-code="props.authAppCode"
  />
  <EnableOneTimePasswordDialog
    v-model:isDialogVisible="isSmsDialogVisible"
    :mobile-number="props.smsCode"
  />
</template>

<style lang="scss">
.auth-method-card {
  &.card-list .v-list-item {
    padding-block: 20px !important;
    padding-inline: 30px !important;
  }

  &.responsive-card {
    .v-list-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;

      .v-list-item__prepend {
        svg {
          margin: 0;
        }
      }
    }
  }
}
</style>
