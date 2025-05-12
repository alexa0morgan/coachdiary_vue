<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { get, getErrorMessage, patch, put } from '@/utils';
import { toast } from 'vue-sonner';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const currentFirstName = ref('');
const currentLastName = ref('');
const currentPatronymic = ref('');
const currentEmail = ref('');

const firstName = ref('');
const lastName = ref('');
const patronymic = ref('');
const email = ref('');
const password = ref('');
const newPassword = ref('');
const passwordConfirmation = ref('');

const passwordType = ref<'password' | 'text'>('password');
const newPasswordType = ref<'password' | 'text'>('password');
const passwordConfirmationType = ref<'password' | 'text'>('password');

const isSetNameButtonDisabled = computed(() => {
  return (
    (firstName.value?.trim() === currentFirstName.value &&
      lastName.value?.trim() === currentLastName.value &&
      patronymic.value?.trim() === currentPatronymic.value) ||
    firstName.value?.trim().length === 0 ||
    !firstName.value ||
    lastName.value?.trim().length === 0 ||
    !lastName.value
  );
});

const isSetEmailButtonDisabled = computed(() => {
  return email.value?.trim() === currentEmail.value || email.value?.trim().length === 0;
});

const isSetPasswordButtonDisabled = computed(() => {
  return !(
    password.value?.trim().length &&
    newPassword.value?.trim().length &&
    newPassword.value?.trim() === passwordConfirmation.value?.trim()
  );
});

async function getData() {
  try {
    const response = await get('/api/profile/');
    if (response.ok) {
      const data = await response.json();

      currentFirstName.value = data.first_name;
      currentLastName.value = data.last_name;
      currentPatronymic.value = data.patronymic;
      currentEmail.value = data.email;
      firstName.value = currentFirstName.value;
      lastName.value = currentLastName.value;
      patronymic.value = currentPatronymic.value;
      email.value = currentEmail.value;
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз');
  }
}

async function patchName() {
  if (isSetNameButtonDisabled.value) {
    return;
  }

  try {
    const response = await patch('/api/profile/change_details/', {
      first_name: firstName.value,
      last_name: lastName.value,
      patronymic: patronymic.value ?? '',
    });
    if (response.ok) {
      await getData();
      toast.success('Имя успешно изменено');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function patchEmail() {
  if (isSetEmailButtonDisabled.value) {
    return;
  }

  try {
    const response = await patch('/api/profile/change_email/', {
      email: email.value,
    });
    if (response.ok) {
      await getData();
      toast.success('Почта успешно изменена');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function putPassword() {
  if (isSetPasswordButtonDisabled.value) {
    return;
  }

  try {
    const requestData = {
      new_password: newPassword.value,
      confirm_new_password: passwordConfirmation.value,
      current_password: password.value,
    };
    const response = await put('/api/profile/change_password/', requestData);
    if (response.ok) {
      password.value = '';
      newPassword.value = '';
      passwordConfirmation.value = '';
      toast.success('Пароль успешно изменен');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="main">
    <div class="container rounded-lg">
      <div class="text">Смена имени и почты</div>
      <form class="text-field mb-4" @submit.prevent="patchName">
        <div class="text-field-fio">
          <v-text-field
            v-model="firstName"
            :readonly="userStore.isStudent"
            :clearable="!userStore.isStudent"
            persistent-clear
            label="Имя"
          />
          <v-text-field
            v-model="lastName"
            :readonly="userStore.isStudent"
            :clearable="!userStore.isStudent"
            persistent-clear
            label="Фамилия"
          />
          <v-text-field
            v-model="patronymic"
            :readonly="userStore.isStudent"
            :clearable="!userStore.isStudent"
            persistent-clear
            label="Отчество"
          />
        </div>
        <v-btn
          v-if="!userStore.isStudent"
          :disabled="isSetNameButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit"
        />
      </form>
      <form class="text-field" @submit.prevent="patchEmail">
        <v-text-field v-model="email" clearable persistent-clear label="Почта" type="email" />
        <v-btn
          :disabled="isSetEmailButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit"
        />
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
          @click:append-inner="
            newPasswordType = newPasswordType === 'password' ? 'text' : 'password'
          "
        />
        <v-text-field
          v-model="passwordConfirmation"
          :append-inner-icon="passwordConfirmation ? 'mdi-eye' : undefined"
          :type="passwordConfirmationType"
          clearable
          label="Проверка пароля"
          persistent-clear
          @click:append-inner="
            passwordConfirmationType = passwordConfirmationType === 'password' ? 'text' : 'password'
          "
        />
        <v-btn
          :disabled="isSetPasswordButtonDisabled"
          class="button"
          rounded
          text="Изменить"
          type="submit"
        />
      </form>
    </div>
    <div class="container rounded-lg">
      <div class="text">Выйти из аккаунта</div>
      <v-btn rounded variant="flat" @click="userStore.logout">Выйти</v-btn>
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

.text-field-fio {
  display: flex;
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

  .text-field-fio {
    flex-direction: column;
  }
}
</style>
