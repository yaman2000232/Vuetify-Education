// import { defineStore } from 'pinia'
// export const useTeachStore = defineStore ('teach',{
// state: () =>({
//     courses:[],
//     selectedCourse: null,
//     loading:false,
//     error:false
// }), 
// actions:{

//     async fetchCourse(){
//           console.log(' fetchCourse called')
//              this.loading = true
//             this.error = false

//             try{
//                 const token = localStorage.getItem('accessToken')
//                 const url = 'https://school-barakah.vercel.app/courses/my-courses'
//                  console.log(' Fetch URL:', url, ' token present:', !!token)

//                  const res = await fetch(url, {
        
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization:`Bearer ${token}`
//                 },
//                 })
//                  console.log(' Response status:', res.status)

//                   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

//                     const data = await res.json()
//                       console.log(' Raw data:', data)
//                       console.log('Raw course sample:', data[0])


//                    this.courses = data.map(course => ({
//                 ...course,
//         studentCount: Array.isArray(course.students) ? course.students.length : 0

//                 }))


//             }catch (error) {
//         console.error(' Failed to fetch course:', error)
//         this.error = true
//       } finally {
//         this.loading = false
//         console.log(' fetchCourse finished — loading set to false')
//       }
//     }



// }



    
// })