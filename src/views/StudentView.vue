<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import TopPanel from '@/components/TopPanel.vue';
import LevelPanel from '@/components/LevelPanel.vue';
import DataTableSideNav from '@/components/DataTableSideNav.vue';
import StudentTable from '@/components/StudentTable.vue';
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue';
import { del, get, getErrorMessage, post, showConfirmDialog } from '@/utils';
import type {
  StudentResponse,
  StudentStandard,
  StudentStandardRequest,
  StudentStandardResponse,
} from '@/types/types';
import { useRoute } from 'vue-router';
import router from '@/router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const uiStore = useUIStore();
const userStore = useUserStore();
const { smAndUp } = useDisplay();
const isLoading = ref(false);
const studentId = computed(() => +route.params.id);
const studentInfo = ref<StudentResponse>();
const standards = ref<StudentStandard[]>([]);
const standardsInfo = ref<StudentStandardResponse>({
  summary_grade: -1,
  standards: [],
});
const selectedLevelNumber = ref(-1);
const fullName = computed(() => {
  if (!studentInfo.value) return '';
  return `${studentInfo.value.last_name} ${studentInfo.value.first_name} ${studentInfo.value.patronymic}`;
});

const levelButtonText = computed(() =>
  selectedLevelNumber.value != -1 ? selectedLevelNumber.value + ' год обучения' : 'Года обучения',
);

const labels = computed(() => {
  if (!studentInfo.value) return [];
  return [
    {
      id: 0,
      label: `Дата рождения: ${new Date(studentInfo.value.birthday).toLocaleDateString()}`,
    },
    {
      id: 1,
      label: `Класс: ${studentInfo.value.student_class.number}${studentInfo.value?.student_class.class_name}`,
    },
    {
      id: 2,
      label: `Пол: ${studentInfo.value.gender === 'm' ? 'муж' : 'жен'}`,
    },
    {
      id: 3,
      label: `Код приглашения: ${
        studentInfo.value.is_used_invitation
          ? 'Использован'
          : studentInfo.value.invitation_link.split('/').pop()
      }`,
    },
  ];
});

async function getStudentById(studentId: number) {
  try {
    const response = await get(`/api/students/${studentId}`);
    if (response.ok) {
      studentInfo.value = await response.json();
      uiStore.mobileTitle = studentInfo.value ? fullName.value : 'Студент не найден';
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз');
  }
}

async function getStandardsByStudentId(studentId: number) {
  try {
    const response = await get(`/api/students/${studentId}/standards/`, {
      level_number: selectedLevelNumber.value,
    });
    if (response.ok) {
      standardsInfo.value = await response.json();
      standards.value = standardsInfo.value.standards.sort((a, b) =>
        a.standard.name.localeCompare(b.standard.name),
      );
    } else {
      toast.error(getErrorMessage(await response.json()));
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
    text: 'Вы уверены, что хотите удалить этого ученика?',
  });

  try {
    const response = await del('/api/students/' + studentId.value + '/');
    if (response.ok) {
      await router.push({ name: 'my-diary' });
      toast.success('Ученик успешно удален');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function saveStudentValue(
  changedValues: { standard_id: number; level_number: number; value: number | null }[],
) {
  try {
    isLoading.value = true;
    const request: StudentStandardRequest[] = changedValues.map((v) => ({
      student_id: studentId.value,
      standard_id: v.standard_id,
      value: v.value,
      level_number: v.level_number,
    }));

    const response = await post('/api/students/results/create/', request);
    if (response.ok) {
      await getStandardsByStudentId(studentId.value);
      toast.success('Данные успешно обновлены');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await getStudentById(studentId.value);
  await nextTick();
  selectedLevelNumber.value = studentInfo?.value?.student_class.number ?? 0;
  await getStandardsByStudentId(studentId.value);
});

onUnmounted(() => {
  uiStore.mobileTitle = '';
});
</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <div class="top-panel-title">{{ fullName ?? 'Студент не найден' }}</div>
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
          @update:model-value="
            toggle();
            getStandardsByStudentId(studentId);
          "
        />
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton button-text="Информация" sheet-title="Информация" wrap-button>
      <template #default="{ toggle }">
        <DataTableSideNav
          :data="labels"
          is-content-static-text
          page-type="student"
          @delete="deleteStudent"
          @edit="editStudent"
          @update:model-value="toggle"
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div class="main">
    <LevelPanel
      v-if="smAndUp"
      v-model="selectedLevelNumber"
      :class-number="studentInfo?.student_class.number ?? 0"
      class="level-panel"
      @update:model-value="getStandardsByStudentId(studentId)"
    />

    <div class="grid">
      <StudentTable
        :standards="standards"
        :summary-grade="standardsInfo.summary_grade"
        :hide-save-button="!userStore.isTeacher"
        :readonly-input="!userStore.isTeacher"
        :is-loading
        class="table"
        @save-data="saveStudentValue"
      />

      <DataTableSideNav
        v-if="smAndUp"
        :data="labels"
        :has-action-buttons="userStore.isTeacher"
        is-content-static-text
        page-type="student"
        title="Информация"
        class="info-panel"
        @delete="deleteStudent"
        @edit="editStudent"
      />
    </div>
  </div>
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 10px auto 0;

  @media (max-width: 1200px) {
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
