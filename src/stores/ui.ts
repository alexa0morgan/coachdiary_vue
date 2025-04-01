import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {

  const mobileTitle = ref('')

  return {
    mobileTitle
  }

})