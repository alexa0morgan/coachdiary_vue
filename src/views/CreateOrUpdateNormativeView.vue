<script setup lang="ts">

import TopPanel from '@/components/TopPanel.vue'
import FieldSet from '@/components/FieldSet.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { NormativeResponse, NormativeRequest } from '@/types/types'
import { get, post, put } from '@/utils'

const route = useRoute()
const pageType = ref(route.name as 'create-normative' | 'update-normative')

const normativeName = ref('')
const normativeType = ref<'standard' | 'skill' | null>(null)

const currentLevel = ref(-1)
const levelNumbers = ref<number[]>([])
const levels = ref<Record<number, Level>>({})

interface Level {
  girls: LevelValues;
  boys: LevelValues;
}

interface LevelValues {
  high: number;
  middle: number;
  low: number;
}

for (let i = 1; i <= 11; i++) {
  levels.value[i] = {
    girls: {
      high: 0,
      middle: 0,
      low: 0
    },
    boys: {
      high: 0,
      middle: 0,
      low: 0
    }
  }
}

watch(levelNumbers, () => {
  if (levelNumbers.value.length === 0) currentLevel.value = -1
  else if (currentLevel.value === -1) currentLevel.value = Math.min(...levelNumbers.value)
  else if (!levelNumbers.value.includes(currentLevel.value)) currentLevel.value = Math.min(...levelNumbers.value)
})

const isNextLevelButtonDisabled = computed(() => {
  return !levelNumbers.value.some(value => value > currentLevel.value)
})

const isPreviousLevelButtonDisabled = computed(() => {
  return !levelNumbers.value.some(value => value < currentLevel.value)
})

function toNextLevel() {
  for (let i = currentLevel.value + 1; i <= 11; i++) {
    if (levelNumbers.value.includes(i)) {
      currentLevel.value = i
      return
    }
  }
}

function toPreviousLevel() {
  for (let i = currentLevel.value - 1; i >= 1; i--) {
    if (levelNumbers.value.includes(i)) {
      currentLevel.value = i
      return
    }
  }
}

async function createOrUpdateNormative() {
  try {
    const requestData: NormativeRequest = {
      name: normativeName.value,
      has_numeric_value: normativeType.value === 'standard',
      levels: Object
        .entries(levels.value)
        .filter(([key]) => levelNumbers.value.includes(+key))
        .map(([key, value]) => [
          {
            level_number: +key,
            low_level_value: value.girls.low,
            middle_level_value: value.girls.middle,
            high_level_value: value.girls.high,
            gender: 'f' as const
          },
          {
            level_number: +key,
            low_level_value: value.boys.low,
            middle_level_value: value.boys.middle,
            high_level_value: value.boys.high,
            gender: 'm' as const
          }
        ])
        .flat()
    }

    const currentId = pageType.value === 'update-normative' ? `${route.params.id}/` : ''
    const currentMethod = pageType.value === 'update-normative' ? put : post

    const response = await currentMethod(`/api/standards/` + currentId, requestData)

    if (response.ok) {
      alert('Норматив создан')
      normativeName.value = ''
      normativeType.value = null
      levelNumbers.value = []
    } else {
      const data = await response.json()
      if (data?.status === 'error') {
        const errors = Object.values(data.details).flat().join('\n')
        alert(errors)
      }
    }
  } catch (e) {
    alert('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}

const isSaveButtonDisabled = computed(() => {
  return !normativeName.value
    || !normativeType.value
    || levelNumbers.value.length === 0
    || (
      Object
        .entries(levels.value)
        .some(([key, value]) =>
          levelNumbers.value.includes(+key) && (
            value.girls.high === 0
            || value.girls.middle === 0
            || value.girls.low === 0
            || value.boys.low === 0
            || value.boys.middle === 0
            || value.boys.high === 0
          )
        )
      && normativeType.value !== 'skill'
    )
})

onMounted(async () => {
  if (pageType.value === 'update-normative') {
    const data: NormativeResponse = await get(`/api/standards/${route.params.id}/`).then(res => res.json())
    normativeName.value = data.name
    normativeType.value = data.has_numeric_value ? 'standard' : 'skill'

    for (const level of data.levels) {
      const key = level.gender === 'f' ? 'girls' : 'boys'
      levels.value[level.level_number][key] = {
        high: level.high_level_value,
        middle: level.middle_level_value,
        low: level.low_level_value
      }

      if (!levelNumbers.value.includes(level.level_number)) levelNumbers.value.push(level.level_number)
    }

    currentLevel.value = Math.min(...levelNumbers.value) ?? -1
  }
})

</script>

<template>

  <TopPanel>{{ pageType === 'create-normative' ? 'Создание норматива' : 'Обновление норматива' }}</TopPanel>
  <div class="grid" v-auto-animate>

    <FieldSet title="Тип">
      <v-radio-group v-model="normativeType" :disabled="pageType === 'update-normative'" row>
        <v-radio label="Стандарт" value="standard" />
        <v-radio label="Умение" value="skill" />
      </v-radio-group>
    </FieldSet>

    <v-text-field v-model="normativeName" label="Название" class="normative-name" />


    <FieldSet title="Уровни">
      <p class="levels-text">Выберите один <br /> или несколько</p>

      <div class="checkbox-group">
        <v-checkbox v-for="n in 11" :key="n" v-model="levelNumbers" :label="n.toString()" :value="n"
                    density="compact" />
      </div>
    </FieldSet>

    <FieldSet v-if="normativeType==='standard'" title="Нормы">
      <template v-if="levelNumbers.length && currentLevel !== -1">
        <div class="standards-table">
          <div class="standards">
            <div class="standards-table-title">Девочки</div>
            <v-text-field v-model.number="levels[currentLevel].girls.high" label="Повышенная ступень" type="number"
                          min="0"
                          density="comfortable" />
            <v-text-field v-model.number="levels[currentLevel].girls.middle" label="Средняя ступень" type="number"
                          min="0"
                          density="comfortable" />
            <v-text-field v-model.number="levels[currentLevel].girls.low" label="Низкая ступень" type="number" min="0"
                          density="comfortable" />

          </div>
          <div class="standards">
            <div class="standards-table-title">Мальчики</div>
            <v-text-field v-model.number="levels[currentLevel].boys.high" label="Повышенная ступень" type="number"
                          min="0"
                          density="comfortable" />
            <v-text-field v-model.number="levels[currentLevel].boys.middle" label="Средняя ступень" type="number"
                          min="0"
                          density="comfortable" />
            <v-text-field v-model.number="levels[currentLevel].boys.low" label="Низкая ступень" type="number" min="0"
                          density="comfortable" />
          </div>
        </div>

        <div class="pagination">
          <v-btn :disabled="isPreviousLevelButtonDisabled" text="Предыдущий уровень" variant="text"
                 prepend-icon="mdi-arrow-left" @click="toPreviousLevel" />
          <div>{{ currentLevel }} ур</div>
          <v-btn :disabled="isNextLevelButtonDisabled" text="Следующий уровень" variant="text"
                 append-icon="mdi-arrow-right" @click="toNextLevel" />
        </div>
      </template>

    </FieldSet>
    <v-btn :disabled="isSaveButtonDisabled" text="Сохранить" color="primary" rounded class="button"
           @click="createOrUpdateNormative" />
  </div>


</template>

<style scoped>
.grid {
  max-width: 1000px;
  margin: 20px auto;
  padding: 30px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 30px 70px;
  align-items: stretch;
  background: rgb(var(--v-theme-surface));
}

.levels-text {
  text-align: center;
  line-height: 120%;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 250px;
  align-content: center;
  gap: 0 32px;
  margin-top: 10px;
}

.grid :deep(.v-label) {
  opacity: 1;
  color: black;
}

.grid :deep(.v-text-field .v-label) {
  opacity: var(--v-medium-emphasis-opacity);
}

.normative-name {
  align-self: center;
}

.standards-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.standards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 15px 5px;
}

.standards-table-title {
  margin-left: 10px;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  grid-column: span 2;
  justify-self: end;
}
</style>