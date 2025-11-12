<template>
  <div>
    <v-card height="75" elevation="0" class="bg-white">
      <v-toolbar extended elevation="0" class="bg-white">
        <v-toolbar-title>Session Management</v-toolbar-title>

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

          <!-- Add Session Dialog -->
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
                  Add Session
                </v-btn>
              </template>

              <v-card title="New Session">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="newSession.title"
                          label="Session Title"
                          prepend-icon="mdi-tag-text"
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                          v-model="newSession.duration"
                          type="number"
                          label="Duration (minutes)"
                          prepend-icon="mdi-timer"
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-select
                          v-model="newSession.courseId"
                          :items="coursesStore.courses"
                          item-title="title"
                          item-value="id"
                          label="Select Course"
                          prepend-icon="mdi-book"
                          variant="outlined"
                          density="comfortable"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text variant="plain" @click="dialog = false">Close</v-btn>
                  <v-btn color="primary" text variant="tonal" @click="addSession">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-toolbar>
    </v-card>

      <div>
    <!-- Skeleton shown while loading -->
    <v-skeleton-loader
      v-if="sessionStore.loading"
      type="table"
      class="mx-auto"
      max-width="100%"
    />

    <v-data-table
     v-else
      :headers="headers"
      :items="filteredSessions"
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

      <template #item.duration="{ item }">
        <div class="text-start">{{ Number(item.duration) }} min</div>
      </template>

      <template #item.courseId="{ item }">
        <div class="text-start">
          {{ getCourseName(item.courseId) }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-tooltip text="Edit Session" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon size="small" variant="text" color="blue-grey-lighten-1" v-bind="props" @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Delete Session" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon size="small" variant="text" color="red-darken-1" v-bind="props" @click="openConfirmDialog(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
    </div>

    <v-dialog v-model="confirmDialog" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">
          <v-icon size="36" color="red" class="me-3">mdi-delete-alert</v-icon>
          <span class="text-h5 font-weight-medium">Confirm Deletion</span>
        </v-card-title>
        <v-card-text class="text-center mt-2">
          Are you sure you want to <strong style="color: #b71c1c">delete this Session?</strong>
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
          <span class="text-h5 font-weight-medium me-2">Edit Session</span>
          <v-icon color="black" size="24">mdi-pencil</v-icon>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editSession.id" label="ID" disabled />
          <v-text-field v-model="editSession.title" label="Title" />
          <v-text-field v-model="editSession.duration" type="number" label="Duration (minutes)" />
          <v-select
            v-model="editSession.courseId"
            :items="coursesStore.courses"
            item-title="title"
            item-value="id"
            label="Select Course"
            prepend-icon="mdi-book"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-divider class="my-4"></v-divider>
        <v-card-actions>
          <v-spacer/>
          <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
           <v-btn
  color="primary"
  variant="tonal"
  :disabled="savingEdit"
  @click="saveEdit"
>
  <template v-if="savingEdit">
    <v-progress-circular indeterminate color="white" size="20" class="mr-2" />
    <!-- Saving... -->
  </template>
  <template v-else>
    Save
  </template>
</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import { useSessionStore } from '@/store/sessions'
import { useCoursesStore } from '@/store/courses' 

export default {
  data() {
    return {
        
      dialog: false,
        savingEdit:false,
      confirmDialogEdit: false,
      confirmDialog: false,
      toDeleteId: null,
      searchText: '',
      newSession: {
        title: '',
        duration: null,
        courseId: null
      },
      editSession: {
        id: null,
        title: '',
        duration: null,
        courseId: null
      }
    }
  },

  computed: {
    sessionStore() {
      return useSessionStore()
    },
      coursesStore() {
      return useCoursesStore()
    },

    filteredSessions() {
      let result = this.sessionStore.sessions
      if (this.searchText) {
        const text = this.searchText.toLowerCase()
        result = result.filter(s => s.title.toLowerCase().includes(text))
      }
      return result
    },

    headers() {
      return [
        { title: 'ID', value: 'id', align: 'center' },
        { title: 'Title', value: 'title', align: 'start' },
        { title: 'Duration (min)', value: 'duration', align: 'center' },
        { title: 'Course ID', value: 'courseId', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },

  methods: {
  async addSession() {
    const newSessionObj = {
      title: this.newSession.title,
      duration: Number(this.newSession.duration),
      courseId: this.newSession.courseId
    }
    await this.sessionStore.createSessionFromApi(newSessionObj)
    this.newSession = { title: '', duration: null, courseId: null }
    this.dialog = false
  },
  getCourseName(courseId) {
    if (!this.courseStore || !this.courseStore.courses) {
      return `Course #${courseId}`
    }
    const course = this.courseStore.courses.find(c => c.id === courseId)
    return course ? course.title : `Course #${courseId}`
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
    await this.sessionStore.deleteSessionFromApi(this.toDeleteId)
    this.toDeleteId = null
    this.confirmDialog = false
  },

  openEditDialog(session) {
    this.confirmDialogEdit = true
    this.editSession = { ...session }
  },

  cancelEdit() {
    this.confirmDialogEdit = false
  },

  async saveEdit() {
     this.savingEdit = true
    const update = {
      title: this.editSession.title,
      duration: this.editSession.duration,
      courseId: this.editSession.courseId
    }
    try{
      await this.sessionStore.updateSessionFromApi(this.editSession.id, update)
      this.confirmDialogEdit = false
    }
    catch{
      console.error(' Failed to save edit:', error)
        alert('Failed to update student. Please try again.')
    }finally{
         this.savingEdit = false
      }
  }
},


mounted() {
  this.sessionStore.listSessions()
   this.coursesStore.listCourses()
}
}
</script>
