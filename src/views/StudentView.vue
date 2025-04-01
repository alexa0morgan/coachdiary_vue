<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import StudentTable from '@/components/StudentTable.vue'
import { del, get, getErrorMessage, post, showConfirmDialog } from '@/utils'
import type { StudentResponse, StudentStandardRequest, StudentStandardResponse } from '@/types/types'
import { useRoute } from 'vue-router'
import router from '@/router'
import { toast } from 'vue-sonner'
import { useDisplay } from 'vuetify'
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue'

const route = useRoute()
const { smAndUp } = useDisplay()
const studentId = computed(() => +route.params.id)
const studentInfo = ref<StudentResponse>()
const standardsInfo = ref<StudentStandardResponse[]>([])
const selectedLevelNumber = ref(-1)

const levelButtonText = computed(() => selectedLevelNumber.value != -1 ? (selectedLevelNumber.value + ' год обучения') :
  'Года обучения')
const studentButtonText = computed(() => studentInfo.value?.full_name ?? 'Студент не найден')

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
    .filter(standard => standard.Level_number === selectedLevelNumber.value)
)


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

async function saveStudentValue() {
  try {
    const request: StudentStandardRequest[] = standards.value
      .filter(v => v.Value != null && v.Value)
      .map(v => ({
        student_id: studentId.value,
        standard_id: v.Standard.Id,
        value: v.Standard.Has_numeric_value ? v.Value : v.Grade,
        level_number: v.Level_number
      }))

    const response = await post('/api/students/results/create_or_update/', request)
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

onMounted(async () => {
  await getStudentById(studentId.value)
  await getStandardsByStudentId(studentId.value)
  await nextTick()
  selectedLevelNumber.value = studentInfo?.value?.student_class.number ?? 0
})
</script>

<template>

  <TopPanel v-if="smAndUp" class="top-panel">
    <div class="top-panel-title">{{ studentInfo?.full_name ?? 'Студент не найден' }}</div>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">

    <BottomSheetWithButton :button-text="levelButtonText" sheet-title="Года обучения" eager>
      <template #default="{ toggle }">
        <LevelPanel
          v-model="selectedLevelNumber"
          :class-number="studentInfo?.student_class.number ?? 0"
          class="level-button-mobile"
          mobile
          color="secondary"
          @update:model-value="toggle" />
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton button-text="Информация" sheet-title="Информация" wrap-button>
      <template #default="{ toggle }">
        <DataTableSideNav :data="labels"
                          is-content-static-text
                          page-type="student"
                          class="info-panel-mobile"
                          @delete="deleteStudent"
                          @edit="editStudent"
                          @update:model-value="toggle" />
      </template>
    </BottomSheetWithButton>

  </div>


  <div class="main">
    <LevelPanel v-if="smAndUp"
                v-model="selectedLevelNumber"
                :class-number="studentInfo?.student_class.number ?? 0"
                class="level-panel" />

    <div class="grid">
      <StudentTable
        :data="standards"
        class="table"
        @save-data="saveStudentValue" />

      <DataTableSideNav v-if="smAndUp"
                        :data="labels"
                        is-content-static-text
                        page-type="student"
                        title="Информация"
                        class="info-panel"
                        @delete="deleteStudent"
                        @edit="editStudent" />
    </div>
  </div>
</template>

<style scoped>

.main {
  max-width: 1200px;
  margin: 10px auto 0;

  @media (max-width: 600px) {
    margin: 10px;
  }
}

.grid {
  display: flex;
  gap: 10px;
}

.table {
  height: calc(100dvh - 220px);

  @media (max-width: 600px) {
    height: calc(100dvh - 182px);
  }
}

.info-panel {
  height: calc(100dvh - 220px);
}

.level-panel {
  margin-bottom: 10px;
}

.info-panel-mobile :deep(.v-btn) {
  color: white !important;
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 15px;
}

.level-button-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

</style>