<script lang="ts" setup>

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { post } from '@/utils'

const pageType = ref<'signIn' | 'signUp' | 'restore'>('signIn')
const router = useRouter()
const userStore = useUserStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const passwordType = ref<'password' | 'text'>('password')

const isSendButtonDisabled = computed(() => {
  if (!/.@./.test(email.value)) {
    return true
  }
  if (pageType.value === 'signIn') {
    return !password.value?.length
  }
  if (pageType.value === 'signUp') {
    return !password.value?.length || !name.value?.length ||
      !passwordConfirmation.value?.length || password.value !== passwordConfirmation.value
  }
  return false
})

const title = computed(() => {
  switch (pageType.value) {
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
  switch (pageType.value) {
    case 'signUp':
      return 'Зарегистрироваться'
    case 'restore':
      return 'Восстановить пароль'
    case 'signIn':
    default:
      return 'Войти'
  }
})

const isLoading = ref(false)

async function sendData() {
  isLoading.value = true
  try {
    let response
    if (pageType.value === 'signIn') {
      response = await signIn()
    } else if (pageType.value === 'signUp') {
      response = await signUp()
    } else if (pageType.value === 'restore') {
      response = await restore()
    }
    if (response?.status === 'error') {
      alert(response.details)
    }
  } catch {
    alert('Произошла ошибка во время отправки данных, попробуйте еще раз')
  } finally {
    isLoading.value = false
  }
}

async function signIn() {
  const requestData = { email: email.value, password: password.value }

  const response = await post('/api/login/', requestData)

  if (response.ok) {
    userStore.login()
    router.push({ name: 'app' })
  } else {
    return response.json()
  }
}

async function signUp() {
  const requestData = {
    email: email.value,
    password: password.value,
    confirm_password: passwordConfirmation.value,
    name: name.value
  }

  const response = await post('/api/create-user/', requestData)

  if (response.ok) {
    pageType.value = 'signIn'
    email.value = ''
    password.value = ''
    name.value = ''
    passwordConfirmation.value = ''
    alert('Пользователь успешно создан')
  } else {
    return response.json()
  }

}

async function restore() {
  alert('К сожалению, данная функция еще не доступна, обратитесь по адресу временной почты поддержки: dasha2510929@yandex.ru')
}

</script>

<template>
  <div class="page">
    <div class="container rounded-lg">
      <div class="text">{{ title }}</div>
      <div class="border-container">
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="name"
          :disabled="isLoading"
          clearable
          label="Имя"
          persistent-clear
          placeholder="ФИО"
          variant="outlined"
        />
        <v-text-field
          v-model="email"
          :disabled="isLoading"
          clearable
          label="Почта"
          persistent-clear
          placeholder="example@example.com"
          variant="outlined"
        />
        <v-text-field
          v-if="pageType !== 'restore'"
          v-model="password"
          :append-inner-icon="password ? 'mdi-eye' : undefined"
          :disabled="isLoading"
          :type="passwordType"
          clearable
          label="Пароль"
          persistent-clear
          variant="outlined"
          @click:append-inner="passwordType = passwordType === 'password' ? 'text' : 'password'"
        />
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="passwordConfirmation"
          :append-inner-icon="password ? 'mdi-eye' : undefined"
          :disabled="isLoading"
          :type="passwordType"
          clearable
          label="Повторите пароль"
          persistent-clear
          variant="outlined"
          @click:append-inner="passwordType = passwordType === 'password' ? 'text' : 'password'"
        />
        <v-btn :disabled="isSendButtonDisabled || isLoading" :text="buttonText" class="button" rounded
               @click="sendData" />
      </div>
      <div v-if="pageType==='signIn'">
        <v-btn :disabled="isLoading" size="small" text="Регистрация" variant="text" @click="pageType = 'signUp'" />
        <v-btn :disabled="isLoading" size="small" text="Восстановление пароля" variant="text" @click="pageType =
        'restore'" />
      </div>
      <v-btn v-else :disabled="isLoading" size="small" text="Вернуться на страницу входа" variant="text"
             @click="pageType = 'signIn'" />
    </div>
  </div>
</template>

<style scoped>
.page {
  height: 100%;
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
  gap: 16px;
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