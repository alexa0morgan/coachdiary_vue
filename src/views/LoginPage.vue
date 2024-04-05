<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">

import AppBar from '@/components/AppBar.vue'
</script>

<template>
  <AppBar />
  <v-main class="page">
    <div class="container rounded-lg">
      <div>Вход в систему</div>
      <div class="border-container">
        <v-text-field variant="outlined" label="Почта" placeholder="example@example.com"/>
        <v-text-field variant="outlined" label="Пароль" type="password"/>
        <v-btn size="large" text="Войти" rounded/>
      </div>
      <div>
        <v-btn text="Регистрация" variant="text"/>
        <v-btn text="Восстановление пароля" variant="text"/>
      </div>
    </div>
  </v-main>
</template>

<style scoped>
.page {
  display: grid;
  place-items: center;
}

.container {
  max-width: 500px;
  text-align: center;
  align-items: stretch;
  color: rgb(var(--v-theme-primary));
  padding: 20px 50px 100px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-another-surface));
  font-size: 20px;
}
</style>