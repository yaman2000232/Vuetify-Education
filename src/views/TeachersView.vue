<template>

  <div>

    <!-- Toolbar + Search + Filter -->

    <v-card height="75" elevation="0" class="bg-white">

      <v-toolbar extended elevation="0" class="bg-white">

        <v-toolbar-title>Manage Teachers</v-toolbar-title>

        <template v-slot:append>

          <v-text-field

            class="mx-auto px-2 text-h6"

            v-model ="searchByName"

            style="width: 300px"

            prepend-inner-icon="mdi-magnify"

            placeholder="search"

            variant="outlined"

            hide-details

            density="comfortable"

             @input="filterByName"

          />

            <v-select
          class="mx-auto px-2 mt-5"
          v-model="selectedTeacherName"
          :items="teacherNames"
          label="Select Teacher by Name"
          placeholder="Choose a teacher"
          clearable
          variant="outlined"
          density="comfortable"
          width="280"
        />



          <!-- Add Teacher Dialog -->

          <div class="pa-4 text-center">

            <v-dialog v-model="dialog" max-width="600">

              <template v-slot:activator="{ props: activatorProps }">

                <v-btn

                  class="text-none font-weight-regular"

                  prepend-icon="mdi-account"

                  text="Add a teacher"

                  variant="tonal"

                  v-bind="activatorProps"

                ></v-btn>

              </template>

              <v-card prepend-icon="mdi-account" title="Teacher's information">

                <v-card-text>

                  <v-container>

                    <v-row>

                      <v-col cols="12">

                        <v-text-field

                          v-model="newTeacher.imageUrl"

                          label="Teacher Photo URL"

                          prepend-icon="mdi-image"

                          placeholder="https://randomuser.me/api/portraits/men/1.jpg"

                        />

                      </v-col>

                      <v-col cols="6">

                        <v-text-field

                          v-model="newTeacher.firstName"

                          label="First Name"

                          prepend-icon="mdi-account"

                        />

                      </v-col>

                      <v-col cols="6">

                        <v-text-field

                          v-model="newTeacher.lastName"

                          label="Last Name"

                          prepend-icon="mdi-account"

                        />

                      </v-col>

                      <v-col cols="12">

                        <v-text-field

                          v-model="newTeacher.email"

                          label="Email"

                          prepend-icon="mdi-email"

                          type="email"

                        />

                        </v-col>
                      <v-col cols="12">

                        <v-text-field

                          v-model="newTeacher.password"

                          label="password"

                          prepend-icon="mdi-email"

                          type="password"

                        />

                      </v-col>

                      <!-- <v-col cols="12">
                        <v-select
                        v-model="newTeacher.courses"
                        :items="coursesStore.courses"
                        item-title="title"
                        item-value="id"
                        label="Assign Courses"
                        multiple
                        chips
                        clearable
                        variant="outlined"
                      />


                      </v-col> -->

                      <v-col cols="12">

                        <v-text-field

                          v-model="newTeacher.phone"

                          label="Phone Number"

                          prepend-icon="mdi-phone"

                          placeholder="+9665xxxxxxxx"

                        />

                      </v-col>

                      <!-- <v-col cols="12">

                        <v-combobox

                          v-model="newTeacher.courses"

                          label="Courses"

                          prepend-icon="mdi-book-open"

                          multiple

                          chips

                          clearable

                          placeholder="Add courses like Algebra, Geometry..."

                        />

                      </v-col> -->

                      <v-col cols="12">

                        <v-switch

                          v-model="newTeacher.isActive"

                          label="Active Status"

                          inset

                          color="green"

                        />

                      </v-col>

                    </v-row>

                  </v-container>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>

                  <v-spacer></v-spacer>

                  <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                  <v-btn color="primary" :loading="loading" text="Add" variant="tonal" @click="AddTeacherHere"></v-btn>

                </v-card-actions>

              </v-card>

            </v-dialog>

          </div>

        </template>

      </v-toolbar>

    </v-card>



    <!-- Data Table -->

    <v-data-table

      :headers="headers"

      :items="FilterTeachers"

      class="elevation-1"

      item-value="id"

    >
       <template v-slot:item.id="{ item }">
      <span>{{ item.id }}</span>
      </template>
      <template v-slot:item.imageUrl="{ item }">

        <v-avatar size="40">

          <v-img :src="item.imageUrl" alt="Teacher photo" />

        </v-avatar>

      </template>

      <template v-slot:item.name="{ item }">

        {{ item.firstName }} {{ item.lastName }}

      </template>

   <template v-slot:item.subject="{ item }">
  <v-chip>
    {{ item.subject?.name || 'No Subject' }}
  </v-chip>
</template>


     <template v-slot:item.isActive="{ item }">
  <v-chip :color="item.isActive ? 'green' : 'red'" dark>
    {{ item.isActive ? 'Active' : 'Inactive' }}
  </v-chip>
</template>


      <template v-slot:item.actions="{ item }">

        <v-icon class="me-2" @click="openEditDialog(item)">mdi-pencil</v-icon>

        <v-icon color="red" @click="openConfirmDialog(item.id)">mdi-delete</v-icon>

        <v-icon class="ms-2" @click="viewDetails(item.id)">mdi-eye</v-icon>

      </template>

    </v-data-table>



    <!-- Edit Dialog -->

    <v-dialog v-model="confirmDialogEdit" max-width="700">

      <v-card class="pa-4">

        <v-card-title class="d-flex justify-center align-center">

          <span class="text-h5 font-weight-medium me-2">Edit Teacher</span>

          <v-icon color="black" size="24">mdi-pencil</v-icon>

        </v-card-title>

        <v-card-text>

          <v-text-field v-model="editTeacher.imageUrl" label="Photo URL" />

          <v-text-field v-model="editTeacher.firstName" label="first name" />

          <v-text-field v-model="editTeacher.email" label="Email" />

          <v-text-field v-model="editTeacher.phone" label="Phone" />


          

          <v-select
  v-model="editTeacher.isActive"
  :items="['Active', 'Inactive']"
  label="Status"
  dense
/>

        </v-card-text>

        <v-divider class="my-4"></v-divider>

        <v-card-actions>

          <v-spacer />

          <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>

          <v-btn color="primary" @click="saveEdit" :loading="savingEdit">Save</v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>



    <!-- Delete Dialog -->

    <v-dialog v-model="confirmDialog" max-width="600">

      <v-card class="pa-4">

        <v-card-title class="d-flex align-center justify-center">

          <v-icon size="36" color="red" class="me-3">mdi-delete-alert</v-icon>

          <span class="text-h5 font-weight-medium">Confirm Deletion</span>

        </v-card-title>

        <v-card-text class="text-center mt-2">

          <div class="text-body-1 mb-2">

            Are you sure you want to

            <strong style="color: #b71c1c">delete this teacher?</strong>

          </div>

          <div class="text-body-2 text-medium-emphasis">

            This action cannot be undone. Once deleted, the teacher will be permanently removed from

            the system.

          </div>

        </v-card-text>

        <v-divider class="my-4"></v-divider>

        <v-card-actions class="justify-center">

          <v-btn variant="outlined" color="grey" @click="cancelDeletion" class="px-6">

            Cancel

          </v-btn>

          <v-btn

            color="red"

            variant="tonal"

            class="px-6"

            @click="confirmDeletion"

            :loading="loading"

          >

            <v-icon start>mdi-delete</v-icon>

            Delete

          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>



    <!-- Snackbar -->

    <v-snackbar v-model="snackbar" :timeout="3500" top>

   {{ snackbarMessage  }}

      <template v-slot:action>

        <v-btn text @click="snackbar = false">OK</v-btn>

      </template>

    </v-snackbar>

  </div>

</template>

<script>

import { useTeachersStore } from '@/store/teachers'




export default {

  name: 'TeachersView',



  data() {

    return {

      dialog: false,
      loading:false,

      newTeacher: {
         id: null,   

        imageUrl: '',

        firstName: '',

        lastName: '',

        email: '',

        phone: '',

        password:'',



        isActive: true,

      },

   selectedTeacherName: null,

      confirmDialog: false,

      confirmDialogEdit: false,

      toDeleteId: null,

       snackbar: false,
      snackbarMessage: '',


      

      redTone: '#b71c1c',

      editTeacher: {

        id: null,

        imageUrl: '',

        firstName: '',

        email: '',

        phone: '',



        isActive: 'Active',

      },

      savingEdit: false,

      searchByName:'',


    }

  },



  computed: {

    teachersStore() {

      return useTeachersStore()

    },
       coursesStore() {
      return useCoursesStore()
    },
     FilterTeachers() {
    if (!this.selectedTeacherName) return this.teachersStore.teachers

    return this.teachersStore.teachers.filter(t =>
      t.fullName.includes(this.selectedTeacherName)
    )
  },

    teacherNames() {
    return this.teachersStore.teachers.map(t => t.fullName || `${t.firstName} ${t.lastName}`)
  },


   



    headers() {

      return [
          { text: 'ID', value: 'id' },
        { text: 'imageUrl', value: 'imageUrl', sortable: false },

        { text: 'Name', value: 'name' },

        { text: 'Email', value: 'email' },

        { text: 'Phone', value: 'phone' },


    { text: 'Subject', value: 'subject', sortable: false },


        { text: 'Status', value: 'status' },

        { text: 'isActive', value: 'isActive', sortable: false },


        { text: 'actions', value: 'actions', sortable: false },

      ]

    },

  },



  methods: {

    openEditDialog(teacher) {

      this.editTeacher = {

        ...teacher

      
      }

      this.confirmDialogEdit = true

    },



    cancelEdit() {

      this.confirmDialogEdit = false

      this.editTeacher = {

        id: null,

        imageUrl: '',

        firstName: '',

        email: '',

        phone: '',


   

        isActive: 'Active',

      }

    },



    async saveEdit() {
  this.savingEdit = true
  this.error = false

  try {
    const updated = {
      
      imageUrl: this.editTeacher.imageUrl,
      firstName: this.editTeacher.firstName,
      email: this.editTeacher.email,
      phone: this.editTeacher.phone,
     
      isActive: this.editTeacher.isActive,
     
    }

    console.log('📤 Saving edit:', updated)

    await this.teachersStore.updateTeacherFromApi(this.editTeacher.id, updated)

    console.log('✅ Edit saved successfully')
  } catch (error) {
    console.error('❌ Failed to save edit:', error)
    this.error = true
  } finally {
    this.savingEdit = false
    this.confirmDialogEdit = false
  }
},


    viewDetails(id) {

      this.$router.push(`/admin/teachers/${id}`)

    },



   openConfirmDialog(id) {

      this.toDeleteId = id

      this.confirmDialog = true

    }, 



    cancelDeletion() {

      this.toDeleteId = null

      this.confirmDialog = false

    },


    // first step for real delete
     async confirmDeletion() {

      if (this.toDeleteId == null) return

      this.loading = true

      try {
        // second step for real delete 
        //piniaStore.actionsApiStore(id)
       await this.teachersStore.deleteFromApi(this.toDeleteId)

        this.snackbar = true
        this.snackbarMessage = '🚯 Teacher REMOVE successfully!'

     

      } catch (error){
          console.error(' Wrong', error)

      }
      
      finally {

        this.loading = false

        this.confirmDialog = false

        this.toDeleteId = null

      }

    },
    



 async AddTeacherHere() {
  this.loading = true

  const newTeacherObj = {
    imageUrl: this.newTeacher.imageUrl,
    firstName: this.newTeacher.firstName || '',
    lastName: this.newTeacher.lastName || '',
    email: this.newTeacher.email || '',
    phone: this.newTeacher.phone || '',
    isActive: !!this.newTeacher.isActive,
    password: this.newTeacher.password,
    salaryPerSession: 50,
    subjectId: 1,
    bod: '1990-01-01T00:00:00.000Z',
    educationLevel: 'UNIVERSITY',
    universityDegree: 'Bachelor of Science in Math',
    yearsOfExperience: 5,
    gender: 'MALE',
    notes: 'New teacher added via UI',
  }

  try {
    await this.teachersStore.createTeacherFromApi(newTeacherObj)
   
    this.newTeacher = {
      imageUrl: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      isActive: true,
    }
     this.dialog = false

       this.snackbarMessage = '✅ Teacher added successfully!'
    this.snackbar = true


  } catch (error) {
    console.error('Error adding teacher:', error)
  } finally {
    this.loading = false
  }
},


    filterByName(){

      if(!this.searchByName){

        this.filteredByNameArray = this.teachersStore.teachers

        return

      }

      let nameSearch = this.searchByName.toLowerCase()



      this.filteredByNameArray = this.teachersStore.teachers.filter(teacher => teacher.firstName.toLowerCase().includes(nameSearch))

    },


  },
      mounted() {
         this.teachersStore.listTeachers()
         }

}

</script>

