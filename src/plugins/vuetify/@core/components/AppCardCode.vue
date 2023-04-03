<script lang="ts" setup>
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import type { Ref } from 'vue'
import Prism from 'vue-prism-component'

interface Props {
  title: string
  code: CodeProp
  codeLanguage?: string
  noPadding?: boolean
}

interface CodeProp {
  ts: string
  js: string
}

const props = withDefaults(defineProps<Props>(), {
  codeLanguage: 'markup',
  noPadding: false,
})

const preferredCodeLanguage = useStorage('preferredCodeLanguage', 'ts') as unknown as Ref<keyof CodeProp>

const isCodeShown = ref(false)

const { copy, copied } = useClipboard({ source: computed(() => props.code[preferredCodeLanguage.value]) })
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>{{ props.title }}</VCardTitle>
      <template #append>
        <IconBtn
          :color="isCodeShown ? 'primary' : 'default'"
          :class="isCodeShown ? '' : 'text-disabled'"
          @click="isCodeShown = !isCodeShown"
        >
          <VIcon
            size="20"
            icon="mdi-code-tags"
          />
        </IconBtn>
      </template>
    </VCardItem>
    <slot v-if="noPadding" />
    <VCardText v-else>
      <slot />
    </VCardText>
    <VExpandTransition>
      <div v-show="isCodeShown">
        <VDivider />

        <VCardText class="d-flex gap-y-3 flex-column">
          <div class="d-flex justify-end">
            <VBtnToggle
              v-model="preferredCodeLanguage"
              mandatory
              variant="outlined"
              density="compact"
            >
              <VBtn
                size="x-small"
                value="ts"
                :color="preferredCodeLanguage === 'ts' ? 'primary' : 'default'"
              >
                <VIcon
                  size="x-large"
                  icon="mdi-language-typescript"
                  :color="preferredCodeLanguage === 'ts' ? 'primary' : 'secondary'"
                />
              </VBtn>
              <VBtn
                size="x-small"
                value="js"
                :color="preferredCodeLanguage === 'js' ? 'primary' : 'default'"
              >
                <VIcon
                  size="x-large"
                  icon="mdi-language-javascript"
                  :color="preferredCodeLanguage === 'js' ? 'primary' : 'secondary'"
                />
              </VBtn>
            </VBtnToggle>
          </div>

          <div class="position-relative">
            <Prism
              :key="props.code[preferredCodeLanguage]"
              :language="props.codeLanguage"
            >
              {{ props.code[preferredCodeLanguage] }}
            </Prism>
            <IconBtn
              class="position-absolute app-card-code-copy-icon"
              color="white"
              @click="() => { copy() }"
            >
              <VIcon
                :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                size="20"
              />
            </IconBtn>
          </div>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
  border-radius: vuetify.$card-border-radius;
}

.app-card-code-copy-icon {
  inset-block-start: 1.2em;
  inset-inline-end: 0.8em;
}
</style>
