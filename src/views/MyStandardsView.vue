<script lang="ts" setup>

import StandardsTable from '@/components/StandardsTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import TopPanel from '@/components/TopPanel.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import { del, get } from '@/utils'
import type { StandardResponse } from '@/types/types'
import router from '@/router'

const activeLevelNumber = ref(-1)
const pageType = ref<'standards' | 'technical'>('standards')

const selectedId = ref(-1)
const standards = ref<StandardResponse[]>([])

onMounted(async () => {
  standards.value = await get('/api/standards/').then(res => res.json())
  await setFirst()
})

async function setFirst(levelNumber?: number): Promise<void> {
  activeLevelNumber.value = levelNumber ?? levels.value[0] ?? -1
  await nextTick()
  selectedId.value = simplifiedStandards.value[0]?.id ?? -1
}

const levels = computed(() =>
  Array.from(standards.value
    .filter(standard => standard.has_numeric_value === (pageType.value === 'standards'))
    .reduce((acc, v) => {
      for (const level of v.levels) {
        acc.add(level.level_number)
      }
      return acc
    }, new Set<number>))
)

const simplifiedStandards = computed(() =>
  standards.value
    .filter(standard => standard.has_numeric_value === (pageType.value === 'standards'))
    .filter(standard => standard.levels.some(level => level.level_number === activeLevelNumber.value))
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map(standard => ({
      id: standard.id,
      label: standard.name
    }))
)

const currentStandardLevels = computed(() =>
  standards.value
    .find(standard => standard.id === selectedId.value)
    ?.levels.toSorted((a, b) => a.gender.localeCompare(b.gender))
    .filter(level => level.level_number === activeLevelNumber.value)
)

function editStandard(): void {
  router.push({ name: 'update-standard', params: { id: selectedId.value } })
}

async function deleteStandard(): Promise<void> {
  const response = await del('/api/standards/' + selectedId.value)
  if (!response.ok) {
    alert('Произошла ошибка при удалении, попробуйте снова')
    return
  }
  standards.value = standards.value.filter(standard => standard.id !== selectedId.value)
  await setFirst()
}

</script>

<template>
  <TopPanel>
    <div class="buttons-panel">
      <v-btn
        v-for="n in 11"
        :key="n"
        :disabled="!levels.includes(n)"
        :text="n + ' УР'"
        :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst(n)" />
    </div>
    <template #right>
      <v-btn :to="{name: 'create-standard'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>

  <div v-auto-animate :class="{'technical-grid': pageType === 'technical'}" class="grid">
    <div v-if="pageType === 'standards'" class="standards-tables">
      <template v-if="currentStandardLevels">
        <StandardsTable
          v-for="level in currentStandardLevels"
          :key="level.id"
          :gender="level.gender"
          :high="level.high_level_value"
          :low="level.low_level_value"
          :middle="level.middle_level_value" />
      </template>
    </div>


    <div>
      <div class="side-nav-buttons">
        <v-btn
          :active="pageType==='standards'"
          class="button side-nav-button"
          size="small"
          text="Физические"
          variant="outlined"
          @click="pageType = 'standards'; setFirst()" />
        <v-btn
          :active="pageType==='technical'"
          class="button side-nav-button"
          size="small"
          text="Технические"
          variant="outlined"
          @click="pageType = 'technical'; setFirst()" />
      </div>
      <DataTableSideNav
        v-model="selectedId"
        :data="simplifiedStandards"
        :is-standard-type-technical="pageType==='technical'"
        :title="pageType==='standards' ? 'Физические' : 'Технические'"
        class="data-table-side-nav"
        @delete="deleteStandard"
        @edit="editStandard"
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

.technical-grid {
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
  flex-wrap: wrap;
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

@media (max-width: 600px) {
  a.v-btn {
    display: none;
  }

  button.v-btn {
    height: 1.5em;
  }

  .grid {
    grid-template-columns: 1fr;
    padding: 0 10px 10px;
    margin: 5px 0;
  }

  .buttons-panel {
    gap: 5px;
  }

  .data-table-side-nav {
    height: 200px
  }

  .standards-tables {
    order: 1;
  }

  @media (max-width: 430px) {
    button.v-btn {
      height: 1.3em;
    }
  }
}
</style>