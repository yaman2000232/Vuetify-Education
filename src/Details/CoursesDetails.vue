<template>
  <v-container fluid>
    <div class="page-wrapper">
      <v-card elevation="2" class="mt-4">
        <v-tabs
          v-model="tab"
          grow
          bg-color="white"
          dark
          height="56"
        >
          <v-tab :value="1" class="text-capitalize">🧾 Information</v-tab>
          <v-tab :value="2" class="text-capitalize">👨‍🏫 Teachers</v-tab>
          <v-tab :value="3" class="text-capitalize">👨‍🎓 Students</v-tab>
          <v-tab :value="4" class="text-capitalize">🕒 Sessions</v-tab>
          <v-tab :value="5" class="text-capitalize">🏫 Classes</v-tab>
        </v-tabs>
      </v-card>

      <div class="mt-4">
        <div v-if="tab === 1">
          <v-row dense>
            <v-col
              v-for="(field, idx) in infoFields"
              :key="idx"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="small-card" outlined>
                <v-card-title class="title-sm">
                  {{ field.label }}
                </v-card-title>
                <v-card-text class="text-sm">
                  <div v-if="field.value !== null && field.value !== undefined && field.value !== ''">
                    {{ field.value }}
                  </div>
                  <div v-else class="muted">— No information —</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- TEACHERS -->
        <div v-else-if="tab === 2">
          <v-row dense>
            <v-col
              v-for="(fieldTeacher, idx) in infoFieldsTeacher"
              :key="idx"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="small-card" outlined>
                <v-card-title class="title-sm">
                  {{ fieldTeacher.labelTeacher }}
                </v-card-title>
                <v-card-text class="text-sm">
                  <div v-if="fieldTeacher.valueTeacher !== null && fieldTeacher.valueTeacher !== undefined && fieldTeacher.valueTeacher !== ''">
                    {{ fieldTeacher.valueTeacher }}
                  </div>
                  <div v-else class="muted">— No information —</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- STUDENTS -->
        <div v-else-if="tab === 3">
          <v-row dense>
            <v-col
              v-for="(student, idx) in students"
              :key="idx"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card class="small-card" outlined>
                <v-card-title class="title-sm">
                  {{ student.fullName }}
                </v-card-title>
                <v-card-text class="text-sm">
                  <div>Gender: {{ student.gender }}</div>
                  <div>Created At: {{ student.createdAt }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- SESSIONS -->
      <div v-else-if="tab === 4">
  <v-card class="mb-3" flat>
    <v-card-title class="d-flex align-center">
      <span>Sessions</span>
    
    </v-card-title>
  </v-card>

  <div v-if="course.courseSessions && course.courseSessions.length">
    <v-row dense>
      <v-col
        v-for="session in course.courseSessions"
        :key="session.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card outlined>
          <v-card-title>{{ session.title }}</v-card-title>
          <v-card-text>
            <div>⏱ Duration: {{ session.duration }} minutes</div>
            <div>📅 Created: {{ new Date(session.createdAt).toLocaleString() }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div v-else class="muted text-center mt-4">
    — No sessions yet —
  </div>
</div>

        <!-- CLASSES -->
        <div v-else-if="tab === 5">
          <v-row dense>
            <v-col
              v-for="(fieldClass, idx) in infoFieldsClassroom"
              :key="idx"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card class="small-card" outlined>
                <v-card-title class="title-sm">
                  {{ fieldClass.labelClass }}
                </v-card-title>
                <v-card-text class="text-sm">
                  <div v-if="fieldClass.valueClass !== null && fieldClass.valueClass !== undefined && fieldClass.valueClass !== ''">
                    {{ fieldClass.valueClass }}
                  </div>
                  <div v-else class="muted">— No information —</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

   
  </v-container>
</template>

<script>
import { useTeachersStore } from '@/store/teachers'
import { useClassStore } from '@/store/classes'
import { useStudentsStore } from '@/store/students'





export default {
  name: 'CourseDetails',
  data() {
    return {
      tab: 1,
      course: null,
      teacher: null,
         classroom: null,
         students: [],
   
    }
  },
  computed: {
    infoFields() {
      const c = this.course || {}
      return [
        { label: 'Title', value: c.title },
        { label: 'Start Date', value: c.startDate },
        { label: 'End Date', value: c.endDate },
        { label: 'Days', value: c.days },
        { label: 'Start Time', value: c.startTime },
        { label: 'End Time', value: c.endTime },
        { label: 'Teacher ID', value: c.teacherId },
        { label: 'Classroom ID', value: c.classRoomId },
      ]
    },
    infoFieldsTeacher() {
      const t = this.teacher || {}
      const name = t.firstName +' '+t.lastName
      return [
        { labelTeacher: 'ID', valueTeacher: t.id },
        { labelTeacher: 'name', valueTeacher: name},
        { labelTeacher: 'Email', valueTeacher: t.email },
        { labelTeacher: 'Phone', valueTeacher: t.phone },
        { labelTeacher: 'Specialization', valueTeacher: t.specialization },
        { labelTeacher: 'Education Level', valueTeacher: t.educationLevel },
        { labelTeacher: 'Gender', valueTeacher: t.gender },
        { labelTeacher: 'Years of Experience', valueTeacher: t.yearsOfExperience },
      ]
    },
  infoFieldsClassroom() {
  const c = this.classroom || {}
  console.log('📦 classroom object:', c)

   return [
    { labelClass: 'ID', valueClass: c.id },
    { labelClass: 'Title', valueClass: c.title },
    { labelClass: 'Has Projector', valueClass: c.hasProjector ? 'Yes' : 'No' },
    { labelClass: 'Organization ID', valueClass: c.organizationId },
    { labelClass: 'Created At', valueClass: c.createdAt },
    { labelClass: 'Updated At', valueClass: c.updatedAt },
  ]
},



    teachersStore() {
      return useTeachersStore()
      
    },
    classesStore() {
    return useClassStore()
  },
   
  studentsStore() {
    return useStudentsStore()
  },
  },
  async mounted() {
  try {
    const id = this.$route.params.id
    const token = localStorage.getItem('accessToken')
    const role = localStorage.getItem('role');
    console.log('📥 Course ID:', id)
    console.log('📥 role:', role)

 let courseData;

if (role === 'ORGANIZATION') {
  const res = await fetch(`https://school-barakah.vercel.app/courses/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  courseData = await res.json();
} else if (role === 'TEACHER') {
  const res = await fetch('https://school-barakah.vercel.app/courses/my-courses', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const courses = await res.json();
  courseData = courses.find(c => c.id === Number(id)); 
  if (!courseData) throw new Error('Course not found for this teacher');
}

this.course = courseData;

    const teacherId = this.course.teacherId
    const teacherRes = await fetch(`https://school-barakah.vercel.app/teachers/${teacherId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!teacherRes.ok) throw new Error(`HTTP ${teacherRes.status}`)
    this.teacher = await teacherRes.json()
    console.log(' Teacher loaded:', this.teacher)

    const classroomId = this.course.classRoomId
    const classroomRes = await fetch(`https://school-barakah.vercel.app/classrooms/${classroomId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!classroomRes.ok) throw new Error(`HTTP ${classroomRes.status}`)
    this.classroom = await classroomRes.json()
    console.log(' Classroom loaded:', this.classroom)

    
   
    this.course.studentIds = this.course.students?.map(s => s.studentId) || []
    const studentIds = this.course.studentIds
    console.log(' studentIds from course:', studentIds)

    const studentPromises = studentIds.map(studentId =>
      fetch(`https://school-barakah.vercel.app/students/${studentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
    )

    this.students = (await Promise.all(studentPromises)).map(s => ({
      ...s,
      fullName: `${s.firstName} ${s.lastName}`
    }))
    console.log('✅ Students loaded:', this.students)

  } catch (err) {
    console.error(' Failed to fetch course or related data:', err)
  }
},



}
</script>

<style>

</style>
