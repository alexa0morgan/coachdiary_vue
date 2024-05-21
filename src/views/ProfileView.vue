<script setup lang="ts">
import { computed, ref } from 'vue'

const currentName = ref('Петров Петр Петрович')
const currentEmail = ref('petr@gmail.com')

async function getData() {
  fetch('')
    .then(response => response.json())
    .then(data => {
      currentName.value = data.name
      currentEmail.value = data.email
    })
    .catch(() => {
      alert('Ошибка доступа к данным')
    })
}

const name = ref(currentName.value)
const email = ref(currentEmail.value)

async function postData() {
  try {
    const requestData = { email: email.value, name: name.value }
    const response = await fetch('', {
      method: 'post',
      body: JSON.stringify(requestData),
      headers: {
        'content-type': 'application/json'
      }
    })
    if (response.ok) {
      getData()
    } else {
      alert('Server error')
    }
  } catch {
    alert('Произошла ошибка во время входа, попробуйте еще раз')
  }
}

async function postPassword() {
  try {
    const requestData = { passwordConfirmation: passwordConfirmation.value, password: password.value }
    const response = await fetch('', {
      method: 'post',
      body: JSON.stringify(requestData),
      headers: {
        'content-type': 'application/json'
      }
    })
    if (response.ok) {
      password.value = ''
      newPassword.value = ''
      passwordConfirmation.value = ''
    } else if (response.status === 401) {
      alert('Неправильный пароль, попробуйте еще раз')
    } else {
      alert('Произошла ошибка во время входа, попробуйте еще раз')
    }
  } catch {
    alert('Произошла ошибка во время входа, попробуйте еще раз')
  }
}

const isSendButtonDisabled = computed(() => {
  return (name.value?.trim() === currentName.value && email.value?.trim() === currentEmail.value) || name.value?.trim().length == 0 || email.value?.trim().length == 0
})
const password = ref('')
const newPassword = ref('')
const passwordConfirmation = ref('')
const isSetPasswordButtonDisabled = computed(() => {
  return !(password.value?.trim().length && newPassword.value?.trim().length && newPassword.value?.trim() === passwordConfirmation.value?.trim())
})
/*getData()*/
</script>

<template>
  <div class="main">
    <div class="container rounded-lg">
      <div class="text">
        {{ currentName }} <br />
        Почта: <span class="non-bold-text">{{ currentEmail }}</span>
      </div>
      <div class="text-fields">
        <v-text-field
          clearable
          label="Полное имя"
          v-model="name" />
        <v-text-field
          clearable
          label="Почта"
          type="email"
          v-model="email" />
        <v-btn
          rounded
          text="Сохранить"
          class="button"
          :disabled="isSendButtonDisabled"
          @click="postData" />
      </div>
    </div>
    <div class="container rounded-lg">
      <div class="text">Смена пароля</div>
      <div class="text-fields">
        <v-text-field
          clearable
          type="password"
          label="Старый пароль"
          v-model="password" />
        <v-text-field
          clearable
          label="Новый пароль"
          type="password"
          v-model="newPassword" />
        <v-text-field
          clearable
          label="Проверка пароля"
          type="password"
          v-model="passwordConfirmation" />
        <v-btn
          rounded
          text="Установить"
          :disabled="isSetPasswordButtonDisabled"
          class="button"
          @click="postPassword" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 800px;
  background: rgb(var(--v-theme-surface));
  padding: 50px 80px;
  text-align: center;
}

.text-fields {
  display: grid;
  gap: 20px;
}

.text {
  font-size: 24px;
  color: black;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
}

.non-bold-text {
  font-weight: 400;
}

.button {
  justify-self: end;
}

@media (max-width: 800px) {
  .container {
    background: transparent;
    padding: 20px;
  }
}
</style>