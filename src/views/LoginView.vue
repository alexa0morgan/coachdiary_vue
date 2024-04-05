<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">

import AppBar from '@/components/AppBar.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const isSendButtonDisabled = computed(() => {
  return !email.value?.trim().length || !password.value?.length
})

async function postLogin() {
  try {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE + '/api/signin', {
      method: 'post',
      body: JSON.stringify({ email: email.value, password: password.value })
    }).then(value => value.json())
    if (true) {
      router.push({ name: 'app' })
    }
  } catch {
    alert("Произошла ошибка во время входа, попробуйте еще раз")
  }
}
</script>

<template>
  <AppBar />
  <v-main class="page">
    <div class="container rounded-lg">
      <div class="text">Вход в систему</div>
      <div class="border-container">
        <v-text-field
          variant="outlined"
          label="Почта"
          placeholder="example@example.com"
          clearable
          v-model="email"
        />
        <v-text-field
          variant="outlined"
          label="Пароль"
          type="password"
          clearable
          v-model="password"
        />
        <v-btn text="Войти" rounded @click="postLogin" :disabled="isSendButtonDisabled" />
      </div>
      <div>
        <v-btn text="Регистрация" variant="text" size="small" />
        <v-btn text="Восстановление пароля" variant="text" size="small" />
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
  padding: 50px 80px 100px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-another-surface));
}

.text {
  font-size: 24px;
  color: black;
}

.border-container {
  border-bottom: 2px solid rgb(var(--v-another-surface));
  border-top: 2px solid rgb(var(--v-another-surface));
  margin: 20px 0;
  padding: 20px 15px;
}

.container :deep(.v-btn__content) {
  font-weight: normal;
}

@media (max-width: 800px) {
  .container {
    background: transparent;
    border: none;
    padding: 0;
  }
}

</style>