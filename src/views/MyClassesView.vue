<script setup lang="ts">

import TopPanel from '@/components/TopPanel.vue'
import ClassesPanel from '@/components/ClassesPanel.vue'
import { computed, ref } from 'vue'
import type { StudentResponse } from '@/types/types'
import { useMyClassesStore } from '@/stores/myClasses'
import { useDisplay } from 'vuetify'
import { showConfirmDialog } from '@/utils'

let timer: number | null = null

function search() {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    console.log('searching...')
  }, 300)
}

const { smAndUp } = useDisplay()
const myClassesStore = useMyClassesStore()
const activeLevelNumber = ref(-1)
const studentsData = ref<StudentResponse[]>([])

const groupedStudentsClasses = computed(() => {
  const students = studentsData.value.toSorted((a, b) => {
    if (a.student_class.number !== b.student_class.number) {
      return a.student_class.number - b.student_class.number
    }
    if (a.student_class.class_name !== b.student_class.class_name) {
      return a.student_class.class_name.localeCompare(b.student_class.class_name)
    }
    return a.full_name.localeCompare(b.full_name)
  })
  const result: Record<number, Record<string, StudentResponse[]>> = {}
  for (const student of students) {
    if (!result[student.student_class.number]) {
      result[student.student_class.number] = {}
    }
    if (!result[student.student_class.number][student.student_class.class_name]) {
      result[student.student_class.number][student.student_class.class_name] = []
    }
    result[student.student_class.number][student.student_class.class_name].push(student)
  }


  return result
})

function updateStudentsData(data: StudentResponse[], classNumber: number, letter: string) {
  studentsData.value = data
  activeLevelNumber.value = classNumber
}

async function deleteClass() {
  //TODO создать функционал удаления классов
  await showConfirmDialog({
    title: 'Удаление класса',
    text: 'Вы уверены, что хотите удалить класс?'
  })
}

</script>

<template>
  <TopPanel class="top-panel">
    <!--        <v-autocomplete
              :items="studentsData"
              density="compact"
              class="search"
              menu-icon=""
              placeholder="Введите имя ученика"
              prepend-inner-icon="mdi-magnify"
              theme="light"
              variant="solo"
              auto-select-first
              item-props
              clearable
              rounded
              hide-details
              @update:search="search"
            />-->
    <classes-panel v-if="!smAndUp"
                   @studentsData="updateStudentsData"
                   @buttonClick="myClassesStore.activeClasses = []" />
    <div v-if="smAndUp"></div>
    <template #right v-if="smAndUp">
      <v-btn :to="{name: 'create-student'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>

  <div class="classes-panel" v-if="smAndUp">
    <classes-panel direction-column
                   @studentsData="updateStudentsData"
                   @buttonClick="myClassesStore.activeClasses = []" />
  </div>

  <div class="container">

    <div class="students-container">

      <template
        v-for="(studentsClasses, activeLevelNumber) in groupedStudentsClasses"
        :key="activeLevelNumber">
        <v-expansion-panels
          v-model="myClassesStore.activeClasses" multiple>
          <v-expansion-panel
            v-for="(students, klass) in studentsClasses"
            :key="klass"
            :value="activeLevelNumber+klass"
          >
            <v-expansion-panel-title>
              <strong>{{ activeLevelNumber + klass }}</strong>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="students-list" v-for="i in students.length" :key="students[i-1].id">
                <div>{{ i }}</div>
                <v-btn
                  :to="{name: 'student', params: { id: students[i-1].id } }"
                  class="button"
                  variant="text">
                  {{ students[i - 1].last_name + ' ' + students[i - 1].first_name + ' ' + students[i - 1].patronymic }}
                </v-btn>
              </div>

              <!--                          <div class="action-buttons">
                                          <v-btn size="small" color="error" variant="outlined" @click="deleteClass">Удалить</v-btn>
                                          <v-btn size="small" color="warning" variant="outlined">Архивировать</v-btn>
                                          <v-btn size="small" color="info" variant="outlined">Перевести на след. год</v-btn>
                                        </div>-->

            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </div>
  </div>
</template>

<style scoped>

.top-panel {
  position: sticky;
  top: 64px;
  z-index: 1000;
}

.search {
  max-width: 350px;
  margin: 0 auto;
}

.classes-panel {
  position: fixed;
  top: 124px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 1000;
  padding: 10px;
  height: calc(100dvh - 124px);
}

.container {
  margin: 30px 0 60px 100px;
}

.students-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto 0;
  max-width: 100%;
  width: 600px;
}

.students-list {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 10px;
  align-items: center;
}

.button {
  justify-content: start;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin: 20px 10px 0;
  align-items: center;
  width: 100%;
}

@media (max-width: 600px) {
  .students-container {
    width: 100%;
  }

  .container {
    grid-template-columns: 0 1fr;
    margin: 10px;
  }
}

</style>