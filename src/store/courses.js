import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('course', {
  state: () => ({
    courses: [],
     sessions: [], 
    loading: false,
    error: false,
  }),

  actions: {
    
    async listCourses() {
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No access token found.')

        const url = 'https://school-barakah.vercel.app/courses'
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()

      this.courses = data.map((course, index) => ({
  ...course,
        id: course.id,
  title: course.title,
       studentIds: course.students?.map(s => s.studentId) || [],
          imageUrl:
            course.imageUrl ||
            course.photo ||
            `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
        
        }))

      } catch (error) {
        console.error('❌ Failed to fetch courses:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },
    async listTeacherCourses() {
  this.loading = true
  this.error = false

  try {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No access token found.')

    const url = 'https://school-barakah.vercel.app/courses/my-courses'
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()

    this.courses = data.map((course, index) => ({
      ...course,
      id: course.id,
      title: course.title,
      studentIds: course.students?.map(s => s.studentId) || [],
      imageUrl:
        course.imageUrl ||
        course.photo ||
        `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
    }))
  } catch (error) {
    console.error('❌ Failed to fetch teacher courses:', error)
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

        const url = `https://school-barakah.vercel.app/courses/${id}`
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

        this.deleteItem(id)
      } catch (error) {
        console.error('❌ Failed to delete course:', error)
        this.error = true
      } finally {
        this.loading = false
      }
    },

 async createCourseFromApi(newCourse) {


  console.log('🟢 createCourseFromApi started', newCourse)
  this.loading = true
  this.error = false

  try {
    const token = localStorage.getItem('accessToken')
    const url = 'https://school-barakah.vercel.app/courses'

    console.log('📡 Sending POST request to:', url)
    console.log('📨 Method:', 'POST')
    console.log('🧾 Headers:', {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    })
    console.log('📦 Request body:', JSON.stringify(newCourse, null, 2))

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourse),
    })

    if (!res.ok) {
      console.log('❌ Response not OK:', res.status)
      const txt = await res.text()
      console.log('📩 Response text:', txt)
      throw new Error(`Create failed: ${res.status} ${txt}`)
    }

    const createdCourse = await res.json()

    console.log('✅ Course created:', createdCourse)
      
    this.addCourse(createdCourse)
    console.log('📥 Added course to store:', createdCourse)

    return createdCourse
  } catch (error) {
    console.error('❌ Failed to create course:', error)
    this.error = true
    throw error
  } finally {
    this.loading = false
  }
},

 async updateCourseFromApi(id, updated) {
  console.log('🛠️ Start update function:', updated)
  this.loading = true
  this.error = false

  try {
    if (!updated) throw new Error('No course data provided for update.') 

    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('No access token found.')

    const url = `https://school-barakah.vercel.app/courses/${id}`

    const payload = {
      ...updated,
      startDate: updated?.startDate
        ? new Date(updated.startDate).toISOString()
        : undefined,
      endDate: updated?.endDate
        ? new Date(updated.endDate).toISOString()
        : undefined,
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

    const updatedCourse = await res.json()
    this.updateCourse(updatedCourse)
    return updatedCourse
  } catch (error) {
    console.error('❌ Failed to update course:', error)
    this.error = true
    throw error
  } finally {
    this.loading = false
    console.log('⏹️ Loading stopped')
  }
},


    deleteItem(id) {
      this.courses = this.courses.filter((c) => c.id !== id)
    },

    updateCourse(newUpdatedCourse) {
      this.courses = this.courses.map((c) =>
        c.id === newUpdatedCourse.id ? { ...c, ...newUpdatedCourse } : c
      )
    },

    addCourse(newCourse) {
      this.courses.push(newCourse)
    },
  },
})
