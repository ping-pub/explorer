<script setup lang="ts">
interface Props {
  collapsed?: boolean
  noActions?: boolean
  actionCollapsed?: boolean
  actionRefresh?: boolean
  actionRemove?: boolean
  title?: string
}

interface Emit {
  (e: 'collapsed', isContentCollapsed: boolean): void
  (e: 'refresh', hideOverlay: () => void): void
  (e: 'trash'): void
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  noActions: false,
  actionCollapsed: false,
  actionRefresh: false,
  actionRemove: false,
  title: undefined,
})

const emit = defineEmits<Emit>()

// inherit Attribute make false
defineOptions({
  inheritAttrs: false,
})

const isContentCollapsed = ref(props.collapsed)
const isCardRemoved = ref(false)
const isOverlayVisible = ref(false)

// hiding overlay
const hideOverlay = () => {
  isOverlayVisible.value = false
}

// trigger collapse
const triggerCollapse = () => {
  isContentCollapsed.value = !isContentCollapsed.value
  emit('collapsed', isContentCollapsed.value)
}

// trigger refresh
const triggerRefresh = () => {
  isOverlayVisible.value = true
  emit('refresh', hideOverlay)
}

// trigger removal
const triggeredRemove = () => {
  isCardRemoved.value = true
  emit('trash')
}
</script>

<template>
  <VExpandTransition>
    <!-- TODO remove div when transition work with v-card components: https://github.com/vuetifyjs/vuetify/issues/15111 -->
    <div v-if="!isCardRemoved">
      <VCard v-bind="$attrs">
        <VCardItem>
          <VCardTitle v-if="props.title || $slots.title">
            <!-- 👉 Title slot and prop -->
            <slot name="title">
              {{ props.title }}
            </slot>
          </VCardTitle>

          <template #append>
            <!-- 👉 Before actions slot -->
            <div>
              <slot name="before-actions" />

              <!-- SECTION Actions buttons -->

              <!-- 👉 Collapse button -->
              <IconBtn
                v-if="(!(actionRemove || actionRefresh) || actionCollapsed) && !noActions"
                @click="triggerCollapse"
              >
                <VIcon
                  size="20"
                  icon="mdi-chevron-up"
                  :style="{ transform: isContentCollapsed ? 'rotate(-180deg)' : null }"
                  style="transition-duration: 0.28s;"
                />
              </IconBtn>

              <!-- 👉 Overlay button -->
              <IconBtn
                v-if="(!(actionRemove || actionCollapsed) || actionRefresh) && !noActions"
                @click="triggerRefresh"
              >
                <VIcon
                  size="20"
                  icon="mdi-refresh"
                />
              </IconBtn>

              <!-- 👉 Close button -->
              <IconBtn
                v-if="(!(actionRefresh || actionCollapsed) || actionRemove) && !noActions"
                @click="triggeredRemove"
              >
                <VIcon
                  size="20"
                  icon="mdi-close"
                />
              </IconBtn>
            </div>
          <!-- !SECTION -->
          </template>
        </VCardItem>

        <!-- 👉 card content -->
        <VExpandTransition>
          <div
            v-show="!isContentCollapsed"
            class="v-card-content"
          >
            <slot />
          </div>
        </VExpandTransition>

        <!-- 👉 Overlay -->
        <VOverlay
          v-model="isOverlayVisible"
          contained
          persistent
          class="align-center justify-center"
        >
          <VProgressCircular indeterminate />
        </VOverlay>
      </VCard>
    </div>
  </VExpandTransition>
</template>

<style lang="scss">
.v-card-item {
  +.v-card-content {
    .v-card-text:first-child {
      padding-block-start: 0;
    }
  }
}
</style>
