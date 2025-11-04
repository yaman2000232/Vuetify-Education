<template>
  <v-footer app class="text-center d-flex flex-column ga-2 py-4" color="surfaceCustom elevation-5">
    <div class="d-flex justify-center ga-3">
      <v-btn
        v-for="icon in icons"
        :key="icon"
        density="comfortable"
        variant="text"
      >
        <v-icon :icon="icon" />
      </v-btn>
    </div>

    <v-divider class="my-2" thickness="3" width="50"></v-divider>

   <div class=" m-2 text-caption font-weight-regular opacity-60 px-4 max-width-400 line-clamp-2">
  Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit ametectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
</div>

    <v-divider class="my-2"></v-divider>

    <div>
      {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
</script>
