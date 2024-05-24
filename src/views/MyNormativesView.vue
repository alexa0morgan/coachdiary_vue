<script setup lang="ts">

import StandardsTable from '@/components/StandardsTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import TopPanel from '@/components/TopPanel.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { del, get } from '@/utils'
import type { NormativeResponse } from '@/types/types'
import router from '@/router'

const activeLevelNumber = ref(-1)
const pageType = ref<'standards' | 'skills'>('standards')

const selectedId = ref(-1)
const normatives = ref<NormativeResponse[]>([])

onMounted(async () => {
  normatives.value = await get('/api/standards/').then(res => res.json())
  await setFirst()
})

async function setFirst(levelNumber?: number): Promise<void> {
  activeLevelNumber.value = levelNumber ?? levels.value[0] ?? -1
  await nextTick()
  selectedId.value = simplifiedNormatives.value[0]?.id ?? -1
}

const levels = computed(() =>
  Array.from(normatives.value
    .filter(normative => normative.has_numeric_value === (pageType.value === 'standards'))
    .reduce((acc, v) => {
      for (const level of v.levels) {
        acc.add(level.level_number)
      }
      return acc
    }, new Set<number>))
)

const simplifiedNormatives = computed(() =>
  normatives.value
    .filter(normative => normative.has_numeric_value === (pageType.value === 'standards'))
    .filter(normative => normative.levels.some(level => level.level_number === activeLevelNumber.value))
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map(normative => ({
      id: normative.id,
      label: normative.name
    }))
)

const currentStandardLevels = computed(() =>
  normatives.value
    .find(normative => normative.id === selectedId.value)
    ?.levels.toSorted((a, b) => a.gender.localeCompare(b.gender))
    .filter(level => level.level_number === activeLevelNumber.value)
)

function editNormative(): void {
  router.push({ name: 'update-normative', params: { id: selectedId.value } })
}

async function deleteNormative(): Promise<void> {
  const response = await del('/api/standards/' + selectedId.value)
  if (!response.ok) {
    alert('Произошла ошибка при удалении, попробуйте снова')
    return
  }
  normatives.value = normatives.value.filter(normative => normative.id !== selectedId.value)
  await setFirst()
}

</script>

<template>
  <TopPanel>
    <div class="buttons-panel">
      <v-btn
        v-for="n in 11"
        :text="n + ' УР'"
        :key="n"
        :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
        :disabled="!levels.includes(n)"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst(n)" />
    </div>
    <template #right>
      <v-btn icon="mdi-plus" variant="outlined" color="rgb(var(--v-theme-secondary))"
             :to="{name: 'create-normative'}" />
    </template>
  </TopPanel>

  <div class="grid" :class="{'skills-grid': pageType === 'skills'}" v-auto-animate>
    <div v-if="pageType === 'standards'" class="standards-tables">
      <template v-if="currentStandardLevels">
        <StandardsTable
          v-for="level in currentStandardLevels"
          :key="level.id"
          :gender="level.gender"
          :high="level.high_level_value"
          :middle="level.middle_level_value"
          :low="level.low_level_value" />
      </template>
    </div>


    <div>
      <div class="side-nav-buttons">
        <v-btn
          text="Стандарты"
          class="button side-nav-button"
          variant="outlined"
          size="small"
          :active="pageType==='standards'"
          @click="pageType = 'standards'; setFirst()" />
        <v-btn
          text="Умения"
          variant="outlined"
          class="button side-nav-button"
          size="small"
          :active="pageType==='skills'"
          @click="pageType = 'skills'; setFirst()" />
      </div>
      <DataTableSideNav
        v-model="selectedId"
        :data="simplifiedNormatives"
        :title="pageType==='standards' ? 'Стандарты' : 'Умения'"
        :is-page-type-skills="pageType==='skills'"
        class="data-table-side-nav"
        @edit="editNormative"
        @delete="deleteNormative"
      />
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