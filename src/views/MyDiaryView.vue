<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue'
import { computed, onMounted, ref } from 'vue'
import { get, getErrorMessage, post } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import MyDiaryTable from '@/components/MyDiaryTable.vue'
import FilterBlock from '@/components/FilterBlock.vue'
import type {
  ClassRequest,
  FilterData,
  StandardResponse,
  StudentResponse,
  StudentsValueResponse,
  StudentValueRequest
} from '@/types/types'
import ClassesPanel from '@/components/ClassesPanel.vue'
import { toast } from 'vue-sonner'


const router = useRouter()
const route = useRoute()

const activeLevelNumber = ref(+route.query.classNumber! || -1)
const className = ref(route.query.letter as string || '')
const selectedStandardId = ref(+route.query.standard! || -1)

const selectedStandardType = computed<'physical' | 'technical'>(() => {
  if (standardsData.value.find(v => v.id === selectedStandardId.value)?.has_numeric_value) {
    return 'physical'
  } else {
    return 'technical'
  }
})

const classesData = ref<ClassRequest[]>([])
const standardsData = ref<StandardResponse[]>([])
const studentsValueData = ref<StudentsValueResponse[]>([])
const filteredData = ref<StudentsValueResponse[]>([])
const currentStudentsData = ref<StudentResponse[]>([])


function updateClassesData(classes: ClassRequest[]) {
  classesData.value = classes
}

function updateStudentsData(students: StudentResponse[], classNumber: number, letter: string) {
  activeLevelNumber.value = classNumber
  className.value = letter
  currentStudentsData.value = students
  filteredData.value = []
  if (!standards.value.some(v => v.id === selectedStandardId.value))
    selectedStandardId.value = -1

  getStudentsData()
}

onMounted(async () => {
  standardsData.value = await get('/api/standards/').then(res => res.json())
  if (activeLevelNumber.value !== -1 && selectedStandardId.value !== -1) {
    await getStudentsData()
  }
})


const standards = computed(() =>
  standardsData.value
    .filter(standard => standard.levels.some(level => level.level_number === activeLevelNumber.value))
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map(standard => ({
      id: standard.id,
      label: standard.name
    }))
)

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


  const currentClasses = classesData.value
    .filter(klass =>
      klass.number === activeLevelNumber.value
      && (className.value ? klass.class_name === className.value : true)
    )
    .map(klass => klass.id.toString())
  try {
    const currentStudentsValue: StudentsValueResponse[] = await get('/api/students/results/', {
      'class_id[]': currentClasses,
      standard_id: selectedStandardId.value
    }).then(res => res.json())

    studentsValueData.value = currentStudentsData.value.map(student => {
      const result = currentStudentsValue.find(v => v.id === student.id)
      return result ?? {
        ...student,
        value: null,
        grade: null
      }
    })
    filteredData.value = studentsValueData.value
  } catch {
    toast.error('Ошибка при получении данных, попробуйте позже')
  }
}

const filters = ref<FilterData>({
  gender: null,
  grades: [],
  birthYearFrom: null,
  birthYearUntil: null
})

function acceptFilters() {
  filteredData.value = studentsValueData.value
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
      .filter(v => v.value !== null && v.value)
      .map(student => ({
        student_id: student.id,
        standard_id: selectedStandardId.value,
        value: student.value
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

</script>

<template>
  <TopPanel>
    <classes-panel :classes-data menu @studentsData="updateStudentsData" @classes-data="updateClassesData" />
  </TopPanel>

  <div class="grid">

    <FilterBlock v-model="filters" class="filters-block" @accept="acceptFilters" />

    <MyDiaryTable :data="filteredData" :standard-type="selectedStandardType" class="table"
                    @saveData="saveStudentsValue" />

    <DataTableSideNav v-model="selectedStandardId" :data="standards"
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

@media (max-width: 960px) {
  a.v-btn {
    display: none;
  }

  .grid {
    grid-template-columns: 1fr;
    padding: 0 10px 10px;
    margin: 5px 0;
  }

  .filters-block {
    @media (max-width: 600px) {
      width: 100%;
      height: 200px;
    }
  }

  .data-table-side-nav {
    order: 1;
    height: 200px
  }

  .table {
    order: 2;
  }
}
</style>