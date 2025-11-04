<template>
  <v-container fluid>
    <div class="page-wrapper">
      <!-- Top navigation tabs -->
      <v-card elevation="2" class="mt-4">
        <v-tabs
          v-model="tab"
          grow
          bg-color="primary"
          dark
          height="56"
        >
          <v-tab :value="1" class="text-capitalize">🧾 Course Info</v-tab>
          <v-tab :value="2" class="text-capitalize">👨‍🎓 Students</v-tab>
          <v-tab :value="3" class="text-capitalize">🕒 Sessions</v-tab>
        </v-tabs>
      </v-card>

      <!-- Main content -->
      <div class="mt-4" v-if="course">
        <!-- 🧾 Course Information -->
        <div v-if="tab === 1">
          <v-tab-item>
            <div>Title: {{ course.title }}</div>
            <div>Start: {{ course.startDate }}</div>
            <div>End: {{ course.endDate }}</div>
          </v-tab-item>
        </div>

        <!-- 👨‍🎓 Students Tab -->
        <div v-else-if="tab === 2">
          <v-tab-item>
            <!-- Check if course has students -->
            <div v-if="course.students && course.students.length">
              <ul>
                <li
                  v-for="item in course.students"
                  :key="item.id"
                >
                  👤 {{ item.student.firstName }} {{ item.student.lastName }}
                </li>
              </ul>
            </div>
            <div v-else class="text-grey">No students assigned</div>
          </v-tab-item>
        </div>

        <!-- 🕒 Sessions Tab -->
        <div v-else-if="tab === 3">
          <v-tab-item>
            <!-- Check if course has sessions -->
            <div v-if="course.courseSessions?.length">
              <div v-for="session in course.courseSessions" :key="session.id">
                📅 {{ session.title || 'Untitled Session' }} - {{ session.duration || 'No duration' }}
              </div>
            </div>
            <div v-else class="text-grey">No sessions available</div>
          </v-tab-item>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else>
        <v-alert border="start" prominent>
          ⏳ Loading course details...
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script>
import { useSessionStore } from '@/store/sessions'

export default {
  data() {
    return {
      tab: 1,      // Default tab (1 = Course Info)
      course: null // Will hold the selected course object
    };
  },
  computed:{
     sessionStore() {
    return useSessionStore()
  },
  },
  async mounted() {
    try {
      // Get courseId from route params
      const courseId = Number(this.$route.params.id);
      const token = localStorage.getItem('accessToken');

      // Fetch all courses for the logged-in teacher
      const courseRes = await fetch(`https://school-barakah.vercel.app/courses/my-courses`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!courseRes.ok) throw new Error(`HTTP ${courseRes.status}`);
      const allCourses = await courseRes.json();

      // Find the course that matches the route param
      const selectedCourse = allCourses.find(c => c.id === courseId);

      if (!selectedCourse) {
        console.warn('⚠️ Course not found');
        return this.$router.push('/admin/my-courses');
      }

      // Save course in component state
      this.course = selectedCourse;
      console.log('✅ Selected course:', selectedCourse);

      // Fetch sessions separately (because /my-courses does not include them)
      const sessionsRes = await fetch(`https://school-barakah.vercel.app/course-sessions?courseId=${courseId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (sessionsRes.ok) {
        // Attach sessions to the course object
        this.course.courseSessions = await sessionsRes.json();
        console.log('✅ Sessions loaded:', this.course.courseSessions);
      } else {
        this.course.courseSessions = [];
      }
    } catch (err) {
      console.error('❌ Failed to fetch course:', err);
    }
  },
};
</script>

<style>
/* You can add custom styles here if needed */
</style>
