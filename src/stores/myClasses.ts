import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useMyClassesStore = defineStore('myClasses', () => {
  const router = useRouter();
  const route = useRoute();

  const activeClasses = ref<string[]>([]);
  const search = ref<string>((route.query.search as string) || '');

  async function setQuery(type: string) {
    if (type === 'search') {
      await router.replace({
        query: {
          search: search.value,
        },
      });
    } else if (type === 'classes') {
      await router.replace({
        query: {
          classes: activeClasses.value,
        },
      });
    }
  }

  return { activeClasses, search, setQuery };
});
