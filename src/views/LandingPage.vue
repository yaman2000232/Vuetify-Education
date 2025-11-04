<template>
  <v-app>
    <v-app-bar app color="dark_primary" dark>
      <v-toolbar-title class="font-weight-bold text-h5">
        <v-icon left color="gold">mdi-school</v-icon>
        <span class="d-none d-sm-inline">Elite Academy</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text class="hidden-sm-and-down mx-1 white--text">Home</v-btn>
      <v-btn text class="hidden-sm-and-down mx-1 white--text">Programs</v-btn>
      <v-btn text class="hidden-sm-and-down mx-1 white--text">About Us</v-btn>
      <v-btn text class="hidden-sm-and-down mx-1 white--text">Contact</v-btn>
      <v-btn to="/login" color="gold" class="ml-4 dark_primary--text font-weight-bold">
       Login
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <section id="hero">
        <v-container fluid class="pa-0">
          <v-row no-gutters>
            <v-col cols="12">
              <div
                class="hero-background"
                :style="{ backgroundImage: `url(${heroImage})` }"
              >
                <v-container class="fill-height">
                  <v-row
                    align="center"
                    justify="start"
                    class="hero-content"
                  >
                    <v-col cols="12" md="7">
                      <h1 class="text-h3 text-grey-lighten-3 text-md-h2 white--text font-weight-black mb-4">
                        Shape Your Future with <br class="hidden-sm-and-down" />
                        <span class="gold--text">World-Class Education</span>
                      </h1>
                      <p class="text-h6 text-grey text-lg-h5 mb-6">
                        Leading the way in professional and academic development. Join our global community.
                      </p>
                      <v-btn
                        x-large
                        color="gold"
                        class="mr-4 font-weight-bold text-uppercase dark_primary--text"
                      >
                        Explore Programs
                      </v-btn>
                      <v-btn
                        x-large
                        outlined
                        dark
                        class="font-weight-bold text-uppercase white--text"
                      >
                        Request Info
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CORE VALUES -->
      <section id="core-values" class="py-12 light_gray">
        <v-container>
          <h2 class="text-h4 text-md-h3 text-center mb-10 dark_primary--text font-weight-bold">
            Our Core Pillars
          </h2>
          <v-row>
            <v-col cols="12" md="4" v-for="(value, i) in coreValues" :key="i">
              <v-card class="pa-6 text-center elevation-6 hover-effect">
                <v-icon
                  size="64"
                  class="mb-4 gold--text"
                >{{ value.icon }}</v-icon>
                <h3 class="text-h5 dark_primary--text mb-3 font-weight-bold">
                  {{ value.title }}
                </h3>
                <p class="text-body-1 dark_gray--text">
                  {{ value.description }}
                </p>
                <v-btn text color="gold" class="mt-3">
                  Learn More
                  <v-icon right>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- PROGRAM OVERVIEW -->
      <section id="program-overview" class="py-12">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6">
              <h2 class="text-h4 text-md-h3 mb-6 font-weight-bold dark_primary--text">
                Innovative Learning Experience
              </h2>
              <p class="text-body-1 dark_gray--text mb-6">
                Our curriculum is designed to be future-proof, blending theoretical knowledge with practical, hands-on experience. We utilize cutting-edge technology and small class sizes to ensure personalized attention and maximum engagement.
              </p>
              <ul class="mb-6">
                <li class="text-body-1 mb-2">
                  <v-icon color="gold" left>mdi-check-circle</v-icon>
                  Industry-led faculty and mentors
                </li>
                <li class="text-body-1 mb-2">
                  <v-icon color="gold" left>mdi-check-circle</v-icon>
                  Flexible study options (online & on-campus)
                </li>
                <li class="text-body-1 mb-2">
                  <v-icon color="gold" left>mdi-check-circle</v-icon>
                  Strong global alumni network
                </li>
              </ul>
              <v-btn large color="dark_primary" dark class="mt-4">
                View All Courses
                <v-icon right>mdi-book-open-variant</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-card elevation="10" class="rounded-lg">
                <v-img :src="sectionImagePlaceholder" height="400px" cover></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- POPULAR COURSES -->
      <section id="popular-courses" class="py-12 dark_primary">
        <v-container>
          <h2 class="text-h4 text-md-h3 text-center mb-10 white--text font-weight-bold">
            Popular Educational Tracks
          </h2>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              lg="4"
              v-for="(course, i) in popularCourses"
              :key="i"
            >
              <v-card
                class="pa-4 text-center mx-auto elevation-8 hover-effect d-flex flex-column"
                height="100%"
              >
                <v-icon size="48" color="gold" class="mb-3">{{ course.icon }}</v-icon>
                <h3 class="text-h6 dark_primary--text mb-2 font-weight-bold">
                  {{ course.title }}
                </h3>
                <p class="text-body-2 dark_gray--text flex-grow-1">
                  {{ course.description }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn color="dark_primary" dark block>
                  Details
                  <v-icon right>mdi-arrow-right-circle</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-center mt-10">
            <v-btn x-large color="white" class="dark_primary--text font-weight-bold">
              View All 25+ Programs
              <v-icon right>mdi-format-list-bulleted</v-icon>
            </v-btn>
          </div>
        </v-container>
      </section>

      <!-- CONTACT FORM -->
      <section id="contact-form" class="py-12 dark_primary_lighten_1">
        <v-container>
          <h2 class="text-h4 text-md-h3 text-center mb-8 white--text font-weight-bold">
            Ready to Start? Get in Touch!
          </h2>
          <v-row justify="center">
            <v-col cols="12" md="6">
              <v-card class="pa-6 pa-md-8 elevation-12">
                <v-form ref="form" lazy-validation>
                  <v-text-field
                    label="Full Name"
                    outlined
                    dense
                    required
                    prepend-inner-icon="mdi-account"
                    color="gold"
                    dark
                  ></v-text-field>
                  <v-text-field
                    label="Email Address"
                    outlined
                    dense
                    required
                    prepend-inner-icon="mdi-email"
                    color="gold"
                    dark
                  ></v-text-field>
                  <v-select
                    :items="['Undergraduate', 'Graduate', 'Professional Training']"
                    label="Intended Program Level"
                    outlined
                    dense
                    required
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    color="gold"
                    dark
                  ></v-select>
                  <v-textarea
                    label="Your Message (Optional)"
                    outlined
                    rows="3"
                    prepend-inner-icon="mdi-message-text"
                    color="gold"
                    dark
                  ></v-textarea>
                  <v-btn color="gold" large block class="mt-4 font-weight-bold dark_primary--text">
                    Submit Inquiry
                    <v-icon right>mdi-send</v-icon>
                  </v-btn>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- FOOTER -->
      <v-footer color="dark_primary" dark padless>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="py-4">
              <h3 class="text-h5 mb-3 font-weight-bold">Elite Academy</h3>
              <p class="text-body-2 white--text">
                Committed to excellence in education and professional development.
                <br/>
                &copy; {{ new Date().getFullYear() }} All rights reserved.
              </p>
              <v-btn icon dark class="mr-2"><v-icon color="gold">mdi-facebook</v-icon></v-btn>
              <v-btn icon dark class="mr-2"><v-icon color="gold">mdi-twitter</v-icon></v-btn>
              <v-btn icon dark class="mr-2"><v-icon color="gold">mdi-linkedin</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import s1 from '@/assets/images/s1.jpg';
import s2 from '@/assets/images/s2.jpg';
import s3 from '@/assets/images/s3.jpg';

export default {
  name: 'EducationLandingPageGold',
  data() {
    return {
      heroImage: s3,
      sectionImagePlaceholder: s2,
      avatarPlaceholder: s1,
      coreValues: [
        { icon: 'mdi-lightbulb-on-outline', title: 'Innovation', description: 'Embracing modern methodologies and future-focused thinking in all our programs.' },
        { icon: 'mdi-account-group-outline', title: 'Community', description: 'Fostering a supportive and diverse global network of students, faculty, and alumni.' },
        { icon: 'mdi-certificate-outline', title: 'Excellence', description: 'Committing to the highest standards of academic rigor and professional development.' },
      ],
      popularCourses: [
        { icon: 'mdi-code-braces', title: 'Software Development', description: 'Master the full-stack: from front-end design to robust back-end systems.' },
        { icon: 'mdi-chart-bar', title: 'Business Analytics', description: 'Harness the power of data to drive strategic decisions and business growth.' },
        { icon: 'mdi-palette-swatch', title: 'Digital Marketing', description: 'Learn SEO, social media, and content strategy from industry leaders.' },
        { icon: 'mdi-brain', title: 'Artificial Intelligence', description: 'Dive deep into machine learning, neural networks, and deep learning models.' },
        { icon: 'mdi-earth', title: 'Global Relations', description: 'Analyze international politics, economics, and cross-cultural communication.' },
        { icon: 'mdi-security', title: 'Cyber Security', description: 'Protect digital assets and learn threat detection and ethical hacking.' },
      ],
    };
  }
};
</script>

<style scoped>
.hero-background {
  height: 80vh;
  min-height: 500px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: rgba(0,0,0,0.8);
  background-blend-mode: multiply;
}
.hover-effect {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.25) !important;
}
ul { list-style: none; padding-left: 0; }
</style>
