<script lang="ts" setup>

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
  if (route.path.startsWith('/app')) return { name: 'my-diary' }
  return { name: 'home' }
})

const plusButtonLink = computed(() => {
  if (route.name === 'my-diary') {
    return { name: 'create-student' }
  } else if (route.name === 'my-standards') {
    return { name: 'create-standard' }
  }
  return ''
})

async function logout() {
  await userStore.logout()
  router.push({ name: 'login' })
}

const mobileTitle = computed(() => route.meta.mobileTitle)

</script>

<template>
  <v-navigation-drawer v-if="!smAndUp" v-model="isMenuOpen">
    <v-list-item :key="logoLink.name" :to="logoLink" title="Дневник Тренера" />
    <v-divider class="mb-2" color="rgb(var(--v-theme-primary-darken-1))" />
    <template v-if="!isLoggedInView">
      <v-list-item href="/#Capabilities" link title="Возможности" />
      <v-list-item :to="{name: 'about-site'}" link title="О сайте" />
      <v-list-item :to="{name: 'about-us'}" link title="О нас" />
    </template>
    <template v-else>
      <v-list-item :to="{name: 'my-diary'}" link title="Дневник" />
      <v-list-item :to="{name: 'my-standards'}" link title="Мои нормативы" />
      <v-list-item :to="{name: 'profile'}" link title="Профиль" />
      <v-divider class="mb-2 mt-2" color="rgb(var(--v-theme-primary-darken-1))" />
      <v-list-item link title="Выход" @click="logout" />
    </template>
  </v-navigation-drawer>

  <v-app-bar :elevation="2">
    <v-app-bar-title>
      <router-link v-if="smAndUp" :to="logoLink" class="title">
        <img alt="logo" class="icon" src="/whistle.svg" />
        <span class="text-title">Дневник тренера</span>
      </router-link>
      <div v-else class="text-center mr-4 mobile-title">{{ mobileTitle }}</div>
    </v-app-bar-title>

    <template #prepend>
      <v-btn v-if="!smAndUp" icon="mdi-menu" @click="isMenuOpen = true" />
    </template>

    <template #append>

      <div class="container">
        <template v-if="!isLoggedInView">

          <template v-if="smAndUp">
            <v-btn href="/#Capabilities" variant="text">Возможности</v-btn>
            <v-btn :to="{name: 'about-site'}" variant="text">О сайте</v-btn>
            <v-btn :to="{name: 'about-us'}" variant="text">О нас</v-btn>
          </template>

          <v-btn v-if="!isLoginPage" :to="{name: 'login'}" rounded variant="flat">Войти</v-btn>
        </template>

        <template v-else-if="smAndUp">
          <v-btn :to="{name: 'my-diary'}" variant="text">Дневник</v-btn>
          <v-btn :to="{name: 'my-standards'}" variant="text">Мои нормативы</v-btn>
          <v-btn :to="{name: 'profile'}" variant="text">Профиль</v-btn>
          <v-btn rounded variant="flat" @click="logout">Выйти</v-btn>
        </template>

        <template v-else-if="!smAndUp && plusButtonLink">
          <v-btn :to="plusButtonLink" icon="mdi-plus" size="small" variant="outlined" />
        </template>
      </div>

    </template>
  </v-app-bar>
</template>

<style scoped>
.title {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.mobile-title {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}

.container {
  display: flex;
  gap: 10px;
}

.icon {
  height: 32px;
}

@media (max-width: 760px) {
  .text-title {
    display: none;
  }
}

</style>