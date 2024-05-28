<script setup lang="ts">

import type { VDataTable } from 'vuetify/components'
import type { StudentsValueResponse } from '@/types/types'
import { computed } from 'vue'

const { data, standardType } = defineProps<{
  data: StudentsValueResponse[]
  standardType: 'standard' | 'skill'
}>()

const emit = defineEmits<{
  saveData: []
}>()

const headers = computed<VDataTable['$props']['headers']>(() => {
  if (standardType === 'standard') {
    return [
      { title: 'ID', value: 'id', width: 50 },
      { title: 'Класс', value: 'class', width: 70 },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'ПОЛ', value: 'gender', sortable: true, width: 83 },
      { title: 'Результат', value: 'value', sortable: true, width: 120 },
      { title: 'Оценка', value: 'grade', sortable: true, width: 102 }
    ]
  } else {
    return [
      { title: 'ID', value: 'id', width: 50 },
      { title: 'Класс', value: 'class', width: 70 },
      { title: 'ФИО', value: 'full_name', sortable: true },
      { title: 'ПОЛ', value: 'gender', sortable: true, width: 83 },
      { title: 'Оценка', value: 'value', sortable: true, width: 120 }
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

</script>

<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :sort-by="[{ key: 'name', order: 'asc' }]"
    :fixed-header="true"
    :itemsPerPageOptions="[10, 20, 30, 100, { title: 'Все', value: -1 }]"
    :show-current-page="true"
    :mobile="null"
    no-data-text="Чтобы появились ученики, выберите Класс сверху, потом Норматив справа"
    item-key="name"
    class="table"
  >
    <template #item.class="{item}">
      {{ item.student_class.number + item.student_class.class_name }}
    </template>
    <template #item.full_name="{item}">
      <v-btn class="button" :to="{name: 'student', params: { id: item.id } }" variant="tonal">{{ item.full_name }}
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
      <v-text-field v-model="item.value" class="result" />
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