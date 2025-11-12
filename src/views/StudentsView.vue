<template>
  
  <div>
    <v-card height="75" elevation="0" class="bg-white">
      <v-toolbar extended elevation="0" class="bg-white">
        <v-toolbar-title>Manage Students</v-toolbar-title>

        <template v-slot:append>
          <v-text-field
            class="mx-auto px-2 text-h6"
            style="width: 300px"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by name"
            variant="outlined"
            hide-details
            density="comfortable"
            v-model="searchQuery"
          />

        <div class="pa-4 text-center">
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-account-plus"
        text="Add a Student"
        variant="tonal"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card>
      <v-card-title>Student Information</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="newStudent.firstName" label="First Name" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newStudent.lastName" label="Last Name" />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="newStudent.gender"
                :items="['MALE', 'FEMALE']"
                label="Gender"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="newStudent.bod" label="Date of Birth" type="date" />
            </v-col>

            <!-- MAP PICKER ADDED HERE (inline in Add dialog) -->
            <v-col cols="12">
              <div class="mb-2 text-caption">Click the map to place a marker — Length = latitude, Width = longitude.</div>
              <MapPicker
                :markers="addInlineMarkers"
                :editable="false"
                :initialCenter="{ lat: 6.5, lng: 3.4 }"
                @marker-added="onAddMapMarker"
                @marker-selected="onAddMapMarker"
                @update:markers="val => addInlineMarkers = val"
                height="240px"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="newStudent.length" label="Length (Latitude)" type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newStudent.width" label="Width (Longitude)" type="number" />
            </v-col>

          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
        <v-btn color="primary" text="Add" variant="tonal" @click="addStudent"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>

        </template>
      </v-toolbar>
    </v-card>

<!-- EDIT DIALOG: I inject a MapPicker inside the same edit dialog (confirmDialogEdit) -->
<v-dialog v-model="confirmDialogEdit" max-width="900">
  <v-card>
    <v-card-title>Edit Student</v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="editStudent.firstName" label="First Name" />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editStudent.lastName" label="Last Name" />
          </v-col>

        
          <v-col cols="12">
            <v-select
              v-model="editStudent.gender"
              :items="['MALE', 'FEMALE']"
              label="gender"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="editStudent.bod" label="Date of Birth" type="date" />
          </v-col>

          <v-col cols="12">
            <v-textarea v-model="editStudent.notes" label="Notes" />
          </v-col>

          <!-- MAP PICKER ADDED HERE (inside Edit dialog) -->
          <v-col cols="12">
            <div class="mb-2 text-caption">Drag the marker to change coordinates, or click it to open the small editor. Length = latitude, Width = longitude.</div>
            <MapPicker
              :markers="editInlineMarkers"
              :editable="true"
              :initialCenter="{ lat: (editStudent.lat ?? 6.5), lng: (editStudent.lng ?? 3.4) }"
              @marker-selected="onEditMapMarkerSelected"
              @coordinates-changed="onEditMapMarkerDragged"
              @update:markers="val => editInlineMarkers = val"
              height="300px"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field v-model="editStudent.lat" label="Latitude" type="number" />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editStudent.lng" label="Longitude" type="number" />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="editStudent.imageUrl" label="Image URL" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer />
      <v-btn text="Cancel" variant="plain" @click="cancelEdit"></v-btn>
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

<!-- rest of your file unchanged (confirmDialog, data table) -->
<v-dialog v-model="confirmDialog" max-width="550" transition="dialog-bottom-transition">
  <v-card class="pa-4 rounded-lg">
    <v-card-title class="text-h5 font-weight-bold text-center text-red-darken-2">
      Confirm Student Deletion
    </v-card-title>

    <v-card-text class="text-body-1 text-center mt-3">
      Are you sure you want to <span class="font-weight-medium text-red-darken-2">delete this student</span>?
      <br />
      This action <strong>cannot be undone.</strong>
    </v-card-text>

    <v-divider class="my-4"></v-divider>

    <v-card-actions class="justify-center">
      <v-btn
        variant="outlined"
        color="grey-darken-1"
        class="px-6"
        @click="cancelDeletion"
      >
        Cancel
      </v-btn>

      <v-btn
        color="red-darken-2"
        variant="elevated"
        class="px-6"
        @click="confirmDeletion"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  <div>
    <!-- Skeleton shown while loading -->
    <v-skeleton-loader
      v-if="studentsStore.loading"
      type="table"
      class="mx-auto"
      max-width="100%"
    />




<v-data-table
  v-else
  :headers="headers"
  :items="studentsStore.students"
  class="v-data-table-clean-students"
  density="comfortable"
  hover
>
  <!-- your table templates unchanged -->
  <template v-slot:item.id="{ item }">
    <div>{{ item.id }}</div>
  </template>

  <template v-slot:item.fullName="{ item }">
    <div class="d-flex flex-column text-start">
      <div class="font-weight-bold text-blue-darken-3">
        {{ item.firstName }} {{ item.lastName }}
      </div>
    </div>
  </template>

  <template v-slot:item.gender="{ item }">
    <div class="text-start text-body-2 text-grey-darken-2">{{ item.gender }}</div>
  </template>

 <template v-slot:item.bod="{ item }">
  <div class="text-start text-body-2 text-grey-darken-2">
    {{ item.bod ? new Date(item.bod).toISOString() : '—' }}
  </div>
</template>

  <template v-slot:item.actions="{ item }">
    <v-tooltip text="Edit" location="top">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" variant="text" color="blue-grey-lighten-1" v-bind="props" @click="openEditDialog(item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Delete" location="top">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" variant="text" color="red-darken-1" v-bind="props" @click="openConfirmDialog(item.id)">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </template>
</v-data-table>

  </div>
   </div>
</template>

<script>
import { useStudentsStore } from '@/store/students'
import MapPicker from '@/components/MapPicker.vue'

export default {
  name: 'StudentView',
  components: { MapPicker },
  data() {
    return {
      dialog: false,
      confirmDialogEdit: false,
      confirmDialog: false,
      toDeleteId: null,
      savingEdit:false,

      searchQuery: '',

      // ADD student form (added length/width)
      newStudent: {
        firstName: '',
        lastName: '',
        gender: '',
        bod: '',
        length: null, // latitude
        width: null   // longitude
      },

      // small marker array to show the inline add map (keeps markers while Add dialog open)
      addInlineMarkers: [],

      // for edit dialog: a small markers array used by the inline MapPicker inside edit dialog
      editInlineMarkers: [],

      editStudent: {
        id: null,
        firstName: '',
        lastName: '',
        gender: '',
        bod: '',
        notes: '',
        lat: null,
        lng: null,
        imageUrl: ''
      }

    }
  },

  computed: {
    studentsStore() {
      return useStudentsStore()
    },

   headers() {
  return [
    { text: 'ID', value: 'id' },
    { text: 'Full Name', value: 'fullName' },
    { text: 'Gender', value: 'gender' },
    { text: 'Birth Date', value: 'bod' },
    { text: 'lng', value: 'lng' },
    { text: 'lat', value: 'lat' },
    { text: 'Actions', value: 'actions', sortable: false }
  ]
}

  },

  methods: {

    /* ---------------- Add flows ---------------- */
    onAddMapMarker({ marker }) {
      // marker: { id, lat, lng }
      // map Length -> latitude, Width -> longitude
      this.newStudent.length = Number(marker.lat.toFixed(6))
      this.newStudent.width = Number(marker.lng.toFixed(6))
      // keep marker in the inline add markers array
      // (MapPicker already updated addInlineMarkers via update:markers)
    },

    async addStudent() {
      if (!this.newStudent.firstName || !this.newStudent.lastName || !this.newStudent.gender || !this.newStudent.bod) {
        return alert('Please fill in all required fields: First name, Last name, Gender, and Birth date.')
      }

      const newStudentObj = {
        firstName: this.newStudent.firstName,
        lastName: this.newStudent.lastName,
        gender: this.newStudent.gender,
        bod: this.newStudent.bod,
        lat: this.newStudent.length ? Number(this.newStudent.length) : null,
        lng: this.newStudent.width ? Number(this.newStudent.width) : null,
      }

      try {
        await this.studentsStore.createStudentsFromApi(newStudentObj)
        this.dialog = false
        this.newStudent = { firstName: '', lastName: '', gender: '', bod: '', length: null, width: null }
        this.addInlineMarkers = []
      } catch (error) {
        console.error(' Failed to add student:', error)
        alert('Failed to add student. Please try again.')
      }
    },

    /* ---------------- Edit flows ---------------- */

    openEditDialog(student) {
      this.editStudent = { ...student }
      // prepare editInlineMarkers with one marker for this student (deterministic id)
      this.editInlineMarkers = [{
        id: `s_${student.id}`,
        studentId: student.id,
        lat: student.lat != null ? Number(student.lat) : 6.5,
        lng: student.lng != null ? Number(student.lng) : 3.4,
        label: student.firstName ? student.firstName.charAt(0) : ''
      }]
      this.confirmDialogEdit = true
    },

    cancelEdit() {
      this.confirmDialogEdit = false
      this.editStudent = {
        id: null, firstName: '', lastName: '', gender: '', bod: '',
        notes: '', lat: null, lng: null, imageUrl: ''
      }
      this.editInlineMarkers = []
    },

    // when marker is clicked in the edit dialog (marker-selected)
    onEditMapMarkerSelected({ marker }) {
      // populate editStudent lat/lng and show them in fields
      this.editStudent.lat = Number(marker.lat.toFixed(6))
      this.editStudent.lng = Number(marker.lng.toFixed(6))
    },

    // when marker dragged in the edit MapPicker
    async onEditMapMarkerDragged({ marker }) {
      // marker contains studentId if we set it earlier
      const sId = marker.studentId
      // update the editStudent fields if editing same student
      if (this.editStudent && this.editStudent.id === sId) {
        this.editStudent.lat = Number(marker.lat.toFixed(6))
        this.editStudent.lng = Number(marker.lng.toFixed(6))
      }

      // update pinia store immediately for UI responsiveness
      const student = this.studentsStore.students.find(s => s.id === sId)
      if (!student) return
      const updatedLocal = { ...student, lat: marker.lat, lng: marker.lng }
      this.studentsStore.updateStudent(updatedLocal)

      // persist to API (best-effort)
      try {
        await this.studentsStore.updateStudentFromApi(sId, updatedLocal)
      } catch (err) {
        console.error('Failed to persist coordinate change:', err)
      }
    },

    async saveEdit() {
      if (!this.editStudent || !this.editStudent.id) return

      if (!this.editStudent.firstName || !this.editStudent.lastName) {
        return alert('First name and last name are required.')
      }
       this.savingEdit = true
      const update = {
        firstName: this.editStudent.firstName,
        lastName: this.editStudent.lastName,
        gender: this.editStudent.gender,
        bod: this.editStudent.bod,
        notes: this.editStudent.notes,
        lat: this.editStudent.lat ? Number(this.editStudent.lat) : null,
        lng: this.editStudent.lng ? Number(this.editStudent.lng) : null,
        imageUrl: this.editStudent.imageUrl
      }

      try {
        await this.studentsStore.updateStudentFromApi(this.editStudent.id, update)
        this.confirmDialogEdit = false
        this.editInlineMarkers = []
      } catch (error) {
        console.error(' Failed to save edit:', error)
        alert('Failed to update student. Please try again.')
      }finally{
         this.savingEdit = false
      }
    },

    /* ---------------- Delete flows (unchanged) ---------------- */
    openConfirmDialog(id) {
      this.toDeleteId = id
      this.confirmDialog = true
    },

    cancelDeletion() {
      this.confirmDialog = false
      this.toDeleteId = null
    },

    async confirmDeletion() {
      if (this.toDeleteId == null) return

      try {
        await this.studentsStore.deleteFromApi(this.toDeleteId)
        this.confirmDialog = false
        this.toDeleteId = null
      } catch (error) {
        console.error(' Failed to delete student:', error)
        alert('Failed to delete student. Please try again.')
      }
    }

  },

   mounted() {
         this.studentsStore.listStudents()
         }

  }

</script>
