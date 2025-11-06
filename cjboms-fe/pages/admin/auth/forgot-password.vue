<template>
  <div class="page page-center min-vh-100">
    <div class="container-fluid">
      <div class="text-center my-4">
        <Logo />
      </div>
    </div>

    <div class="container container-tight">
      <div class="mx-auto">
        <form @submit.prevent="sendResetLink">
          <div class="card shadow-lg br-16">
          <div class="card-body p-4 p-sm-6">
            
            <h4 class="text-h4 text-center mb-2">Forgot password</h4>
            <p class="mb-4 fs-14 text-center text-grey">
              Enter your email address and your password will be reset and
              emailed to you.
            </p>

            <div
              class="alert alert-danger"
              role="alert"
              v-if="forgot_password_form.message"
            >
              {{ forgot_password_form.message }}
            </div>
            <div
              class="alert alert-success"
              role="alert"
              v-if="forgot_password_form.message_success"
            >
              {{ forgot_password_form.message_success }}
            </div>
            <div class="form-input mb-3">
              <label class="form-label">Email address</label>
              <input
                v-model="forgot_password_form.fields.email"
                class="form-control"
                :class="[forgot_password_form.errors.email ? 'is-invalid' : '']"
                placeholder="Enter email"
                type="email"
              />
              <div
                class="invalid-feedback"
                v-if="forgot_password_form.errors.email"
              >
                {{ forgot_password_form.errors.email[0] }}
              </div>
            </div>
            <div class="form-footer">
              <button
                type="submit"
                class="btn btn-primary w-100"
                v-if="!forgot_password_form.loading"
              >
                <!-- Download SVG icon from http://tabler-icons.io/i/mail -->
                <svg
                  class="icon"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                  <rect height="14" rx="2" width="18" x="3" y="5" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
                Send me new password
              </button>
              <button class="btn btn-primary w-100" disabled v-else>
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        </form>

        <div class="text-center mt-3">
          <p class="fs-14">Back to <NuxtLink class="text-primary text-decoration-underline fw-semibold" to="login">Sign in</NuxtLink></p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  auth: "guest",
  data() {
    return {
      forgot_password_form: {
        fields: {
          email: "",
        },
        errors: [],
        message: "",
        message_success: "",
        loading: false,
      },
    };
  },
  methods: {
    async sendResetLink() {
      try {
        this.forgot_password_form.errors = [];
        this.forgot_password_form.message = "";
        this.forgot_password_form.message_success = "";
        this.forgot_password_form.loading = true;

        await this.$axios.$get("sanctum/csrf-cookie");
        let response = await this.$axios.$post(
          "forgot-password?portal=admin",
          this.forgot_password_form.fields
        );
        this.forgot_password_form.message_success = response.message;

        this.forgot_password_form.loading = false;
      } catch (error) {
        this.forgot_password_form.errors = error.response.data.errors;
        this.forgot_password_form.message = error.response.data.message;
        this.forgot_password_form.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
