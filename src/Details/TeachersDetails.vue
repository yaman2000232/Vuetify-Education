<template>
  <v-container>
    <v-btn text color="primary" class="mb-4" @click="$router.back()">
         <v-icon start>mdi-arrow-left</v-icon>
      Back to Teachers
    </v-btn>

    <v-card v-if="teacherDetails" class="pa-6">
      <v-row justify="center" class="mb-6 text-center">
        <v-col cols="12" md="4">
          <v-avatar size="140" class="mb-3">
            <v-img :src="teacherDetails.photo" alt="Teacher Photo" />
          </v-avatar>
          <h2 class="mb-1">{{ teacherDetails.firstName }} {{ teacherDetails.lastName }}</h2>
          <v-chip :color="teacherDetails.isActive ? 'green' : 'red'" dark>
            {{ teacherDetails.isActive ? 'Active' : 'Inactive' }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Email</strong>
          <div>{{ teacherDetails.email }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Phone</strong>
          <div>{{ teacherDetails.phone || 'Not provided' }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Salary per Session</strong>
          <div>${{ teacherDetails.salaryPerSession }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Notes</strong>
          <div>{{ teacherDetails.notes || 'None' }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Date of Birth</strong>
          <div>{{ formatDate(teacherDetails.bod) }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Education Level</strong>
          <div>{{ teacherDetails.educationLevel || 'N/A' }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>University Degree</strong>
          <div>{{ teacherDetails.universityDegree || 'N/A' }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Years of Experience</strong>
          <div>{{ teacherDetails.yearsOfExperience || 0 }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Gender</strong>
          <div>{{ teacherDetails.gender || 'N/A' }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Sessions This Month</strong>
          <div>{{ teacherDetails.sessionsCountInMonth || 0 }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Organization ID</strong>
          <div>{{ teacherDetails.organizationId }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Subject ID</strong>
          <div>{{ teacherDetails.subjectId }}</div>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-3 text-center">
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Created At</strong>
          <div>{{ formatDate(teacherDetails.createdAt) }}</div>
        </v-col>
        <v-col cols="12" md="5" class="mx-auto">
          <strong>Updated At</strong>
          <div>{{ formatDate(teacherDetails.updatedAt) }}</div>
        </v-col>
      </v-row>
    </v-card>

    <div v-else>
      <v-alert type="error">Teacher not found.</v-alert>
    </div>
  </v-container>
</template>

<script>
import { useTeachersStore } from '../store/teachers'

export default {
  name: 'TeachersDetails',
  data() {
    return {
      teacherDetails: null,
    }
  },
  mounted() {
    const id = Number(this.$route.params.id)
    const store = useTeachersStore()
    this.teacherDetails = store.teachers.find((t) => t.id === id)
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      return d.toLocaleDateString()
    },
  },
}
</script>

<style scoped>
h2 {
  font-weight: 700;
  font-size: 1.8rem;
}
strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 4px;
}
</style>
