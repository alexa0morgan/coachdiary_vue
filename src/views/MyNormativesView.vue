<script lang="ts" setup>

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
        :key="n"
        :disabled="!levels.includes(n)"
        :text="n + ' УР'"
        :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst(n)" />
    </div>
    <template #right>
      <v-btn :to="{name: 'create-normative'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>

  <div v-auto-animate :class="{'skills-grid': pageType === 'skills'}" class="grid">
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
          text="Стандарты"
          variant="outlined"
          @click="pageType = 'standards'; setFirst()" />
        <v-btn
          :active="pageType==='skills'"
          class="button side-nav-button"
          size="small"
          text="Умения"
          variant="outlined"
          @click="pageType = 'skills'; setFirst()" />
      </div>
      <DataTableSideNav
        v-model="selectedId"
        :data="simplifiedNormatives"
        :is-page-type-skills="pageType==='skills'"
        :title="pageType==='standards' ? 'Стандарты' : 'Умения'"
        class="data-table-side-nav"
        @delete="deleteNormative"
        @edit="editNormative"
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