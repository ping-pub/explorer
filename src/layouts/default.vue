<script lang="ts" setup>
import { useSkins } from '@core/composable/useSkins';
import DefaultLayout from './components/DefaultLayout.vue';

const { layoutAttrs, injectSkinClasses } = useSkins();

injectSkinClasses();
</script>

<template>
  <DefaultLayout v-bind="layoutAttrs" />
</template>
