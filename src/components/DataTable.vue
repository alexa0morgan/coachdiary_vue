<script lang="ts" setup>
import type { VDataTable } from 'vuetify/components'
import { computed, ref } from 'vue'
import type { StudentStandardRequest } from '@/types/types'

const emit = defineEmits<{
  dataChanged: [];
}>()
const { data } = defineProps<{
  data: Item[];
}>()
const changedData = defineModel<StudentStandardRequest>()

function removeDuplicatesAndKeepLast(arr: Item[]): Item[] {
  const uniqueObjects: Item[] = []
  const seenIds: Set<number> = new Set()

  for (let i = arr.length - 1; i >= 0; i--) {
    const obj = arr[i]
    if (!seenIds.has(obj.id)) {
      uniqueObjects.push(obj)
      seenIds.add(obj.id)
    }
  }
  return uniqueObjects.reverse()
}

interface Item {
  student_id: number,
  id: number;
  has_numeric_value: boolean,
  standard: string;
  result?: number;
  rate?: number;
  level_number: number;
}

const totalRate = computed(() => {
  const array = data.map((item) => item.rate)
  return array.length !== 0 ? +((array.reduce((acc: any, c: any) => acc + c, 0) / array.length).toFixed(2)) : ''
})

const headers = [
  { title: 'норматив', value: 'standard', sortable: true },
  { title: 'результат', value: 'result', sortable: true, width: 120 },
  { title: 'оценка', value: 'rate', sortable: true, width: 120 }
]

const tableData = ref<Item[]>([])

function onRateChange(item: Item) {
  tableData.value.push(item)
}

function saveData(): void {
  changedData.value = removeDuplicatesAndKeepLast(tableData.value).map((item) => {
    const itemValue = item.has_numeric_value ? item.result : item.rate
    if (itemValue) {
      return {
        student_id: item.student_id,
        standard_id: item.id,
        value: +itemValue,
        level_number: item.level_number
      }
    }
  }).filter((item) => item !== undefined) as StudentStandardRequest
  emit('dataChanged')
}

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
    :fixed-header="true"
    :headers="headers"
    :items="data"
    :itemsPerPageOptions="[10, 20, { title: 'Все', value: -1 }]"
    :mobile="true"
    :show-current-page="true"
    :sort-by="[{ key: 'number', order: 'asc' }]"
    class="table"
    item-key="id"
    no-data-text="Нет данных о нормативах на данном уровне">
    <template #item.result="{item}">
      <v-text-field
        v-if="item.has_numeric_value"
        v-model="item.result"
        class="changeable-fields"
        @update:modelValue="onRateChange(item)" />
    </template>
    <template #item.rate="{item}">
      <span v-if="item.has_numeric_value" :class="getMarkColor(item.rate ?? 0)" class="mark"> {{ item.rate }}</span>
      <v-text-field
        v-else
        v-model="item.rate"
        :class="getMarkColor(item.rate?? 0)" class="mark changeable-fields"
        @update:modelValue="onRateChange(item)" />
    </template>
    <template #body.append>
      <tr class="total-rate">
        <td>Итого</td>
        <td></td>
        <td>{{ totalRate }}</td>
      </tr>
    </template>
    <template #footer.prepend>
      <v-btn class="button" color="primary" @click="saveData">Сохранить</v-btn>
      <div class="space" />
    </template>
  </v-data-table>

</template>
<style scoped>
.table {
  width: 100%;
  border-spacing: 0;
  border-radius: var(--v-border-radius);
  overflow: hidden;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
}

.changeable-fields {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}

.total-rate {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-secondary));
  text-transform: uppercase;
  position: sticky;
  bottom: 0;
}

.space {
  flex: 1
}

.table:deep(.v-table__wrapper) {
  border: 1px solid rgb(var(--v-theme-surface));
  border-radius: 0;
}

.table:deep(.v-data-table-header__content) {
  color: black;
  text-transform: uppercase;
  font-weight: bold;
}

.table:deep(.v-data-table-footer) {
  color: black;
  text-transform: lowercase;
  font-weight: 400;
}

.table:deep(.v-data-table__tr):nth-child(odd) {
  background: rgb(var(--v-theme-background));
}

.mark {
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

@media (max-width: 1280px) {
  .table {
    font-weight: 400;
  }

  .table :deep(th),
  .table :deep(td) {
    padding: 0 5px !important;
  }

  .table:deep(.v-data-table__td),
  .table:deep(td),
  .table:deep(tr.v-data-table__tr) {
    height: 40px !important;
  }

  .button:deep(.v-btn__content) {
    font-size: 10px !important;
  }
}
</style>