<script lang="ts" setup>

import StandardsTable from '@/components/StandardsTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import TopPanel from '@/components/TopPanel.vue'
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue'

import { computed, nextTick, onMounted, ref } from 'vue'
import { del, get, getErrorMessage, showConfirmDialog } from '@/utils'
import type { StandardResponse } from '@/types/types'
import router from '@/router'
import { toast } from 'vue-sonner'
import { useDisplay } from 'vuetify'


const { smAndUp } = useDisplay()

const selectedLevelNumber = ref(-1)
const pageType = ref<'standards' | 'technical'>('standards')

const selectedStandardId = ref(-1)
const standards = ref<StandardResponse[]>([])

const levelButtonText = computed(() => selectedLevelNumber.value != -1 ? (selectedLevelNumber.value + ' год обучения') :
  'Года обучения')
const standardButtonText = computed(() => simplifiedStandards.value.find(v => v.id === selectedStandardId.value)?.label ?? 'Норматив')


onMounted(async () => {
  standards.value = await get('/api/standards/').then(res => res.json())
  await setFirst()
})

async function setFirst(levelNumber?: number): Promise<void> {
  selectedLevelNumber.value = levelNumber ?? levels.value[0] ?? -1
  await nextTick()
  selectedStandardId.value = simplifiedStandards.value[0]?.id ?? -1
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
    .filter(standard => standard.levels.some(level => level.level_number === selectedLevelNumber.value))
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map(standard => ({
      id: standard.id,
      label: standard.name
    }))
)

const currentStandardLevels = computed(() =>
  standards.value
    .find(standard => standard.id === selectedStandardId.value)
    ?.levels.toSorted((a, b) => a.gender.localeCompare(b.gender))
    .filter(level => level.level_number === selectedLevelNumber.value)
)

function editStandard(): void {
  router.push({ name: 'update-standard', params: { id: selectedStandardId.value } })
}

async function deleteStandard(): Promise<void> {
  await showConfirmDialog({
    title: 'Удаление норматива',
    text: 'Вы уверены, что хотите удалить этот норматив?'
  })

  try {
    const response = await del('/api/standards/' + selectedStandardId.value)
    if (response.ok) {
      standards.value = standards.value.filter(standard => standard.id !== selectedStandardId.value)
      await setFirst()
      toast.success('Норматив был успешно удален')
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}


</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <div class="buttons-panel">
      <v-btn
        v-for="n in 11"
        :key="n"
        :disabled="!levels.includes(n)"
        :text="n + ' год'"
        :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst(n)" />
    </div>
    <template #right>
      <v-btn :to="{name: 'create-standard'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>


  <div v-if="!smAndUp" class="top-panel-mobile">
    <BottomSheetWithButton :button-text="levelButtonText" sheet-title="Года обучения">
      <template #default="{ toggle }">
        <div class="level-button-mobile">
          <v-btn
            v-for="n in 11"
            :key="n"
            :disabled="!levels.includes(n)"
            :text="n + ' год'"
            :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
            class="level-button button"
            color="rgb(var(--v-theme-secondary))"
            @click="setFirst(n); toggle()" />
        </div>
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton :button-text="standardButtonText" sheet-title="Нормативы" wrap-button>
      <template #default="{ toggle }">
        <div class="side-nav-buttons">
          <v-btn
            :active="pageType==='standards'"
            class="button side-nav-button-mobile"
            size="small"
            text="Физические"
            variant="outlined"
            @click="pageType = 'standards'; setFirst()" />
          <v-btn
            :active="pageType==='technical'"
            class="button side-nav-button-mobile"
            size="small"
            text="Технические"
            variant="outlined"
            @click="pageType = 'technical'; setFirst()" />
        </div>
        <DataTableSideNav
          v-model="selectedStandardId"
          :data="simplifiedStandards"
          :is-standard-type-technical="pageType==='technical'"
          :has-action-buttons="false"
          class="data-table-side-nav-mobile"
          @update:model-value="toggle"
        />
      </template>
    </BottomSheetWithButton>
  </div>

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

    <div v-if="!smAndUp" class="action-buttons-mobile">
      <v-btn class="button"
             color="primary-darken-1"
             text="Изменить"
             variant="outlined"
             @click="editStandard" />
      <v-btn class="button"
             color="error"
             variant="outlined"
             text="Удалить"
             @click="deleteStandard" />
    </div>


    <div v-if="smAndUp">
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
        v-model="selectedStandardId"
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

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0 10px;
    margin: 25px 0;
  }
}

.technical-grid {
  grid-template-columns: 1fr;
}

.standards-tables {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 30px;

  @media (width <= 600px) {
    margin-top: 0;
  }
}

.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  border-radius: var(--v-border-button-radius);
}

/*стиль для небольшой границы у кнопок, теперь кнопки не скачут*/
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

.side-nav-button-mobile {
  color: white !important;
}

.data-table-side-nav {
  height: calc(100vh - 220px);
}

.data-table-side-nav-mobile :deep(.v-btn) {
  color: white !important;
}

.data-table-side-nav-mobile :deep(.v-btn.v-btn--active) {
  color: rgb(var(--v-theme-primary)) !important;
  border: 1px solid white !important;
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}

.action-buttons-mobile {
  display: flex;
  gap: 20px;
  padding: 0 10px;
  margin-top: 30px;
}

.level-button-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

</style>