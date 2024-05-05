<script setup lang="ts">

import StandardsTable from '@/components/StandardsTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import TopPanel from '@/components/TopPanel.vue'
import { ref } from 'vue'

const activeLevelNumber = ref(1)
const pageType = ref<'standards' | 'skills'>('standards')


const data = [
  { id: 1, label: 'бег 100м' },
  { id: 2, label: 'метание мяча' },
  { id: 3, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 4, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 5, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' },
  { id: 6, label: 'прыжок в длину прыжок в длину 2 раз lkbfsdf sdfsd dsf' }
]
</script>

<template>
    <TopPanel>
      <div class="buttons-panel">
        <v-btn class="level-button button" v-for="n in 11" :text="n + ' УР'" :key="n"
               :variant="activeLevelNumber === n ? 'flat' : 'outlined'" color="rgb(var(--v-theme-secondary))"
               @click="activeLevelNumber = n" />
      </div>
      <template #right>
        <v-btn icon="mdi-plus" variant="outlined" color="rgb(var(--v-theme-secondary))"
               :to="{name: 'create-normative'}" />
      </template>
    </TopPanel>

    <div class="grid" :class="{'skills-grid': pageType === 'skills'}" v-auto-animate>
      <div v-if="pageType === 'standards'" class="standards-tables">
        <StandardsTable :high="14" :middle="15" :gender="'f'" :low="16" />
        <StandardsTable :high="14" :middle="15" :gender="'m'" :low="16" />
      </div>


      <div>
        <div class="side-nav-buttons">
          <v-btn text="Стандарты" variant="outlined" class="button side-nav-button" size="small"
                 @click="pageType = 'standards'" :active="pageType==='standards'" />
          <v-btn text="Умения" variant="outlined" class="button side-nav-button" size="small"
                 @click="pageType = 'skills'" :active="pageType==='skills'" />
        </div>
        <DataTableSideNav :data :title="pageType==='standards' ? 'Стандарты' : 'Умения'"
                          :is-page-type-skills="pageType==='skills'" class="data-table-side-nav"/>
      </div>
    </div>

</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 230px;
  gap: 10px;
  max-width: 1200px;
  margin: 40px auto 0;
}

.skills-grid {
  grid-template-columns: 1fr;
}

.standards-tables {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 40px;
}

.buttons-panel {
  display: flex;
  gap: 10px;
}

.button {
  border-radius: var(--v-border-button-radius);
}

.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.side-nav-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.side-nav-button.v-btn--variant-outlined {
  border-width: 2px !important;
}

.side-nav-button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.data-table-side-nav {
  height: calc(100vh - 220px);
}

</style>