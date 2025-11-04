<template>
  <v-app>
    <AppHeader />

    <AppSidebar />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';
import AppFooter from '../components/AppFooter.vue';

export default {
  name: 'AdminLayout',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },
};
</script>

<style >
</style>
