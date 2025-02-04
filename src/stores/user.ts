import { defineStore } from 'pinia'
import { get, post } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const router = useRouter()
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')

  function login() {
    isLoggedIn.value = true
    localStorage.setItem('isLoggedIn', 'true')
  }

  async function logout() {
    await post('/api/logout/')
    isLoggedIn.value = false
    localStorage.removeItem('isLoggedIn')
  }

  async function fetchProfile() {
    try {
      const response = await get('/api/classes/')
      if (!response.ok) {
        isLoggedIn.value = false
        localStorage.removeItem('isLoggedIn')

        if (route.fullPath.startsWith('/app')) {
          await router.push({ name: 'home' })
        }
      }
    } catch {
      // намеренно оставлено пустым
    }
  }

  return {
    isLoggedIn,

    login,
    logout,
    fetchProfile
  }
})