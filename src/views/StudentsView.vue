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

          <!-- <v-select
            class="mx-auto px-2 mt-5"
            style="width: 300px"
            v-model="selectedClassFilter"
            item-title="level"
            item-value="id"
            label="Filter by Class"
            clearable
            variant="outlined"
            density="comfortable"
          /> -->

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
          

            <!-- <v-col cols="12">
              <v-textarea v-model="newStudent.notes" label="Notes" />
            </v-col> -->

            <!-- <v-col cols="6"> -->
              <!-- <v-text-field v-model="newStudent.lat" label="Latitude" type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="newStudent.lng" label="Longitude" type="number" />
            </v-col> -->

          
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

<v-dialog v-model="confirmDialogEdit" max-width="600">
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
      <v-btn color="primary" text="Save" variant="tonal" @click="saveEdit"></v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


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


<v-data-table
  :headers="headers"
  :items="studentsStore.students"
  class="v-data-table-clean-students"
  density="comfortable"
  hover
>
  <!-- <template v-slot:item.id="{ item }">
    <div class="text-center text-caption text-grey-darken-1">{{ item.id }}</div>
  </template> -->
<template v-slot:item.id="{ item }">
  <div>{{ item.id }}</div>
</template>

  <template v-slot:item.fullName="{ item }">
    <div class="d-flex flex-column text-start">
      <div class="font-weight-bold text-blue-darken-3">
        {{ item.firstName }} {{ item.lastName }}
      </div>
      <!-- <div class="text-caption text-grey-darken-1">{{ item.email }}</div> -->
    </div>
  </template>
  <!-- <template v-slot:item.imageUrl="{ item }">
  <div class="text-center">
    <v-avatar size="40">
      <v-img :src="item.imageUrl" alt="Student Image" />
    </v-avatar>
  </div>
</template> -->


 

  <template v-slot:item.gender="{ item }">
    <div class="text-start text-body-2 text-grey-darken-2">{{ item.gender }}</div>
  </template>

 <template v-slot:item.bod="{ item }">
  <div class="text-start text-body-2 text-grey-darken-2">
    {{ item.bod ? new Date(item.bod).toISOString() : '—' }}
  </div>
</template>



  <!-- <template v-slot:item.notes="{ item }">
    <div class="text-start text-caption text-grey-darken-1">{{ item.notes || '—' }}</div>
  </template>

  <template v-slot:item.lat="{ item }">
    <div class="text-end text-body-2 text-grey-darken-2">{{ item.lat || 'N/A' }}</div>
  </template>

  <template v-slot:item.lng="{ item }">
    <div class="text-end text-body-2 text-grey-darken-2">{{ item.lng || 'N/A' }}</div>
  </template> -->

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

    <!-- <v-tooltip text="View" location="top">
      <template v-slot:activator="{ props }">
        <v-btn icon size="x-small" variant="text" color="indigo-darken-1" v-bind="props" @click="viewStudentDetails(item.id)">
          <v-icon>mdi-eye-outline</v-icon>
        </v-btn>
      </template>
    </v-tooltip> -->
  </template>
</v-data-table>

  </div>
</template>

<script>
import { useStudentsStore } from '@/store/students'

export default {
  name: 'StudentView',

  data() {
    return {
      dialog: false,
      confirmDialogEdit: false,
      confirmDialog: false,
      toDeleteId: null,

      searchQuery: '',

   newStudent: {
  firstName: '',
  lastName: '',
  
  gender: '',
  bod: '',
  // notes: '',
  // lat: '',
  // lng: '',
  // imageUrl: ''
},


   editStudent: {
  id: null,
  firstName: '',
  lastName: '',
 
  gender: '',
  bod: '',
  notes: '',
  lat: '',
  lng: '',
  imageUrl: ''
}

    }
  },

  computed: {
    studentsStore() {
      return useStudentsStore()
    },
    // classesStore() {
    //   return useClassesStore()
    // },

   

    // filteredStudents() {
    //   let result = this.studentsStore.students || []

    //   if (this.selectedClassFilter) {
    //     result = result.filter(s => s.class_id === this.selectedClassFilter)
    //   }

    //   if (this.searchQuery) {
    //     const query = this.searchQuery.toLowerCase()
    //     result = result.filter(s => (s.name || '').toLowerCase().includes(query) || (s.email || '').toLowerCase().includes(query))
    //   }

    //   return result
    // },

   headers() {
  return [
    // { text: 'ID', value: 'id' },
    // { text: 'imageUrl', value: 'imageUrl' },
    { text: 'ID', value: 'id' },
    { text: 'Full Name', value: 'fullName' },
   
    { text: 'Gender', value: 'gender' },
    { text: 'Birth Date', value: 'bod' },
    // { text: 'Notes', value: 'notes' },
    // { text: 'Latitude', value: 'lat' },
    // { text: 'Longitude', value: 'lng' },
    { text: 'Actions', value: 'actions', sortable: false }
  ]
}

  },

  methods: {
  

    openDialog() {
      this.dialog = true
    },

  async addStudent() {
  if (!this.newStudent.firstName || !this.newStudent.lastName || !this.newStudent.gender || !this.newStudent.bod) {
    return alert('Please fill in all required fields: First name, Last name, Gender, and Birth date.')
  }

  const newStudentObj = {
    firstName: this.newStudent.firstName,
    lastName: this.newStudent.lastName,
    // imageUrl: this.newStudent.imageUrl,
    gender: this.newStudent.gender,
    bod: this.newStudent.bod,
    // notes: this.newStudent.notes || '',
    // lat: this.newStudent.lat ? Number(this.newStudent.lat) : null,
    // lng: this.newStudent.lng ? Number(this.newStudent.lng) : null,
  }

  console.log('📦 Sending student:', newStudentObj)

  try {
    await this.studentsStore.createStudentsFromApi(newStudentObj)
    this.dialog = false
    this.newStudent = {
      firstName: '',
      lastName: '',
      gender: '',
      // imageUrl:'',
      bod: '',
      // notes: '',
      // lat: '',
      // lng: '',
    }
  } catch (error) {
    console.error(' Failed to add student:', error)
    alert('Failed to add student. Please try again.')
  }
},



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
},


    openEditDialog(student) {
      this.editStudent = { ...student } 
      this.confirmDialogEdit = true
    },

    cancelEdit() {
  this.confirmDialogEdit = false
  this.editStudent = {
    id: null,
    firstName: '',
    lastName: '',
   
    gender: '',
    bod: '',
    notes: '',
    lat: '',
    lng: '',
    imageUrl: ''
  }
},


async saveEdit() {
  if (!this.editStudent || !this.editStudent.id) return

  if (!this.editStudent.firstName || !this.editStudent.lastName) {
    return alert('First name and last name are required.')
  }

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
  } catch (error) {
    console.error(' Failed to save edit:', error)
    alert('Failed to update student. Please try again.')
  }
}

 
  },

   mounted() {
         this.studentsStore.listStudents()
         }

  }

</script>
