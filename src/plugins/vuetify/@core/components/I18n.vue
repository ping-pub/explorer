<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { defineEmits, ref, watch } from 'vue'
import type { Anchor } from 'vuetify/lib/components';
import type { I18nLanguage } from '@layouts/types';

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
});

const emit = defineEmits<{
  (e: 'change', id: string): void;
}>();

interface Props {
  languages: I18nLanguage[];
  location?: Anchor;
}

let locale = ref(useI18n({ useScope: 'global' }).locale)
watch(locale, (val: string) => {
  document.documentElement.setAttribute('lang', val as string);
});

let currentLang = ref(localStorage.getItem('lang') || 'en');

function changeLang(lang: string){
  locale.value = lang
  currentLang.value = lang
  emit('change', lang)
}
</script>

<template>
  <div 
    class="dropdown"
    :class="currentLang === 'ar'?'dropdown-right': 'dropdown-bottom dropdown-end'"
   >
    <label tabindex="0" class="btn btn-ghost btn-circle btn-sm mx-1">
      <Icon icon="mdi-translate" class="text-2xl" />
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
    >
      <li v-for="lang in props.languages" :key="lang.i18nLang">
        <a
          class="hover:bg-base-content"
          :class="{ 'text-primary': currentLang === lang.i18nLang }"
          @click="changeLang(lang.i18nLang)"
          >{{ lang.label }}</a
        >
      </li>
    </ul>
  </div>
</template>
