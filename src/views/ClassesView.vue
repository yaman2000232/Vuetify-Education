<template>
  <div>
    <v-card height="75" elevation="0" class="bg-white">
      <v-toolbar extended elevation="0" class="bg-white">
        <v-toolbar-title>ClassRoom Management</v-toolbar-title>

        <template v-slot:append>
          <v-text-field
            class="mx-auto px-2 text-h6"
            style="width: 300px"
            v-model="searchText"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by Title"
            variant="outlined"
            hide-details
            density="comfortable"
          />

          <v-select
            class="mx-auto px-2 mt-5"
            width="300px"
            v-model="selectedProjector"
            :items="projectorOptions"
            label="Projector Status"
            placeholder="Filter by projector"
            clearable
            variant="outlined"
            density="comfortable"
          />

          <div class="pa-4 text-center">
            <v-dialog v-model="dialog" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  class="text-none font-weight-regular"
                  prepend-icon="mdi-plus-box-multiple"
                  text
                  variant="tonal"
                  v-bind="activatorProps"
                >
                  Add a ClassRoom
                </v-btn>
              </template>

              <v-card title="New ClassRoom">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="newClass.title"
                          label="ClassRoom Title"
                          prepend-icon="mdi-tag-text"
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-switch
                          v-model="newClass.hasProjector"
                          label="Has Projector"
                          inset
                          color="blue"
                          :true-value="true"
                          :false-value="false"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text variant="plain" @click="dialog = false">Close</v-btn>
                  <v-btn color="primary" text variant="tonal" @click="AddClassHere">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-toolbar>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="filteredClasses"
      class="v-data-table-custom"
      density="comfortable"
      hover
    >
      <template #item.id="{ item }">
        <div class="text-center font-weight-regular text-grey-darken-1">{{ item.id }}</div>
      </template>

      <template #item.title="{ item }">
        <div class="text-start font-weight-bold text-blue-darken-3">{{ item.title }}</div>
      </template>

      <template #item.hasProjector="{ item }">
        <v-chip
          :color="item.hasProjector ? 'green-darken-1' : 'red-darken-1'"
          variant="tonal"
          size="small"
          class="font-weight-bold"
        >
          <v-icon start>{{ item.hasProjector ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
          {{ item.hasProjector ? 'Yes' : 'No' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip text="Edit ClassRoom" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon size="small" variant="text" color="blue-grey-lighten-1" v-bind="props" @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Delete ClassRoom" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon size="small" variant="text" color="red-darken-1" v-bind="props" @click="openConfirmDialog(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="confirmDialog" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">
          <v-icon size="36" color="red" class="me-3">mdi-delete-alert</v-icon>
          <span class="text-h5 font-weight-medium">Confirm Deletion</span>
        </v-card-title>
        <v-card-text class="text-center mt-2">
          Are you sure you want to <strong style="color: #b71c1c">delete this ClassRoom?</strong>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn variant="outlined" color="grey" @click="cancelDeletion" class="px-6">Cancel</v-btn>
          <v-btn color="red" variant="tonal" class="px-6" @click="confirmDeletion">
            <v-icon start>mdi-delete</v-icon> Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDialogEdit" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">
          <span class="text-h5 font-weight-medium me-2">Edit ClassRoom</span>
          <v-icon color="black" size="24">mdi-pencil</v-icon>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editClass.id" label="ID" disabled />
          <v-text-field v-model="editClass.title" label="Title" />
          <v-switch v-model="editClass.hasProjector" label="Has Projector" inset color="blue" :true-value="true" :false-value="false"/>
        </v-card-text>
        <v-divider class="my-4"></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { useClassStore } from '@/store/classes'

export default {
  data() {
    return {
      dialog: false,
      confirmDialogEdit: false,
      confirmDialog: false,
      toDeleteId: null,
      searchText: '',
      selectedProjector: null,
      projectorOptions: [
        { title: 'Yes', value: true },
        { title: 'No', value: false }
      ],
      newClass: {
        title: '',
        hasProjector: false
      },
      editClass: {
        id: null,
        title: '',
        hasProjector: false
      }
    }
  },

  computed: {
    classesStore() {
      return useClassStore()
    },

    filteredClasses() {
      let result = this.classesStore.classes

      if (this.selectedProjector !== null) {
        result = result.filter(c => c.hasProjector === this.selectedProjector)
      }

      if (this.searchText) {
        const text = this.searchText.toLowerCase()
        result = result.filter(c => c.title.toLowerCase().includes(text))
      }

      return result
    },

    headers() {
      return [
        { title: 'ID', value: 'id', align: 'center' },
        { title: 'Title', value: 'title', align: 'start' },
        { title: 'Has Projector', value: 'hasProjector', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },

  methods: {
    async AddClassHere() {
      const newClassObj = {
        title: this.newClass.title,
        hasProjector: this.newClass.hasProjector
      }
      await this.classesStore.createClassFromApi(newClassObj)
      this.newClass = { title: '', hasProjector: false }
      this.dialog = false
    },

    openConfirmDialog(id) {
      this.toDeleteId = id
      this.confirmDialog = true
    },

    cancelDeletion() {
      this.confirmDialog = false
    },

    async confirmDeletion() {
      if (!this.toDeleteId) return
      await this.classesStore.deleteClassFromApi(this.toDeleteId)
      this.toDeleteId = null
    },

    openEditDialog(classa) {
      this.confirmDialogEdit = true
      this.editClass = { ...classa }
    },

    cancelEdit() {
      this.confirmDialogEdit = false
    },

    async saveEdit() {
  const update = {
    title: this.editClass.title,
    hasProjector: this.editClass.hasProjector
  }
  await this.classesStore.updateClassFromApi(this.editClass.id, update)
  this.confirmDialogEdit = false
}

  },

  mounted() {
    this.classesStore.listClasses()
  }
}
</script>

<style scoped>
.v-data-table-custom {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.v-data-table-custom .v-data-table-header th {
  background-color: #f7f9fa;
  font-weight: 600 !important;
  color: #333 !important;
}
</style>
