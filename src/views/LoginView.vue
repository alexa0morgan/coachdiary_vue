<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get, getErrorMessage, post } from '@/utils'
import { toast } from 'vue-sonner'
import PageFooter from '@/components/PageFooter.vue'
import { useUserStore } from '@/stores/user'

const pageType = ref<'signIn' | 'signUp' | 'restore' | 'studentSignUp'>('signIn')
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const privacyPolicy = ref(false)
const firstName = ref('')
const lastName = ref('')
const patronymic = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const passwordType = ref<'password' | 'text'>('password')
const passwordConfirmationType = ref<'password' | 'text'>('password')

const isLoading = ref(false)
const invitationData = ref(null)
const invitationCode = ref('')

const isSendButtonDisabled = computed(() => {
  if (!/.@./.test(email.value)) {
    return true
  }
  if (pageType.value === 'signIn') {
    return !password.value?.length
  }
  if (pageType.value === 'signUp') {
    return (
      !password.value?.length ||
      !firstName.value?.length ||
      !lastName.value?.length ||
      !passwordConfirmation.value?.length ||
      password.value !== passwordConfirmation.value ||
      !privacyPolicy.value
    )
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
      return 'Войти'
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

async function sendData() {
  if (isSendButtonDisabled.value || isLoading.value) {
    return
  }
  isLoading.value = true
  try {
    let response
    if (pageType.value === 'signIn') {
      response = await signIn()
    } else if (pageType.value === 'signUp') {
      response = await signUp()
    } else if (pageType.value === 'restore') {
      response = await restore()
    } else if (pageType.value === 'studentSignUp') {
      response = await studentSignUp()
    }
    if (response?.status === 'error' || response?.статус === 'ошибка') {
      toast.error(getErrorMessage(response))
    }
  } catch (e) {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз')
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

async function signIn() {
  const requestData = { email: email.value, password: password.value }
  const response = await post('/api/login/', requestData)
  if (response.ok) {
    await userStore.login()
    await router.push({ name: 'app' })
    return response.json()
  }
}

async function signUp() {
  let url = '/api/create-user/'

  const requestData = {
    email: email.value,
    password: password.value,
    confirm_password: passwordConfirmation.value,
    first_name: firstName.value,
    last_name: lastName.value,
    patronymic: patronymic.value,
    invite_code: ''
  }

  if (invitationCode.value) {
    url = `/api/create-user/from-invitation/`
    requestData.invite_code = invitationCode.value
  }

  const response = await post(url, requestData)

  if (response.ok) {
    pageType.value = 'signIn'
    email.value = ''
    password.value = ''
    firstName.value = ''
    lastName.value = ''
    patronymic.value = ''
    passwordConfirmation.value = ''
    invitationCode.value = ''
    toast.success('Регистрация успешна. Проверьте вашу почту для подтверждения аккаунта.')
  } else {
    return response.json()
  }
}

async function studentSignUp() {
  pageType.value = 'signUp'
  try {
    const response = await get(`/api/create-user/from-invitation/${invitationCode.value}/`)
    if (response.ok) {
      const data = await response.json()
      invitationData.value = data
      firstName.value = data.student.first_name
      lastName.value = data.student.last_name
      patronymic.value = data.student.patronymic
    } else {
      toast.error(getErrorMessage(await response.json()))
      invitationCode.value = ''
      await router.push({ name: 'login' })
      pageType.value = 'signIn'
    }
  } catch {
    toast.error('Ошибка при получении данных приглашения')
  }
}

async function restore() {
  alert('К сожалению, данная функция еще не доступна')
}

onMounted(async () => {
  if (route.params.token) {
    invitationCode.value = route.params.token as string
    await studentSignUp()
  }
})
</script>

<template>
  <div class="page">
    <div class="container rounded-lg">
      <div class="text">{{ title }}</div>
      <form class="border-container" @submit.prevent="sendData">
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="lastName"
          :disabled="isLoading || !!invitationCode"
          clearable
          label="Фамилия"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="firstName"
          :disabled="isLoading || !!invitationCode"
          clearable
          label="Имя"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType === 'signUp'"
          v-model="patronymic"
          :disabled="isLoading || !!invitationCode"
          clearable
          label="Отчество"
          persistent-clear
          variant="outlined"
        />
        <v-text-field
          v-if="pageType !== 'studentSignUp'"
          v-model="email"
          :disabled="isLoading"
          clearable
          label="Почта"
          persistent-clear
          placeholder="example@example.com"
          variant="outlined"
        />
        <v-text-field
          v-if="pageType !== 'restore' && pageType !== 'studentSignUp'"
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
          :append-inner-icon="passwordConfirmation ? 'mdi-eye' : undefined"
          :disabled="isLoading"
          :type="passwordConfirmationType"
          clearable
          label="Повторите пароль"
          persistent-clear
          persistent-crear
          variant="outlined"
          @click:append-inner="
            passwordConfirmationType = passwordConfirmationType === 'password' ? 'text' : 'password'
          "
        />

        <v-text-field
          v-if="pageType === 'studentSignUp'"
          v-model="invitationCode"
          :disabled="isLoading"
          clearable
          label="Код приглашения"
          persistent-clear
          variant="outlined"
        />

        <v-checkbox v-if="pageType === 'signUp'" v-model="privacyPolicy">
          <template #label>
            <span>
              Я соглашаюсь с
              <RouterLink :to="{ name: 'privacy-policy' }" target="_blank">
                политикой в отношении персональных данных
              </RouterLink>
            </span>
          </template>
        </v-checkbox>

        <v-btn
          :disabled="isSendButtonDisabled || isLoading"
          :text="buttonText"
          class="button"
          rounded
          type="submit"
        />
      </form>
      <div v-if="pageType === 'signIn'">
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Регистрация"
          variant="text"
          @click="pageType = 'signUp'"
        />
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Восстановление пароля"
          variant="text"
          @click="pageType = 'restore'"
        />
        <v-btn
          :disabled="isLoading"
          size="small"
          text="Использовать код приглашения"
          variant="text"
          @click="pageType = 'studentSignUp'"
        />
      </div>
      <v-btn
        v-else
        :disabled="isLoading"
        size="small"
        text="Вернуться на страницу входа"
        variant="text"
        @click="
          pageType = 'signIn'
          invitationCode = ''
        "
      />
    </div>
  </div>
  <PageFooter />
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

.user-type {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px;
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
