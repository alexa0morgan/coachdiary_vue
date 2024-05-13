<script setup lang="ts">

import { useDisplay } from 'vuetify'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { smAndUp } = useDisplay()
const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const isLoginPage = computed(() => route.name === 'login')

const isLoggedInView = computed(() => route.path.startsWith('/app'))
const logoLink = computed(() => {
  if (isLoggedInView.value) return { name: 'my-classes' }
  return { name: 'home' }
})

const plusButtonLink = computed(() => {
  if (route.name === 'my-classes') {
    return { name: 'home' }
  } else if (route.name === 'my-normatives') {
    return { name: 'home' }
  }
  return ''
})

function logout() {
/*  userStore.logout()
  router.push({name: 'login'})*/
}

const mobileTitle = computed(() => route.meta.mobileTitle)

</script>

<template>
  <v-navigation-drawer v-model="isMenuOpen" v-if="!smAndUp">
    <v-list-item title="Дневник Тренера" :to="logoLink" />
    <v-divider />
    <template v-if="!isLoggedInView">
      <v-list-item link href="/#AboutSite" title="О сайте" />
      <v-list-item link href="/#Capabilities" title="Возможности" />
      <v-list-item link href="/#AboutUs" title="О нас" />
    </template>
    <template v-else>
      <v-list-item link :to="{name: 'my-classes'}" title="Мои классы" />
      <v-list-item link :to="{name: 'my-normatives'}" title="Мои нормативы" />
      <v-list-item link :to="{name: 'profile'}" title="Профиль" />
    </template>
  </v-navigation-drawer>

  <v-app-bar :elevation="2">
    <v-app-bar-title>
      <router-link v-if="smAndUp" class="title" :to="logoLink">Дневник тренера</router-link>
      <div v-else class="text-center mr-4 mobile-title">{{ mobileTitle }}</div>
    </v-app-bar-title>

    <template #prepend>
      <v-btn v-if="!smAndUp" icon="mdi-menu" @click="isMenuOpen = true" />
    </template>

    <template #append>

      <div class="container">
        <template v-if="!isLoggedInView">

          <template v-if="smAndUp">
            <v-btn variant="text" href="/#AboutSite">О сайте</v-btn>
            <v-btn variant="text" href="/#Capabilities">Возможности</v-btn>
            <v-btn variant="text" href="/#AboutUs">О нас</v-btn>
          </template>

          <v-btn v-if="!isLoginPage" variant="flat" :to="{name: 'login'}" rounded>Войти</v-btn>
        </template>

        <template v-else-if="smAndUp">
          <v-btn variant="text" :to="{name: 'my-classes'}">Мои классы</v-btn>
          <v-btn variant="text" :to="{name: 'my-normatives'}">Мои нормативы</v-btn>
          <v-btn variant="text" :to="{name: 'profile'}">Профиль</v-btn>
          <v-btn variant="flat" rounded @click="logout">Выйти</v-btn>
        </template>

        <template v-else-if="!smAndUp && plusButtonLink">
          <v-btn variant="outlined" icon="mdi-plus" size="small" :to="plusButtonLink" />
        </template>
      </div>

    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: black;
  text-decoration: none;
}

.mobile-title {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}

.container {
  display: flex;
  gap: 10px;
}
</style>