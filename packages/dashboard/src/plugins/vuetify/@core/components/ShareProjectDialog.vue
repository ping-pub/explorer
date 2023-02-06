<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'

interface Props {
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const dialogVisibleUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

type Permission = 'Owner' | 'Can Edit' | 'Can Comment' | 'Can View'

interface Member {
  avatar: string
  name: string
  email: string
  permission: Permission
}

const membersList: Member[] = [
  {
    avatar: avatar1,
    name: 'Lester Palmer',
    email: 'jerrod98@gmail.com',
    permission: 'Can Edit',
  },
  {
    avatar: avatar2,
    name: 'Mattie Blair',
    email: 'prudence.boehm@yahoo.com',
    permission: 'Owner',
  },
  {
    avatar: avatar3,
    name: 'Marvin Wheeler',
    email: 'rumet@jujpejah.net',
    permission: 'Can Comment',
  },
  {
    avatar: avatar4,
    name: 'Nannie Ford',
    email: 'negza@nuv.io',
    permission: 'Can View',
  },
  {
    avatar: avatar5,
    name: 'Julian Murphy',
    email: 'lunebame@umdomgu.net',
    permission: 'Can Edit',
  },
  {
    avatar: avatar6,
    name: 'Sophie Gilbert',
    email: 'ha@sugit.gov',
    permission: 'Can View',
  },
  {
    avatar: avatar7,
    name: 'Chris Watkins',
    email: 'zokap@mak.org',
    permission: 'Can Comment',
  },
  {
    avatar: avatar8,
    name: 'Adelaide Nichols',
    email: 'ujinomu@jigo.com',
    permission: 'Can Edit',
  },
]
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="900"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        size="small"
        @click="emit('update:isDialogVisible', false)"
      />

      <VCardText>
        <h5 class="text-h5 text-center mb-3">
          Share Project
        </h5>
        <p class="text-sm text-center">
          Share project with a team members
        </p>

        <p class="text-xl font-weight-medium mb-2">
          Add Members
        </p>
        <VAutocomplete
          :items="membersList"
          item-title="name"
          item-value="name"
          placeholder="Add project members..."
          density="compact"
        >
          <template #item="{ props: listItemProp, item }">
            <VListItem v-bind="listItemProp">
              <template #prepend>
                <VAvatar
                  :image="item.raw.avatar"
                  size="30"
                />
              </template>
            </VListItem>
          </template>
        </VAutocomplete>

        <h6 class="text-h6 mb-4 mt-8">
          8 Members
        </h6>

        <VList class="card-list">
          <VListItem
            v-for="member in membersList"
            :key="member.name"
          >
            <template #prepend>
              <VAvatar :image="member.avatar" />
            </template>

            <VListItemTitle class="text-sm">
              {{ member.name }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ member.email }}
            </VListItemSubtitle>

            <template #append>
              <VBtn
                variant="text"
                color="default"
                :icon="$vuetify.display.xs"
              >
                <span class="d-none d-sm-block">{{ member.permission }}</span>
                <VIcon icon="mdi-chevron-down" />

                <VMenu activator="parent">
                  <VList :selected="[member.permission]">
                    <VListItem
                      v-for="(item, index) in ['Owner', 'Can Edit', 'Can Comment', 'Can View']"
                      :key="index"
                      :value="item"
                    >
                      <VListItemTitle>{{ item }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </template>
          </VListItem>
        </VList>

        <div class="d-flex justify-space-between flex-wrap gap-3 mt-6">
          <h6 class="text-sm font-weight-semibold d-flex align-start">
            <VIcon
              icon="mdi-account-group-outline"
              class="me-2"
            />
            <span>Public to Master - Pixinvent</span>
          </h6>

          <VBtn
            variant="text"
            prepend-icon="mdi-link"
          >
            Copy Project Link
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.share-project-dialog {
  .card-list {
    --v-card-list-gap: 1rem;
  }
}
</style>
