<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { get, patch, put } from '@/utils'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

onMounted(async () => {
  await getData()
})
const userStore = useUserStore()
const router = useRouter()
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

async function patchData() {
  try {
    const requestData = currentEmail.value === email.value ? { name: name.value } : {
      email: email.value,
      name: name.value
    }
    const response = await patch('/api/profile/', requestData)
    if (response.ok) {
      await getData()
    }
  } catch {
    alert('Произошла ошибка, попробуйте еще раз')
  }
}

async function putPassword() {
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

const isSendButtonDisabled = computed(() => {
  return (name.value?.trim() === currentName.value && email.value?.trim() === currentEmail.value) || name.value?.trim().length == 0 || email.value?.trim().length == 0
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
        Имя: <span class="non-bold-text">{{ currentName }} </span> <br />
        Почта: <span class="non-bold-text">{{ currentEmail }}</span>
      </div>
      <div class="text-fields">
        <v-text-field
          v-model="name"
          clearable
          label="Полное имя" />
        <v-text-field
          v-model="email"
          clearable
          label="Почта"
          type="email" />
        <v-btn
          :disabled="isSendButtonDisabled"
          class="button"
          rounded
          text="Сохранить"
          @click="patchData" />
      </div>
    </div>
    <div class="container rounded-lg">
      <div class="text">Смена пароля</div>
      <div class="text-fields">
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
          text="Установить"
          @click="putPassword" />
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