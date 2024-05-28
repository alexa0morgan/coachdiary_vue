<script setup lang="ts">
import type {GenderNullable, FilterData } from '@/types/types'

const filterData = defineModel<FilterData>({required:true})

const emit = defineEmits<{
  accept: []
}>()

function selectGender(gender: GenderNullable): void {
  if (filterData.value.gender === gender) {
    filterData.value.gender = null
  } else {
    filterData.value.gender = gender
  }
}

const currentYear = new Date().getFullYear()

function clearFilters(): void {
  filterData.value.gender = null
  filterData.value.grades = []
  filterData.value.birthYearFrom = null
  filterData.value.birthYearUntil = null
  emit('accept')
}

</script>

<template>
<div class="filters-grid">

      <div class="filters">

        <div>
          <div class="title">Пол</div>
          <div class="filter-gender">
            <v-btn class="button" text="Ж" variant="outlined" size="small" :ripple="false" :active="filterData.gender
            === 'f'" @click="selectGender('f')" />
            <v-btn class="button" text="М" variant="outlined" size="small" :ripple="false"
                   :active="filterData.gender==='m'"
                   @click="selectGender('m')" />
          </div>
        </div>

        <div>
          <div class="title">Оценка</div>
          <div class="checkbox-group">
            <v-checkbox v-for="n in 4" :key="n" :label="(n +1).toString()" :value="n+1"
                        density="compact" v-model="filterData.grades" />
            <v-checkbox label="Нет" :value="null" density="compact" v-model="filterData.grades" />
          </div>
        </div>

        <div>
          <div class="title title-year">Год рождения</div>
          <div class="filter-year">
            <v-text-field label="От" type="number" density="compact" min="1900" :max="currentYear - 5"
                          v-model.number="filterData.birthYearFrom" />
            <v-text-field label="До" type="number" density="compact" min="1900" :max="currentYear - 5"
                          v-model.number="filterData.birthYearUntil" />
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <v-btn text="Сбросить" variant="outlined" color="error" size="small" class="button action-button"
               @click="clearFilters" />
        <v-btn text="Принять" variant="outlined" color="primary-darken-1" size="small" class="button action-button"
        @click="emit('accept')"/>
      </div>

    </div>
</template>

<style scoped>
.filters-grid {
  height: calc(100dvh - 180px);
  display: grid;
  grid-template-rows: 1fr auto;
  text-align: center;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: var(--v-border-radius);
  padding: 12px;
  overflow: hidden;
  @media (max-width: 600px){
    width: 100%;
  }
}

.filters {
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  margin-right: -5px;
  overflow-y: auto;
  scrollbar-width: thin;
  gap: 20px;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 10px;
}

.title-year {
  font-size: 14px;
  margin-bottom: 15px
}

.filter-gender {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100px;
  align-content: space-around;
}

.v-checkbox:deep(.v-selection-control) {
  min-height: 32px !important;
}

.checkbox-group :deep(.v-label) {
  opacity: 1;
  color: black;
}

.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  height: auto !important;
  min-height: 24px;
}

.filter-year {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 15px;
}
</style>