<script lang="ts" setup>
import StandardsTable from '@/components/StandardsTable.vue';
import DataTableSideNav from '@/components/DataTableSideNav.vue';
import TopPanel from '@/components/TopPanel.vue';
import BottomSheetWithButton from '@/components/BottomSheetWithButton.vue';

import { computed, nextTick, onMounted, ref } from 'vue';
import { del, get, getErrorMessage, showConfirmDialog } from '@/utils';
import type { StandardResponse } from '@/types/types';
import router from '@/router';
import { toast } from 'vue-sonner';
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay();

const selectedLevelNumber = ref(-1);
const pageType = ref<'standards' | 'technical'>('standards');

const selectedStandardId = ref(-1);
const standards = ref<StandardResponse[]>([]);

const levelButtonText = computed(() =>
  selectedLevelNumber.value != -1 ? selectedLevelNumber.value + ' год обучения' : 'Года обучения',
);
const standardButtonText = computed(
  () =>
    simplifiedStandards.value.find((v) => v.id === selectedStandardId.value)?.label ?? 'Норматив',
);

async function setFirst({
  standard = true,
  level = true,
  levelNumber,
}: {
  standard?: boolean;
  level?: boolean;
  levelNumber?: number;
} = {}): Promise<void> {
  if (level) selectedLevelNumber.value = levelNumber ?? levels.value[0] ?? -1;
  await nextTick();
  if (standard) selectedStandardId.value = simplifiedStandards.value[0]?.id ?? -1;
}

const levels = computed(() =>
  Array.from(
    standards.value
      .filter((standard) => standard.has_numeric_value === (pageType.value === 'standards'))
      .reduce((acc, v) => {
        for (const level of v.levels) {
          acc.add(level.level_number);
        }
        return acc;
      }, new Set<number>()),
  ),
);

const simplifiedStandards = computed(() =>
  standards.value
    .filter((standard) => standard.has_numeric_value === (pageType.value === 'standards'))
    .filter((standard) =>
      standard.levels.some((level) => level.level_number === selectedLevelNumber.value),
    )
    .toSorted((a, b) => a.name.localeCompare(b.name))

    .map((standard) => ({
      id: standard.id,
      label: standard.name,
    })),
);

const currentStandardLevels = computed(() =>
  standards.value
    .find((standard) => standard.id === selectedStandardId.value)
    ?.levels.toSorted((a, b) => a.gender.localeCompare(b.gender))
    .filter((level) => level.level_number === selectedLevelNumber.value),
);

function editStandard(): void {
  router.push({ name: 'update-standard', params: { id: selectedStandardId.value } });
}

async function deleteStandard(inAllLevels: boolean): Promise<void> {
  const dialogText = inAllLevels
    ? 'Вы уверены, что хотите удалить этот норматив для всех уровней?'
    : `Вы уверены, что хотите удалить этот норматив для текущего уровня: ${selectedLevelNumber.value}?`;

  const deleteURl = inAllLevels
    ? `/api/standards/${selectedStandardId.value}/`
    : `/api/standards/${selectedStandardId.value}/remove_level/?level_number=${selectedLevelNumber.value}`;

  await showConfirmDialog({
    title: 'Удаление норматива',
    text: dialogText,
  });

  try {
    const response = await del(deleteURl);
    if (response.ok) {
      if (inAllLevels) {
        standards.value = standards.value.filter(
          (standard) => standard.id !== selectedStandardId.value,
        );
      } else {
        standards.value = standards.value.map((standard) => {
          if (standard.id === selectedStandardId.value) {
            return {
              ...standard,
              levels: standard.levels.filter(
                (level) => level.level_number !== selectedLevelNumber.value,
              ),
            };
          }
          return standard;
        });
      }
      await setFirst();
      toast.success('Норматив был успешно удален');
    } else {
      toast.error(getErrorMessage(await response.json()));
    }
  } catch {
    toast.error('Произошла ошибка во время отправки данных, попробуйте еще раз');
  }
}

onMounted(async () => {
  standards.value = await get('/api/standards/').then((res) => res.json());
  await setFirst();
});
</script>

<template>
  <TopPanel v-if="smAndUp" class="top-panel">
    <div class="buttons-panel">
      <v-btn
        v-for="n in 11"
        :key="n"
        :disabled="!levels.includes(n)"
        :text="n + ' год'"
        :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
        class="level-button button"
        color="rgb(var(--v-theme-secondary))"
        @click="setFirst({ levelNumber: n })"
      />
    </div>
    <template #right>
      <v-btn
        :to="{ name: 'create-standard' }"
        color="rgb(var(--v-theme-secondary))"
        icon="mdi-plus"
        variant="outlined"
      />
    </template>
  </TopPanel>

  <div v-if="!smAndUp" class="top-panel-mobile">
    <BottomSheetWithButton :button-text="levelButtonText" sheet-title="Года обучения">
      <template #default="{ toggle }">
        <div class="level-button-mobile">
          <v-btn
            v-for="n in 11"
            :key="n"
            :disabled="!levels.includes(n)"
            :text="n + ' год'"
            :variant="selectedLevelNumber === n ? 'flat' : 'outlined'"
            class="level-button button"
            color="rgb(var(--v-theme-secondary))"
            @click="
              setFirst({ levelNumber: n });
              toggle();
            "
          />
        </div>
      </template>
    </BottomSheetWithButton>

    <BottomSheetWithButton :button-text="standardButtonText" sheet-title="Нормативы" wrap-button>
      <template #default="{ toggle }">
        <div class="side-nav-buttons">
          <v-btn
            :active="pageType === 'standards'"
            class="button side-nav-button-mobile"
            size="small"
            text="Физические"
            variant="outlined"
            @click="
              pageType = 'standards';
              setFirst({ level: false });
            "
          />
          <v-btn
            :active="pageType === 'technical'"
            class="button side-nav-button-mobile"
            size="small"
            text="Технические"
            variant="outlined"
            @click="
              pageType = 'technical';
              setFirst({ level: false });
            "
          />
        </div>
        <DataTableSideNav
          v-model="selectedStandardId"
          :data="simplifiedStandards"
          :is-standard-type-technical="pageType === 'technical'"
          :has-action-buttons="false"
          class="data-table-side-nav-mobile"
          @update:model-value="toggle"
        />
      </template>
    </BottomSheetWithButton>
  </div>

  <div v-auto-animate :class="{ 'technical-grid': pageType === 'technical' }" class="grid">
    <div v-if="pageType === 'standards'" class="standards-tables">
      <template v-if="currentStandardLevels">
        <StandardsTable
          v-for="level in currentStandardLevels"
          :key="level.id"
          :gender="level.gender"
          :high="level.high_value"
          :low="level.low_value"
          :middle="level.middle_value"
        />
      </template>
    </div>

    <div v-if="!smAndUp" class="action-buttons-mobile">
      <v-btn
        class="button"
        color="primary-darken-1"
        text="Изменить"
        variant="outlined"
        @click="editStandard"
      />
      <v-btn class="button" color="error" variant="outlined">
        Удалить
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item @click="deleteStandard(false)">
              <v-list-item-title>данные {{ selectedLevelNumber }} года</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteStandard(true)">
              <v-list-item-title>данные всех годов</v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title>Отмена</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <div v-if="smAndUp">
      <div class="side-nav-buttons">
        <v-btn
          :active="pageType === 'standards'"
          class="button side-nav-button"
          size="small"
          text="Физические"
          variant="outlined"
          @click="
            pageType = 'standards';
            setFirst({ level: false });
          "
        />
        <v-btn
          :active="pageType === 'technical'"
          class="button side-nav-button"
          size="small"
          text="Технические"
          variant="outlined"
          @click="
            pageType = 'technical';
            setFirst({ level: false });
          "
        />
      </div>
      <DataTableSideNav
        v-model="selectedStandardId"
        :data="simplifiedStandards"
        :is-standard-type-technical="pageType === 'technical'"
        :title="pageType === 'standards' ? 'Физические' : 'Технические'"
        class="data-table-side-nav"
        has-delete-menu
        @delete="deleteStandard"
        @edit="editStandard"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 230px;
  gap: 10px;
  max-width: 1200px;
  margin: 40px auto 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0 10px;
    margin: 25px 0;
  }
}

.technical-grid {
  grid-template-columns: 1fr;
}

.standards-tables {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 30px;

  @media (width <= 600px) {
    margin-top: 0;
  }
}

.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  border-radius: var(--v-border-button-radius);
}

/*стиль для небольшой границы у кнопок, теперь кнопки не скачут*/
.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.side-nav-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.side-nav-button.v-btn--variant-outlined {
  border-width: 2px !important;
}

.side-nav-button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.side-nav-button-mobile {
  color: white !important;
}

.data-table-side-nav {
  height: calc(100vh - 220px);
}

.data-table-side-nav-mobile :deep(.v-btn) {
  color: white !important;
}

.data-table-side-nav-mobile :deep(.v-btn.v-btn--active) {
  color: rgb(var(--v-theme-primary)) !important;
  border: 1px solid white !important;
}

.top-panel-mobile {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}

.action-buttons-mobile {
  display: flex;
  gap: 20px;
  padding: 0 10px;
  margin-top: 30px;
}

.level-button-mobile {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
</style>
