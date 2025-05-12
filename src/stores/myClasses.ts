import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMyClassesStore = defineStore('myClasses', () => {
  const activeClasses = ref<string[]>([]);

  return { activeClasses };
});
