import { defineStore } from 'pinia'
import { get, getErrorMessage, post } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const router = useRouter()
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const userType = ref(localStorage.getItem('userType') ?? 'guest')
  const studentId = ref<number | null>(Number(localStorage.getItem('studentId')))

  const isStudent = computed(() => userType.value === 'student')
  const isTeacher = computed(() => userType.value === 'teacher')

  async function login() {
    await fetchProfile()
    isLoggedIn.value = true
    localStorage.setItem('isLoggedIn', 'true')
  }

  async function logout() {
    const response = await post('/api/logout/')
    if (response.ok) {
      isLoggedIn.value = false
      userType.value = 'guest'
      studentId.value = null
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userType')
      localStorage.removeItem('studentId')
      await router.push({ name: 'login' })
    } else {
      toast.error(getErrorMessage(response))
    }
  }

  async function fetchProfile() {
    try {
      const response = await get('/api/profile/')
      if (response.ok) {
        const data = await response.json()
        userType.value = data.role
        localStorage.setItem('userType', data.role)
        if (data.role === 'student') {
          studentId.value = data.id
          localStorage.setItem('studentId', String(data.id))
        }
      } else {
        isLoggedIn.value = false
        userType.value = 'guest'
        studentId.value = null
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userType')
        localStorage.removeItem('studentId')

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
    studentId,
    isStudent,
    isTeacher,

    login,
    logout,
    fetchProfile
  }
})
