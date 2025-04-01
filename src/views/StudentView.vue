<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import TopPanel from '@/components/TopPanel.vue';
import LevelPanel from '@/components/LevelPanel.vue';
import DataTableSideNav from '@/components/DataTableSideNav.vue';
import StudentTable from '@/components/StudentTable.vue';
import { del, get, getErrorMessage, post, showConfirmDialog } from '@/utils';
import type { StudentResponse, StudentStandardRequest, StudentStandardResponse } from '@/types/types';
import { useRoute } from 'vue-router';
import router from '@/router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';

const route = useRoute();
const { smAndUp } = useDisplay();
const studentId = computed(() => +route.params.id);
const studentInfo = ref<StudentResponse>();
const standardsInfo = ref<StudentStandardResponse[]>([]);
const activeLevelNumber = ref(-1);

const labels = computed(() => {
  if (!studentInfo.value) return [];
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
  ];
});

const standards = computed(() =>
  standardsInfo.value
    .filter(standard => standard.Level_number === activeLevelNumber.value)
);


async function getStandardsByStudentId(studentId: number) {
  try {
    const response = await get(`/api/students/${studentId}/standards/`);
    if (response.ok) {
      standardsInfo.value = await response.json();
    } else {
      toast.error(getErrorMessage((await response.json()).details));
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз');
  }
}

async function getStudentById(studentId: number) {
  try {
    const response = await get(`/api/students/${studentId}`);
    if (response.ok) {
      studentInfo.value = await response.json();
      route.meta.mobileTitle = studentInfo.value ? studentInfo.value.full_name : 'Студент не найден';
    } else {
      toast.error(getErrorMessage((await response.json()).details));
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз');
  }
}

function editStudent(): void {
  router.push({ name: 'update-student', params: { id: studentId.value } });
}

async function deleteStudent() {
  await showConfirmDialog({
    title: 'Удаление ученика',
    text: 'Вы уверены, что хотите удалить этого ученика?'
  });

  try {
    const response = await del('/api/students/' + studentId.value);
    if (response.ok) {
      await router.push({ name: 'my-diary' });
      toast.success('Ученик успешно удален');
    } else {
      toast.error(getErrorMessage((await response.json()).details));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
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
      }));

    const response = await post('/api/students/results/create_or_update/', request);
    if (response.ok) {
      await getStandardsByStudentId(studentId.value);
      toast.success('Данные успешно обновлены');
    } else {
      toast.error(getErrorMessage((await response.json()).details));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

onMounted(async () => {
  await getStudentById(studentId.value);
  await getStandardsByStudentId(studentId.value);
  await nextTick();
  activeLevelNumber.value = studentInfo?.value?.student_class.number ?? 0;
});
</script>

<template>
  <div>
    <TopPanel v-if="smAndUp" class="top-panel">
      <div class="top-panel-title">{{ studentInfo?.full_name ?? 'Студент не найден' }}</div>
    </TopPanel>
    <LevelPanel
      v-model="activeLevelNumber"
      :class-number="studentInfo?.student_class.number ?? 0"
      class="level-panel" />
    <div class="main">
      <StudentTable
        :data="standards"
        class="table"
        @save-data="saveStudentValue" />
      <DataTableSideNav
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

@media (max-width: 600px) {
  .main {
    flex-direction: column;
    align-items: center;
    padding: 0 10px 10px;
  }

  .info-panel {
    height: 300px;
  }
}
</style>