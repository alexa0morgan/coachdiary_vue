<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTable from '@/components/DataTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import { get, del, post } from '@/utils'
import type { StudentResponse, StudentStandardResponse, StudentStandardRequest } from '@/types/types'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const studentId = computed(() => +route.params.id)
const studentInfo = ref<StudentResponse>()
const standardsInfo = ref<StudentStandardResponse[]>([])
const activeLevelNumber = ref(-1)
const changedData = ref<StudentStandardRequest>()

onMounted(async () => {
  await getStudentById(studentId.value)
  await getNormativesByStudentId(studentId.value)
  await nextTick()
  activeLevelNumber.value = studentInfo?.value?.student_class.number ?? 0
})

async function getNormativesByStudentId(studentId: number) {
  standardsInfo.value = await get(`/api/students/${studentId}/standards/`)
    .then(res => res.json())
    .catch(() => {
      alert('Ошибка доступа к данным')
    })
}

async function getStudentById(studentId: number) {
  studentInfo.value = await get(`/api/students/${studentId}`)
    .then(res => res.json())
    .catch(() => {
      alert('Ошибка доступа к данным')
    })
}

const labels = computed(() => {
  if (!studentInfo.value) return []
  return [
    {
      id: 0,
      label: `Дата рождения: ${studentInfo.value.birthday}`
    },
    {
      id: 1,
      label: `Класс: ${studentInfo.value.student_class.number}${studentInfo.value?.student_class.class_name}`
    },
    {
      id: 2,
      label: `Пол: ${studentInfo.value.gender === 'm' ? 'мальчик' : 'девочка'}`
    }
  ]
})

const normatives = computed(() =>
  standardsInfo.value
    .filter(standard => standard.Level_number === activeLevelNumber.value)
    .map(standard => ({
      student_id: studentId.value,
      id: standard.Standard.Id,
      has_numeric_value: standard.Standard.Has_numeric_value,
      normative: standard.Standard.Name,
      result: standard.Value ?? 0,
      rate: standard.Grade ?? 0,
      level_number: activeLevelNumber.value
    }))
)

function editStudent(): void {
  router.push({ name: 'update-student', params: { id: studentId.value } })
}

async function deleteStudent() {
  const response = await del('/api/students/' + studentId.value)
  if (!response.ok) {
    alert('Произошла ошибка при удалении, попробуйте снова')
    return
  }
  router.push({ name: 'my-classes' })
}

async function postData() {
  try {
    const response = await post('/api/students/results/create_or_update/', changedData.value)
    if (response.ok) {
      await getNormativesByStudentId(studentId.value)
      alert('Данные успешно изменены')
    } else {
      alert('Ошибка при отправке данных, попробуйте позже')
    }
  } catch {
    alert('Ошибка при отправке данных, попробуйте позже')
  }
}
</script>

<template>
  <div>
    <TopPanel class="top-panel">
      <div class="top-panel-title">{{ studentInfo?.full_name ?? 'Студент не найден' }}</div>
    </TopPanel>
    <LevelPanel
      v-model="activeLevelNumber"
      :classNumber="studentInfo?.student_class.number ?? 0"
      class="level-panel" />
    <div class="main">
      <DataTable
        v-model="changedData"
        class="table"
        :data="normatives"
        @dataChanged="postData" />
      <DataTableSideNav
        class="info-panel"
        :title="'Информация'"
        :data="labels"
        :isContentStaticText="true"
        :pageType="'student'"
        :hasDeleteMenu="false"
        @edit="editStudent"
        @delete="deleteStudent" />
    </div>

  </div>

</template>

<style scoped>

.main {
  display: flex;
  justify-content: space-evenly;
  align-items: start;
  gap: 10px;
  max-width: 1200px;
  margin: 10px auto 0;
}

.table {
  height: calc(100dvh - 230px);
}

.info-panel {
  height: calc(100dvh - 230px);
}

.info-title {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 20px;
  border-bottom: 1px solid rgb(var(--v-another-surface));
  margin: 5px 18px 15px;
  padding: 0 0 3px;
}

.list {
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-primary));
  display: grid;
  gap: 5px;
}

.list-item {
  background-color: rgb(var(--v-theme-surface));
  border-radius: var(--v-border-radius);
  border: 1px solid rgb(var(--v-theme-primary));
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  min-height: 24px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

@media (max-width: 600px) {
  .top-panel-title {
    font-size: 14px;
  }

  .top-panel {
    padding: 0;
    margin-bottom: 10px;
  }

  .main {
    flex-direction: column;
    align-items: center;
    padding: 0 10px 10px;
  }

  .info-panel {
    height: 300px;
  }

  .info-title {
    font-size: 14px;
    text-align: center;
  }

  .list-item:deep(.v-list-item) {
    width: 100px;
  }
}
</style>