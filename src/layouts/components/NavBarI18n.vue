<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';

const i18nLangs: Array<{ label: string; i18nLang: string }> = [
    {
        label: 'English',
        i18nLang: 'en',
    },
    {
        label: '中文',
        i18nLang: 'cn',
    },
    {
        label: 'Indonesian',
        i18nLang: 'id',
    },
];

let locale = ref(useI18n({ useScope: 'global' }).locale);
watch(locale, (val) => {
    document.documentElement.setAttribute('lang', val as string);
});

let currentLang = ref(localStorage.getItem('lang') || 'en');

watch(currentLang, (val: string) => {
    document.documentElement.setAttribute('lang', val as string);
});

const handleLangChange = (lang: string) => {
    locale.value = lang;
    currentLang.value = lang;
    localStorage.setItem('lang', lang);
};
</script>

<template>
    <div
        class="dropdown"
        :class="
            currentLang === 'ar'
                ? 'dropdown-right'
                : 'dropdown-bottom dropdown-end'
        "
    >
        <label tabindex="0" class="btn btn-ghost btn-circle btn-sm mx-1">
            <Icon
                icon="mdi-translate"
                class="text-2xl text-gray-500 dark:text-gray-400"
            />
        </label>
        <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
        >
            <li v-for="lang in i18nLangs" :key="lang.i18nLang">
                <a
                    class="hover:bg-gray-100 dark:hover:bg-[#373f59]"
                    :class="{ 'text-primary': currentLang === lang.i18nLang }"
                    @click="handleLangChange(lang.i18nLang)"
                    >{{ lang.label }}</a
                >
            </li>
        </ul>
    </div>
</template>
