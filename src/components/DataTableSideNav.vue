<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string;
  data: {
    label: string;
    id: number;
  }[];
  isPageTypeSkills?: boolean;
}>()

const emit = defineEmits<{
  select: [id: number];
  edit: [id: number];
  delete: [id: number, inAllLevels: boolean];
}>()

const selectedId = ref(props.data[0]?.id ?? -1)

function onSelect(id: number): void {
  selectedId.value = id
  emit('select', id)
}

watch(() => props.data, () => {
  selectedId.value = 1
})
</script>

<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <div class="data" :class="{'grid': isPageTypeSkills}">
      <v-btn v-for="item in data" :key="item.id" class="button" :text="item.label" variant="outlined" size="small"
             block @click="onSelect(item.id)" :active="selectedId === item.id" :ripple="false" />
    </div>
    <div class="action-buttons">
      <v-btn text="Изменить" variant="outlined" color="primary-darken-1" size="small"
             @click="emit('edit', selectedId)" class="button action-button" />
      <v-btn variant="outlined" color="error" size="small" class="button action-button">
        Удалить
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item @click="emit('delete', selectedId, false)">
              <v-list-item-title>у уровня</v-list-item-title>
            </v-list-item>
            <v-list-item @click="emit('delete', selectedId, true)">
              <v-list-item-title>у всех уровней</v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => {}">
              <v-list-item-title>Отмена</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(100dvh - 230px);

  display: grid;
  grid-template-rows: auto 1fr auto;
  text-align: center;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: var(--v-border-radius);
  padding: 12px;
  overflow: hidden;
}

.title {
  text-transform: uppercase;
  font-weight: bold;
  margin: 5px 18px 15px;
  padding: 0 0 3px;
  border-bottom: 1px solid rgb(var(--v-another-surface));
}


.data {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-right: 5px;
  margin-right: -5px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, calc(33.33% - 20px)));
  grid-auto-rows: min-content;
  align-items: start;
  justify-content: center;
  gap: 20px;
}


.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  height: auto !important;
  min-height: 24px;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}


.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-top: 15px;
}

.action-button {
  text-transform: uppercase !important;
  border-width: 2px;
  font-size: 12px;
}
</style>