import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessions: [],
    loading: false,
    error: false
  }),

  actions: {
    async listSessions() {
      this.loading = true
      this.error = false
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('https://school-barakah.vercel.app/course-sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch sessions')
        this.sessions = await res.json()
      } catch (err) {
        console.error(err)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    async createSessionFromApi(newSession) {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('https://school-barakah.vercel.app/course-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newSession)
        })
        if (!res.ok) throw new Error('Failed to create session')
        const created = await res.json()
        this.sessions.push(created)
        return created
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async updateSessionFromApi(id, updated) {
      try {
        const token = localStorage.getItem('accessToken')
        console.log('📦 PATCH payload:', JSON.stringify(updated, null, 2))

        const res = await fetch(`https://school-barakah.vercel.app/course-sessions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updated)
        })
        if (!res.ok) throw new Error('Failed to update session')
        const updatedSession = await res.json()
        this.sessions = this.sessions.map(s => s.id === updatedSession.id ? updatedSession : s)
        return updatedSession
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async deleteSessionFromApi(id) {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`https://school-barakah.vercel.app/course-sessions/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to delete session')
        this.sessions = this.sessions.filter(s => s.id !== id)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
})
