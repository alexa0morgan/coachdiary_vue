<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import MyDiaryTable from '@/components/MyDiaryTable.vue'
import FilterBlock from '@/components/FilterBlock.vue'
import ClassesPanel from '@/components/ClassesPanel.vue'
import type {
  ClassRequest,
  FilterData,
  StandardResponse,
  StudentResponse,
  StudentsValueResponse,
  StudentValueRequest
} from '@/types/types'

import { computed, onMounted, ref } from 'vue'
import { get, getErrorMessage, post } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useDisplay } from 'vuetify'
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue'


const router = useRouter()
const route = useRoute()
const { smAndUp, width } = useDisplay()
const w800 = computed(() => width.value <= 800)

const activeLevelNumber = ref(+route.query.classNumber! || -1)
const className = ref(route.query.letter as string || '')
const selectedStandardId = ref(+route.query.standard! || -1)

const classesData = ref<ClassRequest[]>([])
const standardsData = ref<StandardResponse[]>([])
const filteredData = ref<StudentsValueResponse[]>([])
const filters = ref<FilterData>({
  gender: null,
  grades: [],
  birthYearFrom: null,
  birthYearUntil: null
})
let studentsValueData: StudentsValueResponse[] = []
let studentsData: StudentResponse[] = []

const standardButtonText = computed(() => standards.value.find(v => v.id === selectedStandardId.value)?.label ??
  'Норматив')
const classButtonText = computed(() => {
  if (activeLevelNumber.value === 12) {
    return 'Все классы'
  } else if (activeLevelNumber.value === -1) {
    return 'Классы'
  } else {
    return activeLevelNumber.value + className.value
  }
})

const selectedStandardType = computed<'physical' | 'technical'>(() => {
  if (standardsData.value.find(v => v.id === selectedStandardId.value)?.has_numeric_value) {
    return 'physical'
  } else {
    return 'technical'
  }
})

const standards = computed(() => {
  let result = standardsData.value

  if (activeLevelNumber.value !== 12) {
    result = result.filter(standard => standard.levels.some(level => level.level_number === activeLevelNumber.value))
  }
  return result
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(standard => ({
      id: standard.id,
      label: standard.name
    }))
})

function updateClassesData(classes: ClassRequest[]) {
  classesData.value = classes
}

function updateStudentsData(students: StudentResponse[], classNumber: number, letter: string) {
  activeLevelNumber.value = classNumber
  className.value = letter
  studentsData = students
  filteredData.value = []

  filters.value = {
    gender: null,
    grades: [],
    birthYearFrom: null,
    birthYearUntil: null
  }

  if (!standards.value.some(v => v.id === selectedStandardId.value))
    selectedStandardId.value = -1

  getStudentsData()
}

function setQuery() {
  router.replace({
    query: {
      ...route.query,
      standard: selectedStandardId.value
    }
  })
}

async function getStudentsData() {
  setQuery()
  if (selectedStandardId.value === -1) return

  let currentClasses: number[]
  let currentStudentsData: StudentResponse[]

  if (activeLevelNumber.value === 12) {

    const standardsLevels = standardsData.value
      .reduce((acc, v) => {
        acc[v.id] = v.levels.map(level => level.level_number)
        return acc
      }, {} as Record<number, number[]>)


    currentClasses = classesData.value
      .filter(klass => standardsLevels[selectedStandardId.value].includes(klass.number))
      .map(klass => klass.id)

    currentStudentsData = studentsData
      .filter(student => currentClasses.includes(student.student_class.id))

  } else {
    currentClasses = classesData.value
      .filter(klass =>
        klass.number === activeLevelNumber.value
        && (className.value ? klass.class_name === className.value : true)
      )
      .map(klass => klass.id)
    currentStudentsData = studentsData
  }


  try {
    const currentStudentsValue: StudentsValueResponse[] = await get('/api/students/results/', {
      'class_id[]': currentClasses,
      standard_id: selectedStandardId.value
    }).then(res => res.json())

    studentsValueData = currentStudentsData.map(student => {
      const result = currentStudentsValue.find(v => v.id === student.id)
      return result ?? {
        ...student,
        value: null,
        grade: null
      }
    })
    filteredData.value = studentsValueData
  } catch {
    toast.error('Ошибка при получении данных, попробуйте позже')
  }
}


function acceptFilters() {
  filteredData.value = studentsValueData
    .filter(student =>
      (filters.value.gender ? student.gender === filters.value.gender : true)
      && (filters.value.grades.length ? filters.value.grades.includes(student.grade) : true)
      && (filters.value.birthYearFrom ? +student.birthday.slice(0, 4) >= filters.value.birthYearFrom : true)
      && (filters.value.birthYearUntil ? +student.birthday.slice(0, 4) <= filters.value.birthYearUntil : true)
    )
}

async function saveStudentsValue() {
  try {
    const request: StudentValueRequest[] = filteredData.value
      .filter(v => v.value != null && v.value)
      .map(student => ({
        student_id: student.id,
        standard_id: selectedStandardId.value,
        value: student.value == null ? null : +student.value
      }))

    const response = await post('/api/students/results/create_or_update/', request)

    if (response.ok) {
      await getStudentsData()
    } else {
      toast.error(getErrorMessage((await response.json()).errors))
    }
  } catch {
    toast.error('Ошибка при сохранении данных, попробуйте позже')
  }
}

onMounted(async () => {
  standardsData.value = await get('/api/standards/').then(res => res.json())

  if (activeLevelNumber.value !== -1 && selectedStandardId.value !== -1) {
    await getStudentsData()
  }
})

</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <ClassesPanel
      :classes-data
      menu
      @studentsData="updateStudentsData"
      @classes-data="updateClassesData" />
    <template #right v-if="w800">
      <BottomSheetWithButton
        button-color="secondary"
        button-text="фильтры"
        icon="mdi-filter"
        sheet-title="Фильтры">
        <template #default="{ toggle }">
          <FilterBlock v-model="filters"
                       class="filters-block-mobile"
                       mobile
                       @accept="acceptFilters(); toggle()"
          />
        </template>
      </BottomSheetWithButton>
    </template>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">
    <div class="buttons-panel">
      <keep-alive>

        <BottomSheetWithButton :button-text="classButtonText" sheet-title="Классы" eager>
          <template #default="{ toggle }">
            <ClassesPanel :classes-data
                          menu
                          direction-column
                          @studentsData="updateStudentsData"
                          @classes-data="updateClassesData"
                          @buttonClick="toggle" />
          </template>
        </BottomSheetWithButton>
      </keep-alive>

      <BottomSheetWithButton :button-text="standardButtonText" sheet-title="Нормативы" wrap-button>
        <template #default="{ toggle }">
          <DataTableSideNav v-model="selectedStandardId"
                            :data="standards"
                            :has-action-buttons="false"
                            class="data-table-side-nav-mobile"
                            @update:model-value="getStudentsData(); toggle()" />
        </template>
      </BottomSheetWithButton>
    </div>


    <BottomSheetWithButton button-text="фильтры" icon="mdi-filter" sheet-title="Фильтры">
      <template #default="{ toggle }">
        <FilterBlock v-model="filters" class="filters-block-mobile" mobile @accept="acceptFilters(); toggle()" />
      </template>
    </BottomSheetWithButton>
  </div>

  <div class="grid">

    <FilterBlock v-if="!w800" v-model="filters" class="filters-block" @accept="acceptFilters" />

    <MyDiaryTable :data="filteredData" :standard-type="selectedStandardType" class="table"
                  @saveData="saveStudentsValue" />

    <DataTableSideNav v-if="smAndUp" v-model="selectedStandardId" :data="standards"
                      :has-action-buttons="false" class="data-table-side-nav"
                      title="Нормативы" @update:model-value="getStudentsData" />
  </div>
</template>

<style scoped>

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
  max-width: calc(100dvw - 20px);
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 14px;
  align-items: center;
}

.buttons-panel {
  display: flex;
  gap: 10px;
}

.data-table-side-nav-mobile :deep(.v-btn.v-btn--active) {
  color: rgb(var(--v-theme-primary)) !important;
  border: 1px solid white !important;
}

.filters-block-mobile {
  color: white;
}

.filters-block-mobile :deep(.v-btn) {
  color: white;
}

.data-table-side-nav-mobile :deep(.v-btn) {
  color: white !important;
}

.data-table-side-nav-mobile :deep(.v-btn.v-btn--active) {
  color: rgb(var(--v-theme-primary)) !important;
  border: 1px solid white !important;
}

@media (width <= 950px) {
  .grid {
    grid-template-columns: 136px 1fr 160px;
  }

  .data-table-side-nav {
    width: min-content;
  }

  .filters-block {
    width: min-content;
  }
}


@media (width <= 800px) {
  .grid {
    grid-template-columns: 1fr 160px;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
    padding: 0 10px 10px;
    margin: 5px 0;
  }
}
</style>