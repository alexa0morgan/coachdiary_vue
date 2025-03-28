<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTable from '@/components/DataTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import { del, get, getErrorMessage, post, showConfirmDialog } from '@/utils'
import type { StudentResponse, StudentStandardRequest, StudentStandardResponse } from '@/types/types'
import { useRoute } from 'vue-router'
import router from '@/router'
import { toast } from 'vue-sonner'
import { useDisplay } from 'vuetify'

const route = useRoute()
const { smAndUp } = useDisplay()
const studentId = computed(() => +route.params.id)
const studentInfo = ref<StudentResponse>()
const standardsInfo = ref<StudentStandardResponse[]>([])
const activeLevelNumber = ref(-1)
const changedData = ref<StudentStandardRequest>()

onMounted(async () => {
  await getStudentById(studentId.value)
  await getStandardsByStudentId(studentId.value)
  await nextTick()
  activeLevelNumber.value = studentInfo?.value?.student_class.number ?? 0
})

async function getStandardsByStudentId(studentId: number) {

  try {
    const response = await get(`/api/students/${studentId}/standards/`)
    if (response.ok) {
      standardsInfo.value = await response.json()
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз')
  }

}

async function getStudentById(studentId: number) {

  try {
    const response = await get(`/api/students/${studentId}`)
    if (response.ok) {
      studentInfo.value = await response.json()
      route.meta.mobileTitle = studentInfo.value ? studentInfo.value.full_name : 'Студент не найден'
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз')
  }

}

const labels = computed(() => {
  if (!studentInfo.value) return []
  return [
    {
      id: 0,
      label: `Дата рождения: ${new Date(studentInfo.value.birthday).toLocaleDateString()}`
    },
    {
      id: 1,
      label: `Класс: ${studentInfo.value.student_class.number}${studentInfo.value?.student_class.class_name}`
    },
    {
      id: 2,
      label: `Пол: ${studentInfo.value.gender === 'm' ? 'муж' : 'жен'}`
    }
  ]
})

const standards = computed(() =>
  standardsInfo.value
    .filter(standard => standard.Level_number === activeLevelNumber.value)
    .map(standard => ({
      student_id: studentId.value,
      id: standard.Standard.Id,
      has_numeric_value: standard.Standard.Has_numeric_value,
      standard: standard.Standard.Name,
      result: standard.Value ?? 0,
      rate: standard.Grade ?? 0,
      level_number: activeLevelNumber.value
    }))
)

function editStudent(): void {
  router.push({ name: 'update-student', params: { id: studentId.value } })
}

async function deleteStudent() {

  await showConfirmDialog({
    title: 'Удаление ученика',
    text: 'Вы уверены, что хотите удалить этого ученика?'
  })

  try {
    const response = await del('/api/students/' + studentId.value)
    if (response.ok) {
      await router.push({ name: 'my-diary' })
      toast.success('Ученик успешно удален')
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}

async function postData() {
  try {
    const response = await post('/api/students/results/create_or_update/', changedData.value)
    if (response.ok) {
      await getStandardsByStudentId(studentId.value)
      toast.success('Данные успешно обновлены')
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз')
  }
}
</script>

<template>
  <div>
    <TopPanel v-if="smAndUp" class="top-panel">
      <div class="top-panel-title">{{ studentInfo?.full_name ?? 'Студент не найден' }}</div>
    </TopPanel>
    <LevelPanel
      v-model="activeLevelNumber"
      :classNumber="studentInfo?.student_class.number ?? 0"
      class="level-panel" />
    <div class="main">
      <DataTable
        v-model="changedData"
        :data="standards"
        class="table"
        @dataChanged="postData" />
      <DataTableSideNav
        :data="labels"
        :isContentStaticText="true"
        :pageType="'student'"
        :title="'Информация'"
        class="info-panel"
        @delete="deleteStudent"
        @edit="editStudent" />
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