<script lang="ts" setup>
import TopPanel from '@/components/TopPanel.vue';
import DataTableSideNav from '@/components/DataTableSideNav.vue';
import MyDiaryTable from '@/components/MyDiaryTable.vue';
import FilterBlock from '@/components/FilterBlock.vue';
import ClassesPanel from '@/components/ClassesPanel.vue';
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue';
import type {
  ClassRequest,
  FilterData,
  StandardResponse,
  StudentResponse,
  StudentsValueResponse,
  StudentValueRequest,
} from '@/types/types';

import { computed, nextTick, onMounted, ref } from 'vue';
import { get, getErrorMessage, post } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';
import SideNavButtons from '@/components/SideNavButtons.vue';

const router = useRouter();
const route = useRoute();
const { smAndUp, width } = useDisplay();
const w800 = computed(() => width.value <= 800);

const pageType = ref<'single' | 'multiple'>(
  (route.query.pageType as 'single' | 'multiple') || 'single',
);
const activeClassNumber = ref(+route.query.classNumber! || -1);
const className = ref((route.query.letter as string) || '');
const selectedStandardId = ref(-1);
const selectedStandardIds = ref<number[]>([]);

const classesData = ref<ClassRequest[]>([]);
const standardsData = ref<StandardResponse[]>([]);
const filteredData = ref<StudentsValueResponse[]>([]);
const filters = ref<FilterData>({
  gender: null,
  grades: [],
  birthYearFrom: null,
  birthYearUntil: null,
});
let studentsValueData: StudentsValueResponse[] = [];
let studentsData: StudentResponse[] = [];

const standardButtonText = computed(() => {
  if (pageType.value === 'single') {
    return standards.value.find((v) => v.id === selectedStandardId.value)?.label ?? 'Нормативы';
  } else {
    if (selectedStandardIds.value.length <= 1) {
      return 'Выберите минимум 2 норматива';
    }
    return (
      standards.value
        .filter((v) => selectedStandardIds.value.includes(v.id))
        .map((v) => v.label)
        .sort((a, b) => a.localeCompare(b))
        .join(', ') ?? 'Нормативы'
    );
  }
});
const classButtonText = computed(() => {
  if (activeClassNumber.value === 12) {
    return 'Все';
  } else if (activeClassNumber.value === -1) {
    return 'Классы';
  } else {
    return activeClassNumber.value + className.value;
  }
});

const selectedStandardType = computed<'physical' | 'technical'>(() => {
  if (standardsData.value.find((v) => v.id === selectedStandardId.value)?.has_numeric_value) {
    return 'physical';
  } else {
    return 'technical';
  }
});

const standards = computed(() => {
  let result = standardsData.value;

  if (activeClassNumber.value !== 12) {
    result = result.filter((standard) =>
      standard.levels.some((level) => level.level_number === activeClassNumber.value),
    );
  }
  return result
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((standard) => ({
      id: standard.id,
      label: standard.name,
    }));
});

function initSelectedStandards() {
  const standard = route.query.standard;
  if (Array.isArray(standard)) {
    selectedStandardIds.value = standard.map(Number);
    selectedStandardId.value = -1;
  } else if (standard !== undefined && standard !== '' && standard !== null) {
    selectedStandardId.value = +standard;
    selectedStandardIds.value = [];
  } else {
    selectedStandardId.value = -1;
    selectedStandardIds.value = [];
  }
}

function sortSelectedStandardIds() {
  const standardsById = new Map(standardsData.value.map((s) => [s.id, s.name]));

  selectedStandardIds.value.sort((a, b) => {
    const nameA = standardsById.get(a) || '';
    const nameB = standardsById.get(b) || '';
    return nameA.localeCompare(nameB);
  });
}

function updateClassesData(classes: ClassRequest[]) {
  classesData.value = classes;
}

function updateStudentsData(students: StudentResponse[], classNumber: number, letter: string) {
  activeClassNumber.value = classNumber;
  className.value = letter;
  studentsData = students;
  filteredData.value = [];

  filters.value = {
    gender: null,
    grades: [],
    birthYearFrom: null,
    birthYearUntil: null,
  };

  if (
    pageType.value === 'single' &&
    !standards.value.some((v) => v.id === selectedStandardId.value)
  )
    selectedStandardId.value = -1;
  if (
    pageType.value === 'multiple' &&
    !standards.value.some((v) => selectedStandardIds.value.includes(v.id))
  )
    selectedStandardIds.value = [];

  getStudentsData();
}

function setQuery() {
  router.replace({
    query: {
      ...route.query,
      standard: pageType.value === 'single' ? selectedStandardId.value : selectedStandardIds.value,
      pageType: pageType.value,
    },
  });
}

async function getStudentsData() {
  setQuery();
  if (selectedStandardId.value === -1 && selectedStandardIds.value.length <= 1) return;

  let currentClasses: number[];
  let currentStudentsData: StudentResponse[];

  if (activeClassNumber.value === 12) {
    const standardsLevels = standardsData.value.reduce(
      (acc, v) => {
        acc[v.id] = v.levels.map((level) => level.level_number);
        return acc;
      },
      {} as Record<number, number[]>,
    );

    if (pageType.value === 'single') {
      currentClasses = classesData.value
        .filter((klass) => standardsLevels[selectedStandardId.value].includes(klass.number))
        .map((klass) => klass.id);
    } else {
      currentClasses = classesData.value
        .filter((klass) =>
          selectedStandardIds.value.every((id) => standardsLevels[id].includes(klass.number)),
        )
        .map((klass) => klass.id);
    }

    currentStudentsData = studentsData.filter((student) =>
      currentClasses.includes(student.student_class.id),
    );
  } else {
    currentClasses = classesData.value
      .filter(
        (klass) =>
          klass.number === activeClassNumber.value &&
          (className.value ? klass.class_name === className.value : true),
      )
      .map((klass) => klass.id);
    currentStudentsData = studentsData;
  }

  try {
    const currentStudentsValue: StudentsValueResponse[] = await get('/api/students/results/list/', {
      'class_id[]': currentClasses,
      'standard_id[]':
        pageType.value === 'single' ? selectedStandardId.value : selectedStandardIds.value,
    }).then((res) => res.json());

    studentsValueData = currentStudentsData.map((student) => {
      const result = currentStudentsValue.find((v) => v.id === student.id);
      return (
        result ?? {
          ...student,
          standards_details: [
            {
              grade: null,
              value: null,
              standard_id: selectedStandardId.value,
            },
          ],
          average_value: null,
          average_grade: null,
        }
      );
    });
    acceptFilters();
  } catch {
    toast.error('Ошибка при получении данных, попробуйте позже');
  }
}

function acceptFilters() {
  filteredData.value = studentsValueData.filter(
    (student) =>
      (filters.value.gender ? student.gender === filters.value.gender : true) &&
      (filters.value.grades.length
        ? filters.value.grades.includes(Math.round(student.average_grade ?? 0))
        : true) &&
      (filters.value.birthYearFrom
        ? +student.birthday.slice(0, 4) >= filters.value.birthYearFrom
        : true) &&
      (filters.value.birthYearUntil
        ? +student.birthday.slice(0, 4) <= filters.value.birthYearUntil
        : true),
  );
}

async function saveStudentsValue() {
  try {
    const request: StudentValueRequest[] = filteredData.value
      .filter((v) => v.average_value !== null)
      .map((student) => ({
        student_id: student.id,
        standard_id: selectedStandardId.value,
        value: student.average_value == null ? null : +student.average_value,
      }));

    const response = await post('/api/students/results/create/', request);

    if (response.ok) {
      await getStudentsData();
      acceptFilters();
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Ошибка при сохранении данных, попробуйте позже');
  }
}

onMounted(async () => {
  standardsData.value = await get('/api/standards/').then((res) => res.json());
  initSelectedStandards();
  nextTick();
});
</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <ClassesPanel
      :classes-data
      menu
      @studentsData="updateStudentsData"
      @classes-data="updateClassesData"
    />
    <template #right v-if="w800">
      <BottomSheetWithButton
        button-color="secondary"
        button-text="фильтры"
        icon="mdi-filter"
        sheet-title="Фильтры"
      >
        <template #default="{ toggle }">
          <FilterBlock
            v-model="filters"
            class="filters-block-mobile"
            mobile
            @accept="
              acceptFilters();
              toggle();
            "
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
            <ClassesPanel
              :classes-data
              menu
              direction-column
              @studentsData="updateStudentsData"
              @classes-data="updateClassesData"
              @buttonClick="toggle"
            />
          </template>
        </BottomSheetWithButton>
      </keep-alive>

      <BottomSheetWithButton
        :button-text="standardButtonText"
        sheet-title="Нормативы"
        wrap-button
        :width="width - 180 + 'px'"
      >
        <template #default="{ toggle }">
          <SideNavButtons
            v-model="pageType"
            :types="{ first: 'single', second: 'multiple' }"
            :labels="{ first: 'Один', second: 'Несколько' }"
            @typeChanged="
              selectedStandardId = -1;
              selectedStandardIds = [];
              filteredData = [];
            "
          />
          <DataTableSideNav
            v-model:selected-id="selectedStandardId"
            v-model:selected-ids="selectedStandardIds"
            :data="standards"
            :has-action-buttons="false"
            :multiple-select="pageType === 'multiple'"
            class="data-table-side-nav-mobile"
            @update:selected-id="
              getStudentsData();
              toggle();
            "
            @update:selected-ids="
              sortSelectedStandardIds();
              getStudentsData();
            "
          />
        </template>
      </BottomSheetWithButton>
    </div>

    <BottomSheetWithButton button-text="фильтры" icon="mdi-filter" sheet-title="Фильтры">
      <template #default="{ toggle }">
        <FilterBlock
          v-model="filters"
          class="filters-block-mobile"
          mobile
          @accept="
            acceptFilters();
            toggle();
          "
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div class="grid">
    <FilterBlock v-if="!w800" v-model="filters" class="filters-block" @accept="acceptFilters" />

    <MyDiaryTable
      :data="filteredData"
      :standard-type="selectedStandardType"
      :page-type
      class="table"
      @saveData="saveStudentsValue"
    />
    <div>
      <SideNavButtons
        v-if="smAndUp"
        v-model="pageType"
        :types="{ first: 'single', second: 'multiple' }"
        :labels="{ first: 'Один', second: 'Несколько' }"
        @typeChanged="
          selectedStandardId = -1;
          selectedStandardIds = [];
          filteredData = [];
        "
      />
      <DataTableSideNav
        v-if="smAndUp"
        v-model:selected-id="selectedStandardId"
        v-model:selected-ids="selectedStandardIds"
        :data="standards"
        :has-action-buttons="false"
        :multiple-select="pageType === 'multiple'"
        class="data-table-side-nav"
        title="Нормативы"
        @update:selected-id="getStudentsData"
        @update:selected-ids="
          sortSelectedStandardIds();
          getStudentsData();
        "
      />
    </div>
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
  height: calc(100dvh - 200px);
}

.table {
  height: calc(100dvh - 180px);
  max-width: calc(100dvw - 20px);
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 15px;
  align-items: center;
}

.buttons-panel {
  display: flex;
  gap: 10px;
}

.filters-block-mobile,
:is(.filters-block-mobile) :deep(.v-btn) {
  color: white !important;
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

  .table {
    height: calc(100dvh - 200px);
  }
}
</style>
