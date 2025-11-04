import { defineStore } from 'pinia'

export const useTeachersStore = defineStore('teacher', {
  state: () => ({
    teachers: [],              
    loading: false,              
    error: false,               
  }),

  actions: {
    async listTeachers() {
      console.log(' listTeachers() called')
      this.loading = true
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        const url = 'https://school-barakah.vercel.app/teachers'
        console.log('🔗 Fetch URL:', url, ' token present:', !!token)

        const res = await fetch(url, {
        
          headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
          },
        })

        console.log(' Response status:', res.status)

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const data = await res.json()
        console.log(' Raw data:', data)

        this.teachers = data.map((teacher, index) => ({
          ...teacher,
       
      
          

            fullName: `${teacher.firstName} ${teacher.lastName}`,
          imageUrl:
            teacher.imageUrl ||
            teacher.photo ||
            `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
         
        }))

        console.log(' Teachers in store:', this.teachers)
      } catch (error) {
        console.error(' Failed to fetch teachers:', error)
        this.error = true
      } finally {
        this.loading = false
        console.log(' listTeachers() finished — loading set to false')
      }
    },
      

    async deleteFromApi(id){
      console.log('start delet function')
      this.loading = true,
      this.error = false

      try {
        const token = localStorage.getItem('accessToken')
        const url = `https://school-barakah.vercel.app/teachers/${id}`
        console.log(url , !!token);
        
        const res = await fetch (url,{

          method: 'DELETE' ,
         headers: {
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
                },
                
        })
          if (!res.ok) {
      const txt = await res.text()
      throw new Error(`DELETE failed: ${res.status} ${txt}`)
    }

          
         
          
        this.deleteItem(id)
        console.log('yes delete');
        

      } catch (error) {
        
    console.error(' Failed to delete teacher:', error)
    this.error = true
      }finally{
        this.loading =false
      }
    

    },

  async createTeacherFromApi(newTeacher) {
  console.log('🟢 createTeacherFromApi started', newTeacher)
  this.loading = true
  this.error = false

  try {
    const token = localStorage.getItem('accessToken')
    const url = 'https://school-barakah.vercel.app/teachers'


        console.log('📡 Sending POST request to:', url)
        console.log('📨 Method:', 'POST')
        console.log('🧾 Headers:', {
       'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        })
        console.log('📦 Request body:', JSON.stringify(newTeacher, null, 2))

    const res = await fetch(url, {
      method: 'POST',
      
      headers: {

        
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(newTeacher),
    })

    if (!res.ok) {
      console.log(' Response not OK:', res.status)
      const txt = await res.text()
      console.log(' Response text:', txt)
      throw new Error(`Create failed: ${res.status} ${txt}`)
    }
    const createdTeacher = await res.json()
    console.log('✅ Teacher created:', createdTeacher)


    this.addTeachers(createdTeacher)
    console.log(' Adding teacher to store:', createdTeacher)
    // return the teacher 
    return createdTeacher
  } catch (error) {
    console.error(' Failed to create teacher:', error)
    this.error = true
    throw error
  } finally {
    this.loading = false
  }
},


  async updateTeacherFromApi(id , updated) {
  console.log('🛠️ Start update function:', updated)
  this.loading = true
  this.error = false

  try {
    const token = localStorage.getItem('accessToken')
    const url = `https://school-barakah.vercel.app/teachers/${id}`

    console.log('📡 Sending PATCH request to:', url)
    console.log('📨 Method:', 'PATCH')
    console.log('🧾 Headers:', {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    })
    console.log('📦 Request body:', JSON.stringify(updated, null, 2))

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    })

    if (!res.ok) {
      console.log('❌ Response not OK:', res.status)
      const txt = await res.text()
      console.log('📩 Response text:', txt)
      throw new Error(`Update failed: ${res.status} ${txt}`)
    }

    const updatedTeacher = await res.json()
    console.log('✅ Teacher updated:', updatedTeacher)

    this.updateTeacher(updatedTeacher)
    return updatedTeacher
  } catch (error) {
    console.error('❌ Failed to update teacher:', error)
    this.error = true
    throw error
  } finally {
    this.loading = false
    console.log('⏹️ Loading stopped')
  }
},









    deleteItem(id) {
      console.log(` deleteItem called for id: ${id}`)
      this.teachers = this.teachers.filter((teacher) => teacher.id !== id)
      console.log(' Teachers after delete:', this.teachers)
    },

    updateTeacher(newUpdatedTeacher) {
      console.log(' updateTeacher called for id:', newUpdatedTeacher.id)
      this.teachers = this.teachers.map((teacher) =>
        teacher.id === newUpdatedTeacher.id ? { ...teacher, ...newUpdatedTeacher } : teacher
      )
      console.log('Teachers after update:', this.teachers)
    },

    addTeachers(teacher) {
      console.log('addTeachers called, adding:', teacher)
      this.teachers.push(teacher)
      console.log(' Teachers after add:', this.teachers)
    },

    
  },
})
