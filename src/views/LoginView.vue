<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">

import AppBar from '@/components/AppBar.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const router = useRouter()
const isSendButtonDisabled = computed(() => {
  return !email.value?.trim().length || !password.value?.length
})

const pageState = ref<'signIn' | 'signUp' | 'restore'>('signIn')
const title = computed(() => {
  switch (pageState.value) {
    case 'signUp':
      return 'Регистрация'
    case 'restore':
      return 'Восстановление пароля'
    case 'signIn':
    default:
      return 'Вход в систему'

  }
})
const buttonText = computed(() => {
  switch (pageState.value) {
    case 'signUp':
      return 'Зарегистрироваться'
    case 'restore':
      return 'Восстановить пароль'
    case 'signIn':
    default:
      return 'Войти'
  }
})

async function postLogin() {
  try {
    const requestData = { email: email.value, password: password.value }

    const response = await fetch(import.meta.env.VITE_APP_API_BASE + '/api/login/', {
      method: 'post',
      body: JSON.stringify(requestData),
      headers: {
        'content-type': 'application/json'
      }
    })

    if (response.ok) {
      router.push({ name: 'app' })
    } else if (response.status === 401) {
      alert('Неправильный логин и/или пароль, попробуйте еще раз')
    } else {
      throw new Error('Server error')
    }
  } catch {
    alert('Произошла ошибка во время входа, попробуйте еще раз')
  }
}

</script>

<template>
  <AppBar />
  <v-main class="page">
    <div class="container rounded-lg">
      <div class="text">{{ title }}</div>
      <div class="border-container">
        <v-text-field
          variant="outlined"
          label="Почта"
          placeholder="example@example.com"
          clearable
          v-model="email"
        />
        <v-text-field
          v-if="pageState !== 'restore'"
          variant="outlined"
          label="Пароль"
          type="password"
          clearable
          v-model="password"
        />
        <v-text-field
          v-if="pageState === 'signUp'"
          variant="outlined"
          label="Повторите пароль"
          type="password"
          clearable
          v-model="passwordConfirmation"
        />
        <v-btn :text="buttonText" rounded @click="postLogin" :disabled="isSendButtonDisabled" class="button"/>
      </div>
      <div v-if="pageState==='signIn'">
        <v-btn text="Регистрация" variant="text" size="small" @click="pageState = 'signUp'" />
        <v-btn text="Восстановление пароля" variant="text" size="small" @click="pageState = 'restore'" />
      </div>
      <v-btn v-else text="Вернуться на страницу входа" variant="text" size="small" @click="pageState = 'signIn'" />
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
  width: 100%;
  text-align: center;
  align-items: stretch;
  color: rgb(var(--v-theme-primary));
  padding: 50px 80px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-another-surface));
}

.container :deep(.v-btn__content) {
  font-weight: normal;
}

.text {
  font-size: 24px;
  color: black;
}

.border-container {
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgb(var(--v-another-surface));
  border-top: 2px solid rgb(var(--v-another-surface));
  margin: 20px 0;
  padding: 20px 15px;
  gap:16px;
}

.button {
  align-self: center;
}

@media (max-width: 800px) {
  .container {
    background: transparent;
    border: none;
    padding: 0;
  }
}

</style>