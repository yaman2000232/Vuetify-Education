import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null,
  }),

  actions: {
    async login(email, password) {
      console.log(' Attempting login with credentials:', email, password)

      const res = await fetch('https://school-barakah.vercel.app/auth/organization/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log(' API response received:', data)

      if (data.access_token) {
        this.token = data.access_token
        this.role = data.user.userType 
        localStorage.setItem('accessToken', data.access_token)
        localStorage.setItem('role', data.user.userType)
        console.log(' Login successful. Role:', this.role)
      } else {
        throw new Error(data.message || 'Login failed')
      }
    },

    logout() {
      console.log(' Logging out...')
      this.token = null
      this.role = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('role')
    },
  },
})
