<<template>
  <v-container>
    <div v-if="role === 'ORGANIZATION'">
      <v-app-bar color="white" elevation="2" class="mt-5">
    <v-toolbar-title class="text-h5 font-weight-bold">
    {{ $t('dash') }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-bell-outline</v-icon>
    </v-btn>

    <v-btn icon to="/admin/settings">
      <v-icon>mdi-cog-outline</v-icon>
    </v-btn>

    <v-btn to="/login" color="grey-dark-1" variant="tonal" class="ml-2">
      {{ $t('login') }}
    </v-btn>
  </v-app-bar>


   <v-container fluid>
    <v-row>
      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="indigo-lighten-5">
          <div class="text-h6">👨‍🎓 {{ $t('students') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.students }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="green-lighten-5">
          <div class="text-h6">👨‍🏫  {{ $t('teachers') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.teachers }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="blue-lighten-5">
          <div class="text-h6">🏫  {{ $t('classes') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.classes }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="purple-lighten-5">
          <div class="text-h6">📚 {{ $t('courses') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.courses }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="red-lighten-5">
          <div class="text-h6">🚌  {{ $t('buses') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.buses }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card class="pa-4 text-center" elevation="2" color="red-lighten-5">
          <div class="text-h6">
            ✅ {{ $t('attendance') }}</div>
          <div class="text-h4 font-weight-bold">{{ stats.attendance }}</div>
        </v-card>
      </v-col>
    </v-row>

   <v-row>
  <v-col cols="12" md="8">
    <v-card elevation="3" rounded="lg" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold text-blue-darken-3">
       {{ $t('recentStudents') }}
      </v-card-title>
      <v-data-table
        :headers="studentHeaders"
        :items="recentStudents"
        density="compact"
        class="text-body-2 font-weight-bold"
        hide-default-footer
      />
    </v-card>
  </v-col>

  <v-row></v-row>
  <v-col cols="12" md="4">
    <v-card elevation="3" rounded="lg" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold text-green-darken-3">
        {{ $t('recentCourses') }}
      </v-card-title>
      <v-data-table
        :headers="courseHeaders"
        :items="recentCourses"
        density="compact"
        class="text-body-2 font-weight-bold"
        hide-default-footer
      />
    </v-card>
  </v-col>
</v-row>

<v-row>

   <v-col cols="12" md="4">
    <v-card elevation="3" rounded="lg" class="pa-4">
      <v-card-title class="text-h6 font-weight-bold text-indigo-darken-3">
        Students Growth
      </v-card-title>
      <apexchart
        type="line"
        height="250"
        :options="chartOptions"
        :series="series"
      />
    </v-card>
  </v-col>

  <v-col cols="12" md="4">
  <v-card elevation="3" rounded="lg" class="pa-6 text-center">
    <v-card-title class="text-h6 font-weight-bold text-purple-darken-3">
      Students by Gender
    </v-card-title>
    <apexchart
      type="pie"
      height="250"
      :options="pieOptions"
      :series="pieSeries"
    />
  </v-card>
</v-col>

<v-col cols="12" md="4">
  <v-card elevation="3" rounded="lg" class="pa-4">
    <v-card-title class="text-h6 font-weight-bold text-teal-darken-3">
      Courses Enrollment
    </v-card-title>
    <apexchart
      type="bar"
      height="250"
      :options="barOptions"
      :series="barSeries"
    />
  </v-card>
</v-col>


  </v-row>

  </v-container>



      
    </div>
    <div v-else-if="role === 'TEACHER'">
    aaa
    </div>
  </v-container>
</template>

<script>
  import VueApexCharts from "vue3-apexcharts"
export default {
   components: {
    apexchart: VueApexCharts,
  },
  name: "DashboardCards",
  data() {
    return {
      role: localStorage.getItem('role'),
      stats: {
        students: 120,
        teachers: 25,
        classes: 10,
        courses: 15,
        buses: 5,
        attendance:'95%'
      },
        studentHeaders: [
        { title: "ID", key: "id" },
        { title: "Name", key: "name" },
        { title: "Gender", key: "gender" },
      ],
      recentStudents: [
        { id: 1, name: "Ahmed Ali", gender: "MALE" },
        { id: 2, name: "Sara Noor", gender: "FEMALE" },
        { id: 3, name: "Omar Khaled", gender: "MALE" },
        { id: 4, name: "Lina Hassan", gender: "FEMALE" },
        { id: 5, name: "Yousef Ahmad", gender: "MALE" },
      ],
      courseHeaders: [
        { title: "ID", key: "id" },
        { title: "Course Name", key: "name" },
      ],
      recentCourses: [
        { id: 101, name: "Math 101" },
        { id: 102, name: "Physics 201" },
        { id: 103, name: "TECH 301" },
        { id: 104, name: "Sports 401" },
        { id: 105, name: "Electr 201" },
    ],
     

        series: [
        {
          name: "Students",
          data: [120, 135, 150, 160, 175, 190, 210],
        },
      ],
      chartOptions: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
        stroke: { curve: "smooth" },
        colors: ["#3f51b5"],
      },

         pieSeries: [60, 40], 
      pieOptions: {
        labels: ["Male", "Female"],
        colors: ["#3f51b5", "#e91e63"],
        legend: {
          position: "bottom",
        },
      },
        barSeries: [
        {
          name: "Students",
          data: [120, 90, 70, 50], 
        },
      ],
      barOptions: {
        chart: { toolbar: { show: false } },
        xaxis: {
          categories: ["Math", "Physics", "Chemistry", "Biology"],
        },
        colors: ["#009688"],
        plotOptions: {
          bar: {
            borderRadius: 6,
            columnWidth: "40%",
          },
        },
      },
    }
  } 
}
</script>

