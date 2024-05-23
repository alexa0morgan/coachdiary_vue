<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import { computed, onMounted, ref } from 'vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import MyClassesTable from '@/components/MyClassesTable.vue'
import FilterBlock from '@/components/FilterBlock.vue'
import type { Class } from '@/types/types'
import { get } from '@/utils'


const activeLevelNumber = ref(-1)
const selectedNormativeId = ref(-1)
const className = ref('')

const classesData = ref<Class[]>([])

onMounted(async () => {
  classesData.value = await get('/api/classes/').then(res => res.json())
})

const classes = computed(() =>
  classesData.value
    .reduce((acc, v) => {
      if (!(v.number in acc)) {
        acc[v.number] = [] as string[]
      }
      acc[v.number].push(v.class_name)
      return acc
    }, {} as Record<number, string[]>)
)


const normatives = [
  { id: 1, label: 'бег 100м' },
  { id: 2, label: 'метание мяча' },
  { id: 3, label: 'прыжок в длину прыжок в длину 2 раз  dsf' },
  { id: 4, label: 'прыжок в длину прыжок в длину 2 раз dsf' },
  { id: 5, label: 'прыжок в длину прыжок в длину 2 раз dsf' },
  { id: 6, label: 'прыжок в длину прыжок в длину 2 раз dsf' }
]

const students = [
  { number: 1111, name: 'Петров Артемий Юрьевич', gender: 'М', result: undefined, mark: undefined },
  { number: 2, name: 'Шишкина Валерия Максимовна', gender: 'Ж', result: -4, mark: 4 },
  { number: 3, name: 'Новикова Василиса Давидовна', gender: 'Ж', result: 2, mark: 5 },
  { number: 4, name: 'Кудрявцев Юрий Максимович', gender: 'М', result: undefined, mark: undefined },
  { number: 5, name: 'Федоров Андрей Никитич', gender: 'М', result: -19, mark: 2 },
  { number: 6, name: 'Швенк Ева Никитишна', gender: 'Ж', result: 2, mark: 5 },
  { number: 7, name: 'Борисов Герман Денисович', gender: 'М', result: 0, mark: 5 },
  { number: 8, name: 'Захаров Матвей Никитич', gender: 'М', result: -7, mark: 3 },
  { number: 9, name: 'Снегирева Ева Андреевна', gender: 'Ж', result: 5, mark: 5 },
  { number: 10, name: 'Румянцева Ксения Никитична', gender: 'Ж', result: -4, mark: 4 },
  { number: 11, name: 'Кондратьева Елена Глебовна', gender: 'Ж', result: 7, mark: 5 },
  { number: 12, name: 'Иванова Елизавета Елисеевна', gender: 'Ж', result: -11, mark: 2 }
]


</script>

<template>
  <TopPanel>
    <div class="buttons-panel">
      <v-btn class="level-button top-button" v-for="(v, key) in classes" :key
             :variant="activeLevelNumber === key ? 'flat' : 'outlined'" color="rgb(var(--v-theme-secondary))"
             @click="activeLevelNumber = key; className = ''">
        {{ key }}{{ activeLevelNumber === key ? className : '' }}
        <v-menu activator="parent" location="bottom center" offset="5" transition="slide-y-transition">
          <v-list density="compact" bg-color="rgb(var(--v-theme-primary))"
                  base-color="rgb(var(--v-theme-secondary))" elevation="0">
            <v-list-item v-for="letter in v" :key='key + letter' class="text-center" @click="className = letter">
              <v-list-item-title>{{ letter }}</v-list-item-title>
            </v-list-item>
            <v-list-item class="text-center" @click="() => {}">
              <v-list-item-title>Отмена</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-btn>
    </div>
    <template #right>
      <v-btn icon="mdi-plus" variant="outlined" color="rgb(var(--v-theme-secondary))"
             :to="{name: 'create-student'}" />
    </template>
  </TopPanel>

  <div class="grid">

    <FilterBlock />

    <MyClassesTable class="table" :data="students" />

    <DataTableSideNav v-model="selectedNormativeId" :data="normatives" title="Нормативы" class="data-table-side-nav"
                      :has-action-buttons="false"/>
  </div>


</template>

<style scoped>
.buttons-panel {
  display: flex;
  gap: 10px;
}

.top-button {
  border-radius: var(--v-border-button-radius);
}

.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.grid {
  display: grid;
  grid-template-columns: 150px 1fr 230px;
  gap: 10px;
  max-width: 1200px;
  margin: 30px auto 0;

  @media (max-width: 1230px) {
    margin-inline: 8px;
  }
}

.data-table-side-nav {
  height: calc(100dvh - 180px);
}

.table {
  height: calc(100dvh - 180px);
}

</style>