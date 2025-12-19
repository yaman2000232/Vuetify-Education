<template>
  <v-container class="fill-height register-container" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" class="pa-4">
          <v-card-title class="text-h5 text-center">
            Create Account
          </v-card-title>

          <v-card-text>
            <v-form ref="form" @submit.prevent="handleRegister" v-model="isValid">

              <!-- Organization Name -->
              <v-text-field
                v-model="name"
                label="Organization Name"
                prepend-inner-icon="mdi-account"
                :rules="[rules.required]"
                required
              />

              <!-- Email -->
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                :rules="[rules.required, rules.email]"
                required
              />

              <!-- Phone -->
              <v-text-field
                v-model="phone"
                label="Phone Number"
                prepend-inner-icon="mdi-phone"
                type="tel"
                :rules="[rules.required]"
                required
              />

              <!-- Password -->
              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                type="password"
                :rules="[rules.required, rules.minPass]"
                required
              />

              <!-- Confirm Password -->
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                :rules="[rules.required, matchPassword]"
                required
              />

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                block
                class="mt-4"
                :disabled="loading"
              >
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  size="18"
                  class="mr-2"
                />
                Register
              </v-btn>

              <!-- Already have account -->
              <div class="text-center mt-4">
                <v-btn variant="text" @click="goToLogin">
                  Already have an account? Login
                </v-btn>
              </div>

            </v-form>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/auth";

export default {
  name: "RegisterView",

  data() {
    return {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      loading: false,
      isValid: false,

      rules: {
        required: (v) => !!v || "This field is required",
        email: (v) => /.+@.+\..+/.test(v) || "Email must be valid",
        minPass: (v) => v.length >= 8 || "Password must be at least 8 characters",
      },
    };
  },

  methods: {
    matchPassword(v) {
      return v === this.password || "Passwords do not match";
    },

    async handleRegister() {
      const form = this.$refs.form;

      if (!(await form.validate())) return;

      this.loading = true;
      const authStore = useAuthStore();

      try {
        await authStore.register(this.name, this.email, this.password);

        this.loading = false;

        Swal.fire({
          icon: "success",
          title: "Account Created Successfully",
          text: "You can now log in.",
          confirmButtonColor: "#1976D2",
        });

        this.$router.push("/login");
      } catch (error) {
        this.loading = false;

        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: error.message || "Something went wrong",
          confirmButtonColor: "#d33",
        });
      }
    },

    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.fill-height {
  min-height: 100vh;
}
</style>
