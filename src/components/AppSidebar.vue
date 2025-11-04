<template>
  <v-navigation-drawer color="surfaceCustom" class="mb-6 " v-model="drawer" app>
    <v-list nav>
      <template v-if="auth.role === 'ORGANIZATION'">
        <v-list-item to="/admin/dashboard" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-view-dashboard" /></template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/teachers" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-account-tie" /></template>
          <v-list-item-title>Teachers Management</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/classes" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-google-classroom" /></template>
          <v-list-item-title>Classes Management</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/students" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-school" /></template>
          <v-list-item-title>Students Management</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/courses" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-book-open-page-variant" /></template>
          <v-list-item-title>Courses Management</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/sessions" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-calendar-clock" /></template>
          <v-list-item-title>Sessions</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/att" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-check-decagram" /></template>
          <v-list-item-title>Attendance</v-list-item-title>
        </v-list-item>

        <v-list-item to="/" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-bus" /></template>
          <v-list-item-title>Buses</v-list-item-title>
        </v-list-item>

        <v-list-item to="/" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-map-marker" /></template>
          <v-list-item-title>Maps</v-list-item-title>
        </v-list-item>

        <v-list-item to="/" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-file-chart" /></template>
          <v-list-item-title>Reports / Exports</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/settings" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-cog-outline" /></template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </template>

      <template v-else-if="auth.role === 'TEACHER'">
        <v-list-item to="/admin/dashboard" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-view-dashboard" /></template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/courses" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-book-open-page-variant" /></template>
          <v-list-item-title>My Courses</v-list-item-title>
        </v-list-item>
        <v-list-item to="/admin/sessions" color="grey">
          <template v-slot:prepend><v-icon icon="mdi-book-open-page-variant" /></template>
          <v-list-item-title>My Sessions</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar class="elevation-0" color="surfaceCustom" app>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title></v-app-bar-title>
    <v-spacer />
  </v-app-bar>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'AppSidebar',
  setup() {
    const drawer = ref(false)
    const auth = useAuthStore()

    return {
      drawer,
      auth,
    }
  },
}
</script>
