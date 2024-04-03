<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
const display = ref(useDisplay())
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title v-if="display.smAndUp">Дневник тренера</v-app-bar-title>

    <template #append>
      <v-btn variant="text" href="/#AboutSite">О сайте</v-btn>
      <v-btn variant="text" href="/#Capabilities">Возможности</v-btn>
      <v-btn variant="text" href="/#AboutUs">О нас</v-btn>
      <v-btn variant="flat" :to="{name: 'login'}" rounded>Войти</v-btn>
    </template>
  </v-app-bar>

</template>

<style scoped>

</style>