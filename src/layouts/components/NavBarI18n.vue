<script lang="ts" setup>
import NavBarI18n from '@core/components/I18n.vue';
import { useThemeConfig } from '@core/composable/useThemeConfig';

const { isAppRtl } = useThemeConfig();

const i18nCompLanguages: Array<{ label: string; i18nLang: string }> = [
  {
    label: 'English',
    i18nLang: 'en',
  },
  {
    label: '中文',
    i18nLang: 'cn',
  },
];

const handleLangChange = (lang: string) => {
  isAppRtl.value = lang === 'ar';
  localStorage.setItem('lang', lang);
};
</script>

<template>
  <NavBarI18n :languages="i18nCompLanguages" @change="handleLangChange" />
</template>
