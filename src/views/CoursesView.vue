<template>
  <div>
    <v-card height="75" elevation="0" class="bg-white">
      <v-toolbar extended elevation="0" class="bg-white">
        <v-toolbar-title></v-toolbar-title>

        <template v-slot:append>
          <v-text-field
            class="mx-auto px-2 text-h6"
            style="width: 300px"
            v-model="searchText"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by Title or Teacher"
            variant="outlined"
            hide-details
            density="comfortable"
          />

          <v-select
            class="mx-auto px-2 mt-5"
            width="300px"
            v-model="selectedStatus"
            :items="statusOptions"
            label="Course Status"
            placeholder="Select a status"
            clearable
            variant="outlined"
            density="comfortable"
          />

       <div class="pa-4 text-center">
  <v-dialog v-model="dialog" max-width="700">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="text-none font-weight-regular"
        prepend-icon="mdi-book"
        text
        variant="tonal"
        v-bind="activatorProps"
      >
        Add a Course
      </v-btn>
    </template>

    <v-card prepend-icon="mdi-book-plus" title="New Course Schedule">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="newCourse.title"
                label="Course Title"
                prepend-icon="mdi-format-title"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCourse.startDate"
                label="Start Date"
                prepend-icon="mdi-calendar"
                type="date"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCourse.endDate"
                label="End Date"
                prepend-icon="mdi-calendar-check"
                type="date"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCourse.startTime"
                label="Start Time"
                prepend-icon="mdi-clock-start"
                type="time"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCourse.endTime"
                label="End Time"
                prepend-icon="mdi-clock-end"
                type="time"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="newCourse.days"
                label="Days (e.g. Monday,Wednesday,Friday)"
                prepend-icon="mdi-calendar-range"
                hint="Separate days with a comma (e.g., Monday,Wednesday,Friday)"
              />
            </v-col>

            <v-col cols="12" md="6">
          <v-select
            v-model="newCourse.classRoomId"
            :items="classesStore.classes"
            item-title="title"
            item-value="id"
            label="Select ClassRoom"
            prepend-icon="mdi-chair-school"
/>

            </v-col>
            <v-col cols="12" md="6">
             <v-select
              v-model="newCourse.teacherId"
              :items="teachersStore.teachers"
              item-title="firstName"
              item-value="id"
              label="Select Teacher"
              prepend-icon="mdi-account-tie"
            />
            </v-col>

            <v-col cols="12">
          <v-select
            v-model="newCourse.studentIds"
            :items="studentsStore.students"
            item-title="fullName"
            item-value="id"
            label="Select Students"
            prepend-icon="mdi-account-multiple"
            multiple
          />

            </v-col>

           

          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text variant="plain" @click="dialog = false">Close</v-btn>
        <v-btn color="primary" text variant="tonal" @click="AddCourseHere">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>


        </template>
      </v-toolbar>
    </v-card>

  <v-data-table
  :headers="headers"
  :items="coursesStore.courses"
  class="v-data-table-custom"
  density="comfortable"
  hover
>
  <template #top>
    <v-toolbar flat>
      <v-toolbar-title class="text-h5 font-weight-bold">Course Management</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  </template>

  <template v-slot:item.title="{ item }">
    <div class="text-start font-weight-bold text-blue-darken-3">{{ item.title }}</div>
  </template>

  <template v-slot:item.startDate="{ item }">
    <div class="text-caption text-grey-darken-1">
      {{ new Date(item.startDate).toISOString() }}
    </div>
  </template>

  <template v-slot:item.endDate="{ item }">
    <div class="text-caption text-grey-darken-1">
      {{ new Date(item.endDate).toISOString() }}
    </div>
  </template>

  <template v-slot:item.days="{ item }">
    <div class="text-start text-caption font-weight-medium">
      {{ item.days?.length ? item.days.join(', ') : '—' }}
    </div>
  </template>

  <template v-slot:item.time="{ item }">
    <div class="text-center text-body-2 font-weight-bold">
      {{ new Date(`1970-01-01T${item.startTime}`).toISOString() }} -
      {{ new Date(`1970-01-01T${item.endTime}`).toISOString() }}
    </div>
  </template>

  <template v-slot:item.teacherId="{ item }">
    <div class="text-start text-body-2 text-grey-darken-1">
      Teacher ID: {{ item.teacherId }}
    </div>
  </template>

  <template v-slot:item.classRoomId="{ item }">
    <div class="text-start text-body-2 text-grey-darken-1">
      Room ID: {{ item.classRoomId }}
    </div>
  </template>

  <template v-slot:item.studentIds="{ item }">
    <div class="text-start text-caption text-grey-darken-1">
      {{ item.studentIds?.length || 0 }} students
    </div>
  </template>

  <template v-slot:item.actions="{ item }">
    <template v-if="role === 'ORGANIZATION'">
      <v-tooltip text="Edit Course" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="blue-grey-lighten-1"
                 v-bind="props" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Course" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="red-darken-1"
                 v-bind="props" @click="openConfirmDialog(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Details Course" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="green-darken-1"
                 v-bind="props" @click="ViewDetails(item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <template v-else-if="role === 'TEACHER'">
      <v-tooltip text="Edit Disabled" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="blue-grey-lighten-1"
                 v-bind="props" disabled>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Delete Disabled" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="red-darken-1"
                 v-bind="props" disabled>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Details Course" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" color="green-darken-1"
                 v-bind="props" @click="ViewDetails(item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

     
    </template>
  </template>
</v-data-table>



    <v-dialog v-model="confirmDialog" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="d-flex justify-center align-center">
          <v-icon size="36" color="red" class="me-3">mdi-delete-alert</v-icon>
          <span class="text-h5 font-weight-medium">Confirm Deletion</span>
        </v-card-title>
        <v-card-text class="text-center mt-2">
          <div class="text-body-1 mb-2">
            Are you sure you want to
            <strong style="color: #b71c1c">delete this course?</strong>
          </div>
          <div class="text-body-2 text-medium-emphasis">
            This action cannot be undone. Once deleted, the course will be permanently removed from
            the system.
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <v-btn variant="outlined" color="grey" @click="cancelDeletion" class="px-6">
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="tonal"
            class="px-6"
            @click="confirmDeletion"
          >
            <v-icon start>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

   <v-dialog v-model="confirmDialogEdit" max-width="700">
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-center align-center">
      <span class="text-h5 font-weight-medium me-2">Edit Course Schedule</span>
      <v-icon color="black" size="24">mdi-pencil</v-icon>
    </v-card-title>

    <v-card-text>
      <v-text-field v-model="editCourse.title" label="Title" />
      <v-text-field v-model="editCourse.startDate" label="Start Date" type="date" />
      <v-text-field v-model="editCourse.endDate" label="End Date" type="date" />
      <v-text-field v-model="editCourse.startTime" label="Start Time" type="time" />
      <v-text-field v-model="editCourse.endTime" label="End Time" type="time" />
     <v-select
  v-model="editCourse.days"
  :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
  label="Select Days"
  multiple
  prepend-icon="mdi-calendar-range"
/>

      <v-select
        v-model="editCourse.teacherId"
        :items="teachersStore.teachers"
        item-title="fullName"
        item-value="id"
        label="Select Teacher"
        prepend-icon="mdi-account-tie"
      />

      <v-select
        v-model="editCourse.classRoomId"
        :items="classesStore.classes"
        item-title="title"
        item-value="id"
        label="Select ClassRoom"
        prepend-icon="mdi-chair-school"
      />

      <v-select
        v-model="editCourse.studentIds"
        :items="studentsStore.students"
        item-title="fullName"
        item-value="id"
        label="Select Students"
        prepend-icon="mdi-account-multiple"
        multiple
      />
    </v-card-text>

    <v-divider class="my-4"></v-divider>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="outlined" @click="cancelEdit">Cancel</v-btn>
      <v-btn color="primary" @click="saveEdit">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  </div>
</template>

<script>
import { useCoursesStore } from '@/store/courses' 
import { useClassStore } from '@/store/classes'
import { useStudentsStore } from '@/store/students'
import { useTeachersStore } from '@/store/teachers'



export default {
  data() {
    return {
       role: localStorage.getItem('role') || '',

     


      dialog: false,
      confirmDialogEdit: false,
      confirmDialog: false,
      toDeleteId: null,
      searchText: '',
      
      selectedStatus: null,
      statusOptions: ['Active', 'Inactive'],

    newCourse: {
  title: '',
  startDate: '',       
  endDate: '',          
  days: '',             
  startTime: '',       
  endTime: '',       
  teacherId: null,      
  classRoomId: null,   
  studentIds: []        
},

editCourse: {
  id: null,               
  title: '',             
  startDate: '',         
  endDate: '',          
  days: [],               
  startTime: '',          
  endTime: '',            
  teacherId: null,        
  classRoomId: null,      
  studentIds: []          
},


      loading: false 
    }
  },

  computed: {
    coursesStore() {
      return useCoursesStore()
    },
    teachersStore() {
    return useTeachersStore()
  },
  studentsStore() {
    return useStudentsStore()
  },
  classesStore() {
    return useClassStore()
  },
  

   

 headers() {
  return [
    { title: 'Title', value: 'title', align: 'start' },
    { title: 'Start Date', value: 'startDate', align: 'start' },
    { title: 'End Date', value: 'endDate', align: 'start' },
    { title: 'Days', value: 'days', align: 'start' },
    { title: 'Start Time', value: 'startTime', align: 'center' },
    { title: 'End Time', value: 'endTime', align: 'center' },
    { title: 'Teacher ID', value: 'teacherId', align: 'center' },
    { title: 'ClassRoom ID', value: 'classRoomId', align: 'center' },
    { title: 'Students', value: 'studentIds', align: 'start' },
  { title: 'Actions', value: 'actions', align: 'start', sortable: false }

  ]
}



  },

 methods: {


  
   ViewDetails(id) {

      this.$router.push(`/admin/courses/${id}`)

    },


 async AddCourseHere() {
  this.loading = true

  const daysArray = this.newCourse.days
    ? this.newCourse.days.split(',').map(d => d.trim()).filter(d => d)
    : []

  const newCourseObj = {
    title: this.newCourse.title || 'New Course',

    startDate: this.newCourse.startDate
      ? new Date(this.newCourse.startDate).toISOString()
      : new Date().toISOString(),

    endDate: this.newCourse.endDate
      ? new Date(this.newCourse.endDate).toISOString()
      : new Date().toISOString(),

    startTime: this.newCourse.startTime || '00:00',
    endTime: this.newCourse.endTime || '00:00',

    days: daysArray,

    teacherId: this.newCourse.teacherId ?? undefined,
    classRoomId: this.newCourse.classRoomId ?? undefined,

   studentIds : this.newCourse.studentIds
  }

  try {
    await this.coursesStore.createCourseFromApi(newCourseObj)

    this.newCourse = {
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      days: '',
      teacherId: null,
      classRoomId: null,
      studentIds: []
    }

    this.dialog = false
  } catch (error) {
    console.error('❌ Error adding course:', error)
  } finally {
    this.loading = false
  }
},


  openConfirmDialog(id) {
    this.toDeleteId = id
    this.confirmDialog = true
  },

  cancelDeletion() {
    this.confirmDialog = false
  },

  async confirmDeletion() {
    if (this.toDeleteId == null) return
    this.loading = true
    try {
      await this.coursesStore.deleteFromApi(this.toDeleteId)
    } finally {
      this.loading = false
      this.confirmDialog = false
      this.toDeleteId = null
    }
  },

 openEditDialog(course) {
  this.confirmDialogEdit = true

  this.editCourse = {
    id: course.id, 
    title: course.title || '',
    startDate: course.startDate || '',
    endDate: course.endDate || '',
    startTime: course.startTime || '',
    endTime: course.endTime || '',
    days: Array.isArray(course.days) ? [...course.days] : [],

    teacherId: course.teacherId ?? null,
    classRoomId: course.classRoomId ?? null,
    studentIds: Array.isArray(course.studentIds)
      ? [...course.studentIds]
      : []
  }
},


  cancelEdit() {
    this.confirmDialogEdit = false
  },

 async saveEdit() {
  this.savingEdit = true

  try {
    const update = {
      title: this.editCourse.title || 'Updated Course',

      startDate: this.editCourse.startDate || new Date().toISOString(),
      endDate: this.editCourse.endDate || new Date().toISOString(),

      startTime: this.editCourse.startTime || '00:00',
      endTime: this.editCourse.endTime || '00:00',

     days: this.editCourse.days,


      teacherId: this.editCourse.teacherId ?? undefined,
      classRoomId: this.editCourse.classRoomId ?? undefined,

      studentIds: Array.isArray(this.editCourse.studentIds)
        ? this.editCourse.studentIds.map(id => Number(id))
        : []
    }

    await this.coursesStore.updateCourseFromApi(this.editCourse.id, update)

    this.confirmDialogEdit = false
  } catch (error) {
    console.error(' Failed to save edit:', error)
    this.error = true
  } finally {
    this.savingEdit = false
  }
}

},

mounted() {
  const role = localStorage.getItem('role')
  console.log('Current role:', role)

  if (role === 'ORGANIZATION') {
    this.coursesStore.listCourses()
    this.studentsStore.listStudents()
    this.teachersStore.listTeachers()
    this.classesStore.listClasses()
  } else if (role === 'TEACHER') {
    this.coursesStore.listTeacherCourses()
  }
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