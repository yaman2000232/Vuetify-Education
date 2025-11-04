<template>
 <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">My Courses</h2>

    <v-data-table
      :headers="headers"
      :items="teachStore.courses"
      :loading="teachStore.loading"
      loading-text="loading this course"
      class="elevation-1"
    >
  <template v-slot:item.studentCount="{ item }">
  <div class="text-start text-caption text-grey-darken-1">
    {{ item.studentCount }} students
  </div>
</template>


      <template #item.actions="{ item }">
        <v-btn color="primary" @click="goToCourseDetails(item.id)">
         Details
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
    

</template>

<script>
import { useTeachStore } from '@/store/teach'


export default{
data() {
  return {
    loading: true,
   headers: [
  { title: 'Course Title', key: 'title' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Students Count', key: 'studentCount' }, 
  { title: 'Actions', key: 'actions', sortable: false },
]

  }
},

computed:{
    teachStore(){
        return useTeachStore()
    }


},

methods: {
  goToCourseDetails(course) {
    this.teachStore.selectedCourse = course
    this.$router.push(`/admin/my-courses/${course.id}`)
  }
},


mounted(){
    this.teachStore.fetchCourse()
}


}


</script>