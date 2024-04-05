<script setup lang="ts">

import { useDisplay } from 'vuetify'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const { smAndUp } = useDisplay()
const isMenuOpen = ref(false)
const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')

</script>

<template>
  <v-navigation-drawer v-model="isMenuOpen" v-if="!smAndUp">
    <v-list-item title="Дневник Тренера" :to="{name: 'home'}" />
    <v-divider />
    <v-list-item link href="/#AboutSite" title="О сайте" />
    <v-list-item link href="/#Capabilities" title="Возможности" />
    <v-list-item link href="/#AboutUs" title="О нас" />
  </v-navigation-drawer>

  <v-app-bar :elevation="2">
    <v-app-bar-title>
      <router-link v-if="smAndUp" class="title" :to="{name: 'home'}">Дневник тренера</router-link>
    </v-app-bar-title>
    <template #prepend>
      <v-btn v-if="!smAndUp" icon="mdi-menu" @click="isMenuOpen = true" />
    </template>
    <template #append>
      <template v-if="smAndUp">
        <v-btn variant="text" href="/#AboutSite">О сайте</v-btn>
        <v-btn variant="text" href="/#Capabilities">Возможности</v-btn>
        <v-btn variant="text" href="/#AboutUs">О нас</v-btn>
      </template>

      <v-btn v-if="!isLoginPage" variant="flat" :to="{name: 'login'}" rounded>Войти</v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: black;
  text-decoration: none;
}
</style>