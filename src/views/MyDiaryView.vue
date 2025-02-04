<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue'
import { computed, onMounted, ref } from 'vue'
import { get, post } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import MyClassesTable from '@/components/MyClassesTable.vue'
import FilterBlock from '@/components/FilterBlock.vue'
import type {
  ClassRequest,
  FilterData,
  StandardResponse,
  StudentResponse,
  StudentsValueResponse,
  StudentValueRequest
} from '@/types/types'


const router = useRouter()
const route = useRoute()

const activeLevelNumber = ref(+route.query.classNumber! || -1)
const className = ref(route.query.letter as string || '')
const fullClassName = computed(() =>
  className.value ? activeLevelNumber.value + className.value : activeLevelNumber.value
)
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

onMounted(async () => {
  classesData.value = await get('/api/classes/').then(res => res.json())
  standardsData.value = await get('/api/standards/').then(res => res.json())
  if (activeLevelNumber.value !== -1 && selectedStandardId.value !== -1) {
    await getStudentsData()
  }
})

const classes = computed(() =>
  classesData.value
    .reduce((acc, v) => {
      if (!(v.number in acc)) {
        acc[v.number] = [] as string[]
      }
      acc[v.number].push(v.class_name)
      return acc
    }, {} as Record<number, string[]>)
)

const standards = computed(() =>
  standardsData.value
    .filter(standard => standard.levels.some(level => level.level_number === activeLevelNumber.value))
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map(standard => ({
      id: standard.id,
      label: standard.name
    }))
)



async function getStudentsData() {
  router.replace({
    query: {
      classNumber: activeLevelNumber.value,
      letter: className.value,
      standard: selectedStandardId.value
    }
  })
  if (selectedStandardId.value === -1) return


  const currentClasses = classesData.value
    .filter(klass =>
      klass.number === activeLevelNumber.value
      && (className.value ? klass.class_name === className.value : true)
    )
    .map(klass => klass.id.toString())
  try {
    const currentStudents: StudentResponse[] = await get('/api/students/', {
      'student_class': fullClassName.value
    }).then(res => res.json())
    const currentStudentsValue: StudentsValueResponse[] = await get('/api/students/results/', {
      'class_id[]': currentClasses,
      standard_id: selectedStandardId.value
    }).then(res => res.json())

    studentsValueData.value = currentStudents.map(student => {
      const result = currentStudentsValue.find(v => v.id === student.id)
      return result ?? {
        ...student,
        value: null,
        grade: null
      }
    })
    filteredData.value = studentsValueData.value
  } catch {
    alert('Ошибка при получении данных, попробуйте позже')
  }
}

function activeLevelClick(classNumber: number, letter: string) {
  activeLevelNumber.value = classNumber
  className.value = letter
  filteredData.value = []
  selectedStandardId.value = -1
  router.replace({ query: { classNumber, letter } })
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
      alert('Ошибка при отправке данных, попробуйте позже')
    }

  } catch {
    alert('Ошибка сервера при отправке данных, попробуйте позже')
  }
}

</script>

<template>
  <TopPanel>
    <div class="buttons-panel">
      <v-btn v-for="n in 11" :key="n" :disabled="!(n in classes)"
             :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
             class="level-button top-button" color="rgb(var(--v-theme-secondary))">
        {{ n }}{{ activeLevelNumber === n ? className : '' }}
        <v-menu activator="parent" location="bottom center" offset="5"
                transition="slide-y-transition">
          <v-list base-color="rgb(var(--v-theme-secondary))" bg-color="rgb(var(--v-theme-primary))"
                  density="compact" elevation="0">
            <v-list-item v-for="letter in classes[n]" :key='n + letter' class="text-center"
                         @click="activeLevelClick(n, letter)">
              <v-list-item-title>{{ letter.toUpperCase() }}</v-list-item-title>
            </v-list-item>
            <v-list-item class="text-center" @click="activeLevelClick(n, '')">
              <v-list-item-title>Параллель</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-btn>
    </div>
    <template #right>
      <v-btn :to="{name: 'create-student'}" color="rgb(var(--v-theme-secondary))" icon="mdi-plus"
             variant="outlined" />
    </template>
  </TopPanel>

  <div class="grid">

    <FilterBlock v-model="filters" class="filters-block" @accept="acceptFilters" />

    <MyClassesTable :data="filteredData" :standard-type="selectedStandardType" class="table"
                    @saveData="saveStudentsValue" />

    <DataTableSideNav v-model="selectedStandardId" :data="standards"
                      :has-action-buttons="false" class="data-table-side-nav"
                      title="Нормативы" @update:model-value="getStudentsData" />
  </div>
</template>

<style scoped>
.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  max-width: calc(100dvw - 20px);
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

@media (max-width: 430px) {
  button.v-btn {
    height: 1.3em;
  }
}


</style>