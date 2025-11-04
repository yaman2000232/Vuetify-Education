import { createRouter, createWebHistory } from 'vue-router'

// Layout
import AdminLayout from '@/layout/AdminLayout.vue'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TeachersView from '@/views/TeachersView.vue'
import ClassesView from '@/views/ClassesView.vue'
import StudentsView from '@/views/StudentsView.vue'
import CoursesView from '@/views/CoursesView.vue'
import TeachersDetails from '@/Details/TeachersDetails.vue'
import CoursesDetails from '@/Details/CoursesDetails.vue'
import SessionsView from '@/views/SessionsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AttView from '@/views/AttView.vue'
import LandingPage from '@/views/LandingPage.vue'

const routes = [
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/',
    component: LandingPage,
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: DashboardView, meta: { role: ['ORGANIZATION','TEACHER'] } },
      { path: 'teachers', component: TeachersView, meta: { role: ['ORGANIZATION'] } },
      { path: 'classes', component: ClassesView, meta: { role: ['ORGANIZATION'] } },
      { path: 'students', component: StudentsView, meta: { role: ['ORGANIZATION'] } },
      { path: 'sessions', component: SessionsView, meta: { role: ['ORGANIZATION','TEACHER'] } },
      { path: 'courses', component: CoursesView, meta: { role: ['ORGANIZATION','TEACHER'] } },
      { path: 'settings', component: SettingsView, meta: { role: ['ORGANIZATION','TEACHER'] } },
      { path: 'att', component: AttView, meta: { role: ['ORGANIZATION'] } },
    ],
  },

  {
    path: '/admin/teachers/:id',
    component: TeachersDetails,
    name: 'TeacherDetails',
    meta: { requiresAuth: true, role: ['ORGANIZATION'] },
  },
  {
    path: '/admin/courses/:id',
    component: CoursesDetails,
    name: 'CoursesDetails',
    meta: { requiresAuth: true, role: ['ORGANIZATION','TEACHER'] },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.meta.role && !to.meta.role.includes(role)) {
    next('/login')
    return
  }

  next()
})

export default router
