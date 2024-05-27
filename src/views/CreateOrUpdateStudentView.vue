<script setup lang="ts">

import TopPanel from '@/components/TopPanel.vue'
import FieldSet from '@/components/FieldSet.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { get, post, put } from '@/utils'
import type { Gender, GenderNullable, StudentResponse, StudentRequest } from '@/types/types'

const route = useRoute()
const pageType = ref(route.name as 'create-student' | 'update-student')

const studentName = ref('')
const genderType = ref<GenderNullable>(null)
const birthdayDate = ref('') //2024-05-08
const classNumber = ref(-1)
const className = ref('')

const isSaveButtonDisabled = computed(() => {
  return !studentName.value || !genderType.value || !birthdayDate.value || classNumber.value === -1 ||
    !className.value
})

onMounted(async () => {
  if (pageType.value === 'update-student') {
    const data: StudentResponse = await get(`/api/students/${route.params.id}/`).then(res => res.json())
    studentName.value = data.full_name
    genderType.value = data.gender
    birthdayDate.value = data.birthday
    classNumber.value = data.student_class.number
    className.value = data.student_class.class_name
  }
})

async function createOrUpdateStudent() {
  try {
    const requestData: StudentRequest = {
      full_name: studentName.value,
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

    if (response.ok && pageType.value==='create-student') {
      alert('Ученик создан')
      studentName.value = ''
      genderType.value = null
      birthdayDate.value = ''
    } else if (response.ok && pageType.value=='update-student'){
      alert('Данные об ученике обновлены')
    } else {
      const data = await response.json()
      if (data?.status === 'error') {
        const errors = Object.values(data.details).flat().join('\n')
        alert(errors)
      }
    }

  } catch (e) {
    alert('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}
</script>

<template>
  <TopPanel>{{ pageType === 'create-student' ? 'Создание ученика' : 'Обновление ученика' }}</TopPanel>
  <div class="grid" v-auto-animate>
    <div class="left">
      <v-text-field v-model="studentName" class="text-field" label="ФИО" />

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
                    @update:model-value="className=$event.toUpperCase()"/>
    </FieldSet>

    <v-btn :disabled="isSaveButtonDisabled" text="Сохранить" color="primary" rounded class="button"
           @click="createOrUpdateStudent" />
  </div>
</template>

<style scoped>
.grid {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px 100px;
  align-items: stretch;
  background: rgb(var(--v-theme-surface));
}

.grid :deep(.v-label) {
  opacity: 1;
  color: black;
}

.grid :deep(.v-text-field .v-label) {
  opacity: var(--v-medium-emphasis-opacity);
}

.left {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
}

.text-field {
  padding-top: 12px;
  flex: 0;
}

.text-field:deep(.v-field__outline) {
  --v-field-border-opacity: 1;
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
</style>