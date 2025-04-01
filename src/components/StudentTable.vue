<script setup lang="ts">
import type { StudentStandardResponse } from '@/types/types';
import { computed } from 'vue';

const { data } = defineProps<{
  data: StudentStandardResponse[];
}>();

const emit = defineEmits<{
  saveData: []
}>();

const headers = [
  { title: 'норматив', value: 'Standard.Name', sortable: true },
  { title: 'результат', value: 'Value', sortable: true, width: 100 },
  { title: 'оценка', value: 'Grade', sortable: true, width: 80 }
];

const totalRate = computed(() => {
  const array = data.map((item) => item.Grade);
  return array.length !== 0 ? +((array.reduce((acc: any, c: any) => acc + c, 0) / array.length).toFixed(3)) : '';
});


function getMarkColor(mark?: number): string {
  switch (mark) {
    case 2:
      return 'mark-bad';
    case 3:
      return 'mark-okay';
    case 4:
      return 'mark-good';
    case 5:
      return 'mark-great';
    default:
      return '';
  }
}

</script>

<template>
  <v-data-table
    :fixed-header="true"
    :headers="headers"
    :items="data"
    :itemsPerPageOptions="[10, 20, 30, { title: 'Все', value: -1 }]"
    :mobile="false"
    :show-current-page="true"
    :sort-by="[{ key: 'number', order: 'asc' }]"
    class="table"
    item-key="id"
    no-data-text="Нет данных о нормативах на данном уровне">
    <template #item.Value="{item}">
      <v-text-field
        v-if="item.Standard.Has_numeric_value"
        v-model="item.Value" />
    </template>
    <template #item.Grade="{item}">
      <div v-if="item.Standard.Has_numeric_value" :class="getMarkColor(item.Grade ?? 0)" class="mark">
        {{ item.Grade }}
      </div>
      <v-text-field
        v-else
        v-model="item.Value"
        :class="getMarkColor(item.Grade?? 0)" class="mark"
      />
    </template>
    <template #body.append>
      <tr class="total-rate">
        <td>Итого</td>
        <td></td>
        <td>{{ totalRate }}</td>
      </tr>
    </template>
    <template #footer.prepend>
      <v-btn class="button" color="primary" @click="emit('saveData')">Сохранить</v-btn>
      <div class="space" />
    </template>
  </v-data-table>
</template>

<style scoped>
.table {
  width: 100%;
  border-spacing: 0;
  overflow: hidden;
}

.total-rate {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-secondary));
  text-transform: uppercase;
  position: sticky;
  bottom: 0;
  font-weight: bold;
}

.space {
  flex: 1
}

.table:deep(.v-data-table-header__content) {
  color: black;
  text-transform: uppercase;
  font-weight: bold;
}

.table:deep(.v-data-table__tr):nth-child(odd) {
  background: rgb(var(--v-theme-background));
}

.mark {
  font-size: 18px;
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