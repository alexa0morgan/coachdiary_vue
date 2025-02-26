<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { get, patch, put } from '@/utils'

onMounted(async () => {
  await getData()
})
const currentName = ref('')
const currentEmail = ref('')
const name = ref('')
const email = ref('')

async function getData() {
  try {
    const response = await get('/api/profile/')
    if (response.ok) {
      const data = await response.json()

      currentName.value = data.name
      currentEmail.value = data.email
      name.value = currentName.value
      email.value = currentEmail.value
    }
  } catch {
    alert('Ошибка доступа к данным')
  }
}

async function patchName() {
  if (isSetNameButtonDisabled.value) {
    return
  }

  try {
    const response = await patch('/api/profile/', { name: name.value })
    if (response.ok) {
      await getData()
    }
  } catch {
    alert('Произошла ошибка, попробуйте еще раз')
  }
}

async function patchEmail() {
  if (isSetEmailButtonDisabled.value) {
    return
  }

  try {
    const response = await patch('/api/profile/', { email: email.value })
    if (response.ok) {
      await getData()
    }
  } catch {
    alert('Произошла ошибка, попробуйте еще раз')
  }
}


async function putPassword() {
  if (isSetPasswordButtonDisabled.value) {
    return
  }

  try {
    const requestData = {
      new_password: newPassword.value,
      confirm_new_password: passwordConfirmation.value,
      current_password: password.value
    }
    const response = await put('/api/profile/', requestData)
    if (response.ok) {
      password.value = ''
      newPassword.value = ''
      passwordConfirmation.value = ''
      alert('Пароль успешно обновлен')
    }
  } catch {
    alert('Произошла ошибка обновления пароля, попробуйте позже')
  }
}

const isSetNameButtonDisabled = computed(() => {
  return name.value?.trim() === currentName.value || name.value?.trim().length === 0 || !name.value
})
const isSetEmailButtonDisabled = computed(() => {
  return email.value?.trim() === currentEmail.value || email.value?.trim().length === 0
})
const password = ref('')
const newPassword = ref('')
const passwordConfirmation = ref('')
const isSetPasswordButtonDisabled = computed(() => {
  return !(password.value?.trim().length && newPassword.value?.trim().length && newPassword.value?.trim() === passwordConfirmation.value?.trim())
})

const passwordType = ref<'password' | 'text'>('password')
const newPasswordType = ref<'password' | 'text'>('password')
const passwordConfirmationType = ref<'password' | 'text'>('password')

</script>

<template>
  <div class="main">
    <div class="container rounded-lg">
      <div class="text">
        Смена имени и почты
      </div>
      <form class="text-field mb-4" @submit.prevent="patchName">
        <v-text-field
          v-model="name"
          clearable
          persistent-clear
          label="Полное имя" />
        <v-btn
          :disabled="isSetNameButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit" />
      </form>
      <form class="text-field" @submit.prevent="patchEmail">
        <v-text-field
          v-model="email"
          clearable
          persistent-clear
          label="Почта"
          type="email" />
        <v-btn
          :disabled="isSetEmailButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit" />
      </form>
    </div>
    <div class="container rounded-lg">
      <div class="text">Смена пароля</div>
      <form class="text-field" @submit.prevent="putPassword">
        <v-text-field
          v-model="password"
          :append-inner-icon="password ? 'mdi-eye' : undefined"
          :type="passwordType"
          clearable
          label="Старый пароль"
          persistent-clear
          @click:append-inner="passwordType = passwordType === 'password' ? 'text' : 'password'"
        />

        <v-text-field
          v-model="newPassword"
          :append-inner-icon="newPassword ? 'mdi-eye' : undefined"
          :type="newPasswordType"
          clearable
          label="Новый пароль"
          persistent-clear
          @click:append-inner="newPasswordType = newPasswordType === 'password' ? 'text' : 'password'"
        />
        <v-text-field
          v-model="passwordConfirmation"
          :append-inner-icon="passwordConfirmation ? 'mdi-eye' : undefined"
          :type="passwordConfirmationType"
          clearable
          label="Проверка пароля"
          persistent-clear
          @click:append-inner="passwordConfirmationType = passwordConfirmationType === 'password' ? 'text' : 'password'"
        />
        <v-btn
          :disabled="isSetPasswordButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit" />
      </form>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin: 20px 0;
}

.container {
  width: 100%;
  max-width: 800px;
  background: rgb(var(--v-theme-surface));
  padding: 50px 80px;
  text-align: center;
}

.text-field {
  display: grid;
  gap: 10px;
}


.text {
  font-size: 24px;
  color: black;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
}

.button {
  justify-self: flex-end;
}

@media (max-width: 800px) {
  .main {
    margin-top: 0;
  }

  .container {
    background: transparent;
    padding: 20px;
  }
}
</style>