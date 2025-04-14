<script lang="ts" setup>

import TopPanel from '@/components/TopPanel.vue'
import FieldSet from '@/components/FieldSet.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { get, getErrorMessage, post, put } from '@/utils'
import type { Gender, GenderNullable, StudentRequest, StudentResponse } from '@/types/types'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const pageType = ref(route.name as 'create-student' | 'update-student')

const firstName = ref('')
const lastName = ref('')
const patronymic = ref('')
const genderType = ref<GenderNullable>(null)
const birthdayDate = ref('') //2024-05-08
const classNumber = ref(-1)
const className = ref('')

const isSaveButtonDisabled = computed(() => {
  return !firstName.value || !lastName.value || !genderType.value || !birthdayDate.value || classNumber.value === -1 ||
    !className.value
})

async function createOrUpdateStudent() {
  try {
    const requestData: StudentRequest = {
      first_name: firstName.value,
      last_name: lastName.value,
      patronymic: patronymic.value,
      student_class: {
        number: classNumber.value,
        class_name: className.value
      },
      birthday: birthdayDate.value,
      gender: genderType.value as Gender
    }
    const currentId = pageType.value === 'update-student' ? `${route.params.id}/` : ''
    const currentMethod = pageType.value === 'update-student' ? put : post

    const response = await currentMethod(`/api/students/` + currentId, requestData)

    if (response.ok && pageType.value === 'create-student') {
      toast.success('Ученик успешно создан')
      firstName.value = ''
      lastName.value = ''
      patronymic.value = ''
      genderType.value = null
      birthdayDate.value = ''
    } else if (response.ok && pageType.value == 'update-student') {
      toast.success('Данные о ученике успешно обновлены')
      router.push({ name: 'student', params: { id: route.params.id } })
    } else {
      toast.error(getErrorMessage(await response.json()))
    }

  } catch (e) {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}

onMounted(async () => {
  if (pageType.value === 'update-student') {
    const data: StudentResponse = await get(`/api/students/${route.params.id}/`).then(res => res.json())
    firstName.value = data.first_name
    lastName.value = data.last_name
    patronymic.value = data.patronymic
    genderType.value = data.gender
    birthdayDate.value = data.birthday
    classNumber.value = data.student_class.number
    className.value = data.student_class.class_name
  }
})
</script>

<template>
  <TopPanel class="top-panel">{{ pageType === 'create-student' ? 'Создание ученика' : 'Обновление ученика' }}</TopPanel>
  <div class="container">
    <div class="names">
      <v-text-field v-model="lastName" class="text-field" label="Фамилия" />
      <v-text-field v-model="firstName" class="text-field" label="Имя" />
      <v-text-field v-model="patronymic" class="text-field" label="Отчество" />
    </div>

    <div class="left">
      <FieldSet title="Пол">
        <v-radio-group v-model="genderType">
          <v-radio label="Женский" value="f" />
          <v-radio label="Мужской" value="m" />
        </v-radio-group>
      </FieldSet>

      <v-text-field v-model="birthdayDate" class="text-field" label="Дата рождения" type="date" />
    </div>

    <FieldSet class="class" title="Класс">
      <div>
        <p class="levels-text">Уровень</p>
        <v-radio-group v-model="classNumber" class="radio-group" height="100px">
          <v-radio v-for="n in 11" :key="n" :label="n.toString()" :value="n"
                   density="compact" />
        </v-radio-group>
      </div>
      <v-text-field :model-value="className" class="text-field class-name" label="Буква"
                    @update:model-value="className=$event.toUpperCase()" />
    </FieldSet>

    <v-btn :disabled="isSaveButtonDisabled" class="button" color="primary" rounded text="Сохранить"
           @click="createOrUpdateStudent" />
  </div>
</template>

<style scoped>
.container{
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  background: rgb(var(--v-theme-surface));
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 100px;
}

.names{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  grid-column: 1 / -1;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: stretch;
}

.text-field {
  flex: 0;
}

.text-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.5;
}

.text-field :deep(.v-label:not(:has(+input:empty))) {
  opacity: 1;
  color: black;
}

.class {
  display: grid;
  grid-template-columns: 1fr 150px;
  align-items: start;
  justify-items: start;
  gap: 20px;
  padding: 20px;
}

.class-name {
  justify-self: stretch;
}

.radio-group:deep(.v-selection-control-group) {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 170px;
  gap: 0 32px;
  margin-top: 10px;
}

.levels-text {
  text-align: center;
  line-height: 120%;
  font-weight: bold;
}

.button {
  grid-column: span 2;
  justify-self: end;
}

@media (max-width: 1000px) {
  .container {
    background: transparent;
  }
}

@media (width <= 800px) {
  .container{
    gap: 20px 30px;
  }

  .class{
    grid-template-columns: 1fr 100px;
  }
}

@media (max-width: 600px) {
  .top-panel {
    display: none;
  }

  .container {
    width: 100%;
    grid-template-columns: 1fr;
    margin: 10px auto;
    gap: 15px;
    padding: 10px 20px;
  }

  .names{
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .button {
    grid-column: 1;
  }

}
</style>