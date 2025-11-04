<template>
  <v-app-bar app color="surfaceCustom"  flat   >
    <v-toolbar-title class="font-weight-bold">
     {{ $t('title') }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

       <v-menu location="bottom" transition="scale-transition">
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

    <v-list >
  <v-list-item @click="changeTheme" class="justify-center">
    <v-btn icon size="large" variant="text">
      <v-icon size="x-large">
        {{ theme.name === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
      </v-icon>
    </v-btn>
  </v-list-item>

  <v-list-item @click="changeLang" class="justify-center">
    <v-btn icon size="large" variant="text">
      <v-icon size="x-large">
        {{ $i18n.locale === 'en' ? 'mdi-translate' : 'mdi-alphabetical' }}
      </v-icon>
    </v-btn>
  </v-list-item>
</v-list>

    </v-menu>

    <v-btn variant="text" to="/about">{{ $t('about') }}</v-btn>
    <v-btn variant="text" to="/contact">{{ $t('contact') }}</v-btn>
  <v-btn color="red" @click="handleLogout">{{ $t('logout') }}</v-btn>

  

          
  </v-app-bar>
</template>

<script >

import { useTheme } from 'vuetify'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      theme: useTheme(),
      auth: useAuthStore(),
      router: useRouter(),
    }
  },

  computed: {
    nextTheme() {
      return this.theme.name === 'light' ? 'dark' : 'light'
    },
    nextLang() {
      return this.$i18n.locale === 'en' ? 'ar' : 'en'
    },
  },

  methods: {
    changeTheme() {
      localStorage.setItem('theme', this.nextTheme)
      this.theme.change(this.nextTheme)
    },
    changeLang() {
      localStorage.setItem('lang', this.nextLang)
      this.$i18n.locale = this.nextLang
    },
  handleLogout() {
  Swal.fire({
    icon: 'warning',
    color:'black',
    title: 'Are you sure?',
    text: 'Do you really want to log out?',
    showCancelButton: true,
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#FCB53B',
    cancelButtonColor: '#eee',
  }).then((result) => {
    if (result.isConfirmed) {
      this.auth.logout()
      this.router.push('/login')
    }
  })
}

  }
}


</script>

<style >

</style>
