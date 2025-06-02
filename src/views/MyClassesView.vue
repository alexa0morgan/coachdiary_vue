<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue';
import ClassesPanel from '@/components/ClassesPanel.vue';
import { computed, onMounted, ref } from 'vue';
import type { ClassRequest, StudentResponse } from '@/types/types';
import { useMyClassesStore } from '@/stores/myClasses';
import { useDisplay } from 'vuetify';
import { del, get, getErrorMessage, post, showConfirmDialog } from '@/utils';
import router from '@/router';
import { toast } from 'vue-sonner';
import MyClassesStudent from '@/components/MyClassesStudent.vue';
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue';

const { smAndUp } = useDisplay();
const myClassesStore = useMyClassesStore();
const activeLevelNumber = ref(-1);
const studentsData = ref<StudentResponse[]>([]);
const classesData = ref<ClassRequest[]>([]);
let timer: number | null = null;

const groupedStudentsClasses = computed(() => {
  const students = studentsData.value.toSorted((a, b) => {
    if (a.student_class.number !== b.student_class.number) {
      return a.student_class.number - b.student_class.number;
    }
    if (a.student_class.class_name !== b.student_class.class_name) {
      return a.student_class.class_name.localeCompare(b.student_class.class_name);
    }
    let fullNameA = `${a.last_name} ${a.first_name} ${a.patronymic}`;
    let fullNameB = `${b.last_name} ${b.first_name} ${b.patronymic}`;
    return fullNameA.localeCompare(fullNameB);
  });
  const result: Record<number, Record<string, StudentResponse[]>> = {};
  for (const student of students) {
    if (!result[student.student_class.number]) {
      result[student.student_class.number] = {};
    }
    if (!result[student.student_class.number][student.student_class.class_name]) {
      result[student.student_class.number][student.student_class.class_name] = [];
    }
    result[student.student_class.number][student.student_class.class_name].push(student);
  }

  return result;
});

function updateStudentsData(data: StudentResponse[], classNumber: number, letter: string) {
  studentsData.value = data;
  activeLevelNumber.value = classNumber;
  myClassesStore.search = '';
}

function getClassesData(data: ClassRequest[]) {
  classesData.value = data;
}

async function search(searchValue: string) {
  if (timer) {
    clearTimeout(timer);
  }

  if (searchValue.length === 0 && activeLevelNumber.value === -1) {
    studentsData.value = [];
  }
  if (searchValue.length < 2) {
    return;
  }

  timer = setTimeout(async () => {
    try {
      activeLevelNumber.value = -1;
      myClassesStore.search = searchValue;
      await myClassesStore.setQuery('search');
      let response = await get(`/api/students/`, { full_name: searchValue });
      if (response.ok) {
        studentsData.value = (await response.json()) as StudentResponse[];
        setTimeout(() => {
          myClassesStore.activeClasses = Object.entries(groupedStudentsClasses.value).flatMap(
            ([levelNumber, classes]) =>
              Object.keys(classes).map((className) => levelNumber + className),
          );
        }, 0);
      } else {
        toast.error(getErrorMessage(await response.json()));
      }
    } catch (e) {
      toast.error('Произошла ошибка во время получения данных, попробуйте еще раз');
    }
  }, 400);
}

async function getPDFQRCodes(number: number, name: string) {
  const id = classesData.value.find(
    (item) => item.number === number && item.class_name === name,
  )?.id;
  try {
    const response = await get(`/api/students/generate_qr_codes_pdf/`, {
      class_id: id,
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      toast.success('QR-коды успешно скачаны');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function deleteClass(number: number, name: string) {
  await showConfirmDialog({
    title: 'Удаление класса',
    text: 'Вы уверены, что хотите удалить весь класс?',
  });

  const id = classesData.value.find(
    (item) => item.number === number && item.class_name === name,
  )?.id;

  try {
    const response = await del(`/api/classes/${id}/`);
    if (response.ok) {
      router.go(0);
      toast.success('Класс успешно удален');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

async function transferToNextYear() {
  await showConfirmDialog({
    title: 'Перевод на следующий год',
    text: 'Это действие переведет все классы на следующий год (сохраняя букву) и удаляет выпущенные 11 классы. Вы уверены, что хотите сделать перевод?',
  });

  try {
    const response = await post('/api/classes/promote/');
    if (response.ok) {
      router.go(0);
      toast.success('Все классы успешно переведены на следующий год');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

onMounted(async () => {
  if (myClassesStore.search) {
    await search(myClassesStore.search);
  }
});
</script>

<template>
  <TopPanel class="top-panel">
    <BottomSheetWithButton
      v-if="!smAndUp"
      button-text="Классы"
      sheet-title="Классы"
      eager
      button-color="rgb(var(--v-theme-secondary))"
    >
      <template #default="{ toggle }">
        <ClassesPanel
          v-model="activeLevelNumber"
          @studentsData="updateStudentsData"
          @buttonClick="
            toggle();
            myClassesStore.activeClasses = [];
          "
        />
        <v-btn
          size="small"
          color="secondary"
          variant="outlined"
          text="Перевести на следующий год"
          class="transfer-button"
          @click="transferToNextYear"
        />
      </template>
    </BottomSheetWithButton>
    <v-combobox
      v-model="myClassesStore.search"
      :items="studentsData.map((v) => v.full_name)"
      density="compact"
      class="search"
      placeholder="Введите имя ученика"
      prepend-inner-icon="mdi-magnify"
      variant="solo"
      menu-icon=""
      clearable
      rounded
      hide-details
      @update:search="search"
    />
    <template #left v-if="smAndUp">
      <v-btn
        size="small"
        color="secondary"
        variant="outlined"
        text="Перевести на следующий год"
        @click="transferToNextYear"
      />
    </template>
    <template #right v-if="smAndUp">
      <v-btn
        :to="{ name: 'create-student' }"
        color="secondary"
        icon="mdi-plus"
        variant="outlined"
      />
    </template>
  </TopPanel>

  <div class="classes-panel" v-if="smAndUp">
    <ClassesPanel
      v-model="activeLevelNumber"
      direction-column
      @studentsData="updateStudentsData"
      @classesData="getClassesData"
      @buttonClick="myClassesStore.activeClasses = []"
    />
  </div>

  <div class="container">
    <div class="students-container">
      <template v-for="(levelClasses, levelNumber) in groupedStudentsClasses" :key="levelNumber">
        <v-expansion-panels v-model="myClassesStore.activeClasses" multiple>
          <v-expansion-panel
            v-for="(students, className) in levelClasses"
            :key="levelNumber + className"
            :value="levelNumber + className"
          >
            <v-expansion-panel-title>
              <strong>{{ levelNumber + className }}</strong>
            </v-expansion-panel-title>

            <v-expansion-panel-text class="expansion-panel-text">
              <div class="students-list">
                <div>№</div>
                <div style="padding: 0 16px">ФИО</div>
                <div v-if="smAndUp">Код приглашения</div>
                <div v-else>Код</div>
              </div>

              <div class="students-list" v-for="i in students.length" :key="students[i - 1].id">
                <MyClassesStudent :i="i" :student="students[i - 1]" />
              </div>

              <div class="action-buttons">
                <v-btn
                  size="small"
                  color="info"
                  variant="outlined"
                  text="Скачать qr коды приглашений"
                  @click="getPDFQRCodes(+levelNumber, className)"
                />
                <v-btn
                  size="small"
                  color="error"
                  variant="outlined"
                  text="Удалить"
                  @click="deleteClass(+levelNumber, className)"
                />
                <!--    <v-btn size="small" color="warning" variant="outlined">Архивировать</v-btn>
                        <v-btn size="small" color="info" variant="outlined">Перевести на след. год</v-btn>-->
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </div>
  </div>
</template>

<style scoped>
.top-panel {
  position: sticky;
  top: 64px;
  z-index: 1000;
  padding-left: 84px;
}

.search {
  max-width: 500px;
  margin: 0 auto;
}

.classes-panel {
  position: fixed;
  top: 124px;
  background-color: rgb(var(--v-theme-primary));
  z-index: 1000;
  padding: 10px;
  height: calc(100dvh - 124px);
}

.container {
  margin: 30px 0 60px 100px;
}

.students-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto 0;
  max-width: 100%;
  width: 600px;
}

.students-list {
  display: grid;
  grid-template-columns: 20px 1fr 136px;
  gap: 10px;
  align-items: center;
  margin-bottom: 5px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin: 20px 10px 0;
  align-items: center;
  width: 100%;
}

.transfer-button {
  margin-top: 50px;
  width: 100%;
}

@media (width <= 900px) {
  .top-panel {
    padding-left: 8px;
  }
}

@media (max-width: 600px) {
  .students-container {
    width: 100%;
  }

  .container {
    grid-template-columns: 0 1fr;
    margin: 10px;
  }

  .students-list {
    grid-template-columns: 20px 1fr 80px;
  }

  .expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
    padding: 8px 10px 16px;
  }
}
</style>
