import { defineStore } from 'pinia'

export const useClassStore = defineStore('class', {
  state: () => ({
    classes: [],
    loading: false,
    error: false
  }),

  actions: {
    async listClasses() {
      this.loading = true
      this.error = false
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('https://school-barakah.vercel.app/classrooms', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch classes')
        this.classes = await res.json()
      } catch (err) {
        console.error(err)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    async createClassFromApi(newClass) {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('https://school-barakah.vercel.app/classrooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newClass)
        })
        if (!res.ok) throw new Error('Failed to create class')
        const created = await res.json()
        this.classes.push(created)
        return created
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async updateClassFromApi(id, updated) {
      try {
        const token = localStorage.getItem('accessToken')
        console.log('📦 PATCH payload:', JSON.stringify(updated, null, 2))

        const res = await fetch(`https://school-barakah.vercel.app/classrooms/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updated)
        })
        if (!res.ok) throw new Error('Failed to update class')
        const updatedClass = await res.json()
        this.classes = this.classes.map(c => c.id === updatedClass.id ? updatedClass : c)
        return updatedClass
      } catch (err) {
        console.error(err)
        throw err
      }
    },

    async deleteClassFromApi(id) {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch(`https://school-barakah.vercel.app/classrooms/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to delete class')
        this.classes = this.classes.filter(c => c.id !== id)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
})
