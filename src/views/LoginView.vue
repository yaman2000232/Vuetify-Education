<template>
  <v-container class="fill-height login-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-4">
          <v-card-title class="text-h5 text-center">Sign In</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')

const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  console.log(' Starting login process...')
  try {
    await auth.login(email.value, password.value)

    if (auth.role === 'ORGANIZATION') {
      console.log(' Redirecting to admin dashboard...')
      router.push('/admin/dashboard')
    } else if (auth.role === 'TEACHER') {
      console.log(' Redirecting to teacher dashboard...')
      router.push('/admin/courses')
    } else {
      console.warn('⚠️ Unknown role, redirecting to login...')
      router.push('/login')
    }

  } catch (err) {
    console.error(' Login failed:', err)

    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: err.message || 'Invalid email or password. Please try again.',
      confirmButtonColor: '#1976D2',
    })
  }
}
</script>

<style >
.fill-height {
  min-height: 100vh;
}
</style>
