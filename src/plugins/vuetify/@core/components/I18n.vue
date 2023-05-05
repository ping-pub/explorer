<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Anchor } from 'vuetify/lib/components';
import type { I18nLanguage } from '@layouts/types';

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
});

defineEmits<{
  (e: 'change', id: string): void;
}>();

interface Props {
  languages: I18nLanguage[];
  location?: Anchor;
}

const { locale } = useI18n({ useScope: 'global' });

watch(locale, (val) => {
  document.documentElement.setAttribute('lang', val as string);
});

const currentLang = ref(localStorage.getItem('lang') || 'en');
</script>

<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-circle btn-sm mx-1">
      <Icon icon="mdi-translate" class="text-2xl" />
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li v-for="lang in props.languages" :key="lang.i18nLang">
        <a
          class="hover:bg-base-content"
          :class="{ 'text-primary': currentLang === lang.i18nLang }"
          @click="
            locale = lang.i18nLang;
            $emit('change', lang.i18nLang);
          "
          >{{ lang.label }}</a
        >
      </li>
    </ul>
  </div>
</template>
