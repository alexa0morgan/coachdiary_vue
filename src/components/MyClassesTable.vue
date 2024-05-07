<script setup lang="ts">

const props = defineProps<{
  data: Item[]
}>()

interface Item {
  number: number;
  name: string;
  gender: string;
  result: number;
  mark: number;
}

const headers = [
  { title: '№', value: 'number' },
  { title: 'ФИО', value: 'name', sortable: true },
  { title: 'ПОЛ', value: 'gender', sortable: true },
  { title: 'Результат', value: 'result', sortable: true },
  { title: 'Оценка', value: 'mark', sortable: true }
]


function getMarkColor(mark: number): string {
  switch (mark) {
    case 1:
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
    :items-per-page-text="'Строк на странице'"
    :show-current-page="true"
    item-key="name"
  >
    <template #item.name="{item}">
      <v-btn to="/app" variant="tonal">{{ item.name }}</v-btn>
    </template>
    <template #item.gender="{item}">
      <div class="gender">
        {{ item.gender }}
        <v-icon
          :class="{
          female: item.gender === 'Ж',
          male: item.gender === 'М'
        }"
          class="gender-icon">
          {{ item.gender === 'Ж' ? 'mdi-gender-female' : 'mdi-gender-male' }}
        </v-icon>
      </div>

    </template>
    <template #item.result="{item}">
      <v-text-field v-model="item.result" class="result">
      </v-text-field>
    </template>
    <template #item.mark="{item}">
      <div :class="getMarkColor(item.mark)" class="mark">{{ item.mark }}</div>
    </template>
    <template #footer.prepend>
      <v-btn class="button" color="primary">Сохранить</v-btn>
      <div class="space" />
    </template>
  </v-data-table>
</template>

<style scoped>
.result {
  width: 70px;
}

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
  /*  height: 30px;
    aspect-ratio: 1;*/
  font-size: 20px;
  font-weight: bold;
  /*  text-align: center;
    line-height: 1;
    border-radius: 50%;
    padding: 5px;*/
}

.mark-bad {
  color: red;
  /*  background-color: hsl(0, 100%, 90%);*/
}

.mark-okay {
  color: #ff8800;
  /*  background-color: hsl(52, 100%, 80%);*/
}

.mark-good {
  color: #0ecc00;
  /*  background-color: hsl(91, 100%, 80%);*/
}

.mark-great {
  color: green;
  /*  background-color: hsl(120, 100%, 90%);*/
}

.space {
  flex: 1;
}
</style>