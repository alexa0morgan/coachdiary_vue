<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { get, getErrorMessage, patch, post, put } from '@/utils';
import { toast } from 'vue-sonner';
import { useUserStore } from '@/stores/user';
import router from '@/router';

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

const isImporting = ref(false);
const isEmailVerified = ref(true);

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
      isEmailVerified.value = data.is_email_verified;
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
      userStore.clearLocalStorage();
      await router.push({ name: 'login' });
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function exportData() {
  try {
    const response = await get('/api/teacher/export_data/');
    if (response.ok) {
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch (e) {
    toast.error('Произошла ошибка во время экспорта данных, попробуйте еще раз');
  }
}

async function importData() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.onchange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      isImporting.value = true;
      try {
        const response = await post('/api/teacher/import_data/', formData, '');
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
        } else {
          toast.error(getErrorMessage(data));
        }
      } catch (error) {
        toast.error('Произошла ошибка во время импорта данных, попробуйте еще раз');
      } finally {
        isImporting.value = false;
      }
    }
  };
  fileInput.click();
}

async function resendVerificationEmail() {
  try {
    const response = await get('/api/resend-confirmation/');
    if (response.ok) {
      toast.success('Письмо для подтверждения отправлено на вашу почту');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Не удалось отправить письмо, попробуйте позже');
  }
}

onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="main">
    <div class="container rounded-lg">
      <div class="title">
        <v-icon color="primary">mdi-account</v-icon>
        Смена имени и почты
      </div>
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
        <div class="text-field-email">
          <div v-if="!isEmailVerified" class="verify-email-block">
            <span class="verify-email-text red">Почта не подтверждена</span>
            <v-btn
              variant="text"
              size="small"
              text="Отправить письмо повторно"
              class="button-email"
              @click="resendVerificationEmail"
            />
          </div>
          <span v-else class="verify-email-text green">Почта подтверждена</span>
          <v-btn
            :disabled="isSetEmailButtonDisabled"
            class="button"
            rounded
            text="Изменить"
            type="submit"
          />
        </div>
      </form>
    </div>
    <div class="container rounded-lg">
      <div class="title">
        <v-icon color="primary">mdi-lock</v-icon>
        Смена пароля
      </div>
      <div class="text-red text">
        Внимание. После смены пароля
        <br />
        необходимо будет снова войти в аккаунт
      </div>
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
      <div class="title">
        <v-icon class="mr-2" color="primary">mdi-database-export</v-icon>
        Импорт и экспорт данных
      </div>
      <div class="text">
        Вы можете экспортировать и импортировать все свои данные в формате JSON. Это может быть
        полезно, если вы хотите перенести свои данные на другой аккаунт или поделиться ими с кем-то
      </div>
      <div class="exp-imp-buttons">
        <v-btn color="primary" variant="outlined" rounded @click="exportData">
          <v-icon left>mdi-download</v-icon>
          Экспортировать
        </v-btn>
        <v-btn color="primary" variant="outlined" rounded @click="importData">
          <v-icon left>mdi-upload</v-icon>
          Импортировать
        </v-btn>
      </div>
    </div>

    <div class="container rounded-lg">
      <div class="title">Выйти из аккаунта</div>
      <v-btn rounded variant="flat" @click="userStore.logout">Выйти</v-btn>
    </div>
  </div>
  <v-overlay :model-value="isImporting" persistent class="import-overlay">
    <div class="import-overlay-content rounded-lg">
      <v-progress-circular indeterminate size="64" color="primary" />
      <div class="import-overlay-text">
        Пожалуйста, подождите, идет импорт данных...
        <br />
        Не закрывайте страницу, процесс займет до минуты.
      </div>
    </div>
  </v-overlay>
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

.title {
  font-size: 24px;
  color: black;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 24px;
}

.text {
  font-size: 20px;
  margin-bottom: 24px;
  margin-top: -10px;
}

.text-red {
  color: rgb(var(--v-theme-error));
  --border-size: 0.4px;
  text-shadow:
    calc(-1 * var(--border-size)) calc(-1 * var(--border-size)) 0 black,
    var(--border-size) calc(-1 * var(--border-size)) 0 black,
    calc(-1 * var(--border-size)) var(--border-size) 0 black,
    var(--border-size) var(--border-size) 0 black;
}

.button {
  justify-self: flex-end;
}

.text-field {
  display: grid;
  gap: 10px;
}

.text-field-fio {
  display: flex;
  gap: 10px;
}

.text-field-email {
  display: flex;
  justify-content: space-between;
}

.verify-email-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

.verify-email-text {
  font-size: 14px;
}

.verify-email-text.red {
  color: rgb(var(--v-theme-error));
  font-size: 14px;
}

.verify-email-text.green {
  color: rgb(var(--v-theme-success));
}

.button-email {
  padding: 0 !important;
}

.exp-imp-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.import-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.import-overlay-content {
  width: 100%;
  max-width: 800px;
  background: rgb(var(--v-theme-surface));
  padding: 50px 80px;
  text-align: center;
}

.import-overlay-text {
  margin-top: 24px;
  font-size: 20px;
  color: black;
  text-align: center;
}

.import-overlay-content :deep(.v-progress-circular__overlay) {
  animation:
    progress-circular-dash 4s ease-in-out infinite,
    progress-circular-rotate 4s linear infinite;
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
