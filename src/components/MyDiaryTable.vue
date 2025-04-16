<script lang="ts" setup>

import type { VDataTable } from 'vuetify/components'
import type { StudentsValueResponse } from '@/types/types'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'


const { smAndUp } = useDisplay()

const { data, standardType } = defineProps<{
  data: StudentsValueResponse[]
  standardType: 'physical' | 'technical'
}>()

const emit = defineEmits<{
  saveData: []
}>()


const headers = computed<VDataTable['$props']['headers']>(() => {
  if (standardType === 'physical') {
    return [
      { title: 'Класс', value: 'student_class.class_name', width: 50, sortable: false },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'Пол', value: 'gender', width: 70 },
      { title: 'Результат', value: 'value', sortable: true, width: 100 },
      { title: 'Оценка', value: 'grade', sortable: true, width: 80 }
    ]
  } else {
    return [
      { title: 'Класс', value: 'student_class.class_name', width: 50, sortable: false },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'Пол', value: 'gender', width: 70 },
      { title: 'Оценка', value: 'value', sortable: true, width: 80 }
    ]
  }

})


function getMarkColor(mark?: number): string {
  switch (mark) {
    case 2:
      return 'mark-bad'
    case 3:
      return 'mark-okay'
    case 4:
      return 'mark-good'
    case 5:
      return 'mark-great'
    default:
      return ''
  }
}

const sortedData = computed(() => {
  return data.toSorted((a, b) => {
    if (a.student_class.number !== b.student_class.number) {
      return a.student_class.number - b.student_class.number
    }
    if (a.student_class.class_name !== b.student_class.class_name) {
      return a.student_class.class_name.localeCompare(b.student_class.class_name)
    }
    return a.full_name.localeCompare(b.full_name)
  })
})


function getStudentName(student: StudentsValueResponse) {
  if (smAndUp.value) {
    return student.last_name + ' ' + student.first_name + ' ' + student.patronymic
  }
  return student.last_name + ' ' + student.first_name[0] + '. ' + student.patronymic[0] + '.'
}

</script>

<template>
  <v-data-table
    :fixed-header="true"
    :headers="headers"
    :items="sortedData"
    :itemsPerPageOptions="[10, 20, 30, 100, { title: 'Все', value: -1 }]"
    :mobile="false"
    :show-current-page="true"
    multi-sort
    class="table"
    item-key="name"
    no-data-text="Чтобы появились ученики, выберите Класс, потом Норматив"
  >
    <template #item.student_class.class_name="{item}">
      {{ item.student_class.number + item.student_class.class_name }}
    </template>
    <template #item.full_name="{item}">
      <v-btn :to="{name: 'student', params: { id: item.id } }" class="button" variant="tonal">
        {{ getStudentName(item) }}
      </v-btn>
    </template>
    <template #item.gender="{item}">
      <div class="gender">
        {{ item.gender === 'f' ? 'Ж' : 'М' }}
        <v-icon
          :class="{
          female: item.gender === 'f',
          male: item.gender === 'm'
        }"
          class="gender-icon">
          {{ item.gender === 'f' ? 'mdi-gender-female' : 'mdi-gender-male' }}
        </v-icon>
      </div>
    </template>
    <template #item.value="{item}">
      <v-text-field v-model="item.value" :class="standardType === 'technical' ? getMarkColor(item.grade ?? 0) +
      ' mark' : ''"/>
    </template>
    <template #item.grade=" {item} ">
      <div :class="getMarkColor(item.grade ?? 0)" class="mark">{{ item.grade }}</div>
    </template>
    <template #footer.prepend>
      <v-btn color="primary" @click="emit('saveData')">Сохранить</v-btn>
      <div class="space" />
    </template>
  </v-data-table>
</template>

<style scoped>

.gender {
  display: flex;
  align-items: center;
  gap: 5px;
}

.gender-icon {
  font-size: 18px;
  color: white;
  border-radius: 5px;
}

.female {
  background-color: deeppink;
}

.male {
  background-color: deepskyblue;
}

.mark {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.mark-bad {
  color: red;
}

.mark-okay {
  color: #ff8800;
}

.mark-good {
  color: #0ecc00;
}

.mark-great {
  color: green;
}

.button {
  height: auto !important;
  padding-block: 5px;
  margin-block: 5px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.space {
  flex: 1;
}

@media (max-width: 850px) {
  .table {
    font-weight: 400;
  }

  .table :deep(th),
  .table :deep(td) {
    padding: 0 5px !important;
  }
}
</style>