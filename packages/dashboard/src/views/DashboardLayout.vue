<script lang="ts" setup>
const theme = 'dark'
</script>

<template>
  <v-app :theme="theme">
    <v-navigation-drawer>...</v-navigation-drawer>
    <v-app-bar>pp
    </v-app-bar>
    <v-main>
      <v-container><router-view/></v-container>
    </v-main>
    <v-footer> footer  </v-footer>
  </v-app>
</template>
