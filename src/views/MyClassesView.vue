<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import { ref } from 'vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import MyClassesTable from '@/components/MyClassesTable.vue'
import FilterBlock from '@/components/FilterBlock.vue'

const activeLevelNumber = ref(-1)
const className = ref('')


const normatives = [
  { id: 1, label: 'бег 100м' },
  { id: 2, label: 'метание мяча' },
  { id: 3, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 4, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 5, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 6, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' }
]

const students = [
  { number: 1111, name: 'Петров Артемий Юрьевич', gender: 'М', result: undefined, mark: undefined},
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
      <v-btn class="level-button top-button" v-for="n in 11" :key="n"
             :variant="activeLevelNumber === n ? 'flat' : 'outlined'" color="rgb(var(--v-theme-secondary))"
             @click="activeLevelNumber = n; className = ''">
        {{ n }}{{ activeLevelNumber === n ? className : '' }}
        <v-menu activator="parent" location="bottom center" offset="5" transition="slide-y-transition">
          <v-list density="compact" bg-color="rgb(var(--v-theme-primary))"
                  base-color="rgb(var(--v-theme-secondary))" elevation="0">
            <v-list-item class="text-center" @click="className = 'A'">
              <v-list-item-title>А</v-list-item-title>
            </v-list-item>
            <v-list-item class="text-center" @click="className = 'Б'">
              <v-list-item-title>Б</v-list-item-title>
            </v-list-item>
            <v-list-item class="text-center" @click="className = 'В'">
              <v-list-item-title>В</v-list-item-title>
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

    <DataTableSideNav :data="normatives" title="Нормативы" class="data-table-side-nav" />
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