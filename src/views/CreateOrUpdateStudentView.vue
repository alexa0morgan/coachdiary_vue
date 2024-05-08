<script setup lang="ts">

import TopPanel from '@/components/TopPanel.vue'
import FieldSet from '@/components/FieldSet.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const pageType = ref(route.name as 'create-student' | 'update-student')

const studentName = ref('')
const genderType = ref<'f' | 'm' | null>(null)
const date = ref('') //2024-05-08
const classNumber = ref(-1)
const className = ref('')
</script>

<template>
  <TopPanel>{{ pageType === 'create-student' ? 'Создание ученика' : 'Обновление ученика' }}</TopPanel>
  <div class="grid" v-auto-animate>
    <div class="left">
      <v-text-field v-model="studentName" class="text-field" label="ФИО" />

      <FieldSet title="Пол">
        <v-radio-group v-model="genderType">
          <v-radio label="Женский" value="standard" />
          <v-radio label="Мужской" value="skill" />
        </v-radio-group>
      </FieldSet>

      <v-text-field v-model="date" class="text-field" label="Дата рождения" type="date" />

    </div>

    <FieldSet class="class" title="Класс">
      <div>
        <p class="levels-text">Уровень</p>
        <v-radio-group class="radio-group" height="100px">
          <v-radio v-for="n in 11" :key="n" v-model="classNumber" :label="n.toString()" :value="n"
                   density="compact"/>
        </v-radio-group>
      </div>
      <v-text-field v-model="className" class="text-field class-name" label="Буква" />
    </FieldSet>

    <v-btn text="Сохранить" color="primary" rounded class="button" />
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