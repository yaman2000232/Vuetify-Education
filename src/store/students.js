import { defineStore } from 'pinia'

export const useStudentsStore = defineStore('student', {
  state: () => ({
    students: [],
    loading: false,
    error: false,
  }),

  actions: {
    async listStudents() {
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No access token found.')

        const url = 'https://school-barakah.vercel.app/students'
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()

        this.students = data.map((student) => ({
          ...student,
          fullName: `${student.firstName} ${student.lastName}`
        }))
      } catch (error) {
        console.error('❌ Failed to fetch students:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    async deleteFromApi(id) {
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No access token found.')

        const url = `https://school-barakah.vercel.app/students/${id}`
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(`DELETE failed: ${res.status} ${txt}`)
        }

        this.deleteStudent(id)
      } catch (error) {
        console.error('❌ Failed to delete student:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    async createStudentsFromApi(newStudent) {
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No access token found.')

        const url = 'https://school-barakah.vercel.app/students'

        const payload = {
          ...newStudent,
          bod: new Date(newStudent.bod).toISOString(),
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(`Create failed: ${res.status} ${txt}`)

        }

        const createdStudent = await res.json()
        this.addStudent(createdStudent)
        return createdStudent
      } catch (error) {
        console.error('❌ Failed to create student:', error)
        this.error = true
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateStudentFromApi(id, updated) {
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No access token found.')

        const url = `https://school-barakah.vercel.app/students/${id}`

        const payload = {
          ...updated,
          bod: new Date(updated.bod).toISOString(),
        }

        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(`Update failed: ${res.status} ${txt}`)
        }

        const updatedStudent = await res.json()
        this.updateStudent(updatedStudent)
        return updatedStudent
      } catch (error) {
        console.error('❌ Failed to update student:', error)
        this.error = true
        throw error
      } finally {
        this.loading = false
      }
    },

    deleteStudent(id) {
      this.students = this.students.filter((s) => s.id !== id)
    },

    updateStudent(newUpdatedStudent) {
      this.students = this.students.map((s) =>
        s.id === newUpdatedStudent.id ? newUpdatedStudent : s
      )
    },

    addStudent(student) {
      this.students.push(student)
    },
  },
})
