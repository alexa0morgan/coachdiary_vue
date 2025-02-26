<script lang="ts" setup>
import { RouterView, useRoute } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import { useUserStore } from '@/stores/user'
import BottomAppBar from '@/components/BottomAppBar.vue'
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

useUserStore().fetchProfile()

const { smAndUp } = useDisplay()
const route = useRoute()
const isLoggedInView = computed(() => route.path.startsWith('/app'))
</script>

<template>
  <v-app>
    <AppBar />
    <v-main>
      <RouterView />
    </v-main>
    <BottomAppBar v-if="!smAndUp && isLoggedInView" />
  </v-app>
</template>

<style scoped>

</style>
