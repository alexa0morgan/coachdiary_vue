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
  { number: 1, name: 'Алимкулова Ширина Никитишна', gender: 'М', result: 1, mark: 5 },
  { number: 2, name: 'Бакурова Диана Никитишна', gender: 'Ж', result: 2, mark: 4 },
  { number: 1, name: 'Беляева Ника Никитишна', gender: 'М', result: 2, mark: 3 },
  { number: 2, name: 'Бублик Матвей Никитишна', gender: 'Ж', result: 3, mark: 2 },
  { number: 1, name: 'Передельский Никита Никитишна', gender: 'М', result: 4, mark: 1 },
  { number: 2, name: 'Швенк Ева Никитишна', gender: 'Ж', result: 2, mark: 2 },
  { number: 1, name: 'Трегуб Андрей Никитишна', gender: 'М', result: 1, mark: 1 },
  { number: 2, name: 'Гаевский Александр Никитишна', gender: 'Ж', result: 1, mark: 2 },
  { number: 1, name: 'Пятова Мария Никитишна', gender: 'М', result: 4, mark: 1 },
  { number: 2, name: 'Доржиева Арьяна Никитишна', gender: 'Ж', result: 4, mark: 2 },
  { number: 1, name: 'Имя 1', gender: 'М', result: 3, mark: 1 },
  { number: 2, name: 'Имя 2', gender: 'Ж', result: 3, mark: 2 }
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
             :to="{name: 'create-normative'}" />
    </template>
  </TopPanel>

  <div class="grid">

    <FilterBlock :data="students"/>

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