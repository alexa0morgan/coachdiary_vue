import { defineStore } from 'pinia'
import { get, post } from '@/utils'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true'
  }),
  actions: {
    login() {
      this.isLoggedIn = true
      localStorage.setItem('isLoggedIn', 'true')
    },
    async logout() {
      await post('/api/logout/')
      this.isLoggedIn = false
      localStorage.removeItem('isLoggedIn')
    },
    async fetchProfile() {
      const response = await get('/api/profile/')
      if (response.status === 403) {
        this.isLoggedIn = false
        localStorage.removeItem('isLoggedIn')
      }
    }
  }
})