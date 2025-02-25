<script setup lang="ts">

import TopPanel from '@/components/TopPanel.vue'
import ClassesPanel from '@/components/ClassesPanel.vue'
import { computed, ref } from 'vue'
import type { StudentResponse } from '@/types/types'
import {useMyClassesStore} from '@/stores/myClasses'

let timer: number | null = null

function search() {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    console.log('searching...')
  }, 300)
}

const myClassesStore = useMyClassesStore()
const activeLevelNumber = ref(-1)
const studentsData = ref<StudentResponse[]>([])

const studentsClasses = computed(() =>
  studentsData.value
    .reduce((acc, v) => {
      const fullClassName = v.student_class.number + v.student_class.class_name
      if (!(fullClassName in acc)) {
        acc[fullClassName] = [] as StudentResponse[]
      }
      acc[fullClassName].push(v)
      return acc
    }, {} as Record<string, StudentResponse[]>)
)

function updateStudentsData(data: StudentResponse[], classNumber: number, letter: string) {
  studentsData.value = data.sort((a, b) => a.full_name.localeCompare(b.full_name))
  activeLevelNumber.value = classNumber

}

</script>

<template>
  <TopPanel class="top-panel">
    <v-autocomplete
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
    />
    <template #right>
      <v-btn :to="{name: 'create-student'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>

  <div class="classes-panel">
    <classes-panel direction-column @studentsData="updateStudentsData" @buttonClick="myClassesStore.activeClasses = []" />
  </div>

  <div class="grid">

    <div class="students-container">
      <v-expansion-panels v-model="myClassesStore.activeClasses" multiple :key="activeLevelNumber">
        <v-expansion-panel
          v-for="(students, klass) in studentsClasses"
          :key="klass"
          :value="klass"
        >
          <v-expansion-panel-title>
            <strong>{{ klass }}</strong>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="students-list" v-for="i in students.length" :key="students[i-1].id">
              <div>{{ i }}</div>
              <v-btn
                :to="{name: 'student', params: { id: students[i-1].id } }"
                class="button"
                variant="text">
                {{ students[i - 1].full_name }}
              </v-btn>
            </div>

            <div class="action-buttons">
              <v-btn size="small" color="error" variant="outlined">Удалить</v-btn>
              <v-btn size="small" color="warning" variant="outlined">Архивировать</v-btn>
              <v-btn size="small" color="info" variant="outlined">Перевести на след. год</v-btn>
            </div>

          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

    </div>


  </div>

</template>

<style scoped>

.top-panel {
  position: sticky;
  top: 65px;
  z-index: 1000;
}

.search {
  max-width: 350px;
  margin: 0 auto;
}

.classes-panel {
  position: fixed;
  top: 150px;
  left: 20px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 1000;
  padding: 10px;
  width: fit-content;
  border-radius: 10px;
}

.grid {
  display: grid;
  grid-template-columns: 130px 1fr;
  margin: 30px 0 60px;
}

.students-container {
  grid-column: 2;
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

@media (max-width: 800px) {
  .students-container {
    width: 100%;
  }

}

</style>