<template>
  <div class="page page-center min-vh-100">
    <div class="container-fluid">
      <div class="text-center my-4">
        <Logo/>
      </div>
    </div>
    <div class="container container-tight">
      <div class="mx-auto">
        <form autocomplete="off" @submit.p.prevent="confirmPassword">
          <div class="card shadow-lg br-16">
            <div class="card-body p-4 p-sm-6">
              <h5 class="text-h4 text-center mb-5">Enter your password to continue</h5>
              <div class="form-input mb-2">
                <label class="form-label"> Password </label>
                <div class="input-icon input-icon__right">
                  <input v-model="confirm_password_form.fields.password"
                         :class="[confirm_password_form.errors.password ? 'is-invalid' : '',]"
                         :type="show_password ? 'text' : 'password'" autocomplete="off"
                         class="form-control" placeholder="Password"
                  />
                  <span class="input-icon-addon mb-2 pe-auto">
                      <a class="link-secondary" data-bs-toggle="tooltip" href="#" title="Show password"
                         @click.prevent="passwordVisibilityToggle"><!-- Download SVG icon from http://tabler-icons.io/i/eye -->
                        <svg v-if="!show_password" class="icon" fill="none" height="24" stroke="currentColor"
                             stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                             width="24"
                             xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
                          <circle cx="12" cy="12" r="2"/>
                          <path
                            d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                          />
                        </svg>
                        <svg v-else class="icon icon-tabler icon-tabler-eye-off" fill="none" height="24"
                             stroke="currentColor"
                             stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                             width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                          <line x1="3" x2="21" y1="3" y2="21"></line>
                          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                          <path
                            d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                          ></path>
                        </svg>
                      </a>
                    </span>
                </div>
                <div v-if="confirm_password_form.errors.password" class="invalid-feedback">
                  {{ confirm_password_form.errors.password[0] }}
                </div>
              </div>
              <div class="form-footer">
                <button v-if="!confirm_password_form.loading" class="btn btn-primary w-100" type="submit">
                  Confirm Password
                </button>
                <button v-else class="btn btn-primary w-100" disabled>
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  head() {
    return {
      bodyAttrs: {
        class: " d-flex flex-column",
      },
    };
  },
  data() {
    return {
      confirm_password_form: {
        fields: {},
        errors: [],
        error_message: "",
        loading: false,
      },
      show_password: false,
    };
  },
  methods: {
    async confirmPassword() {
      try {
        this.loading = true;
        await this.$axios.$get("sanctum/csrf-cookie");
        await this.$axios.post(
          "user/confirm-password?portal=admin",
          this.confirm_password_form.fields
        );
        await this.$router.replace({
          name: this.$route.query.return || "admin-profile-general",
        });
      } catch (error) {
        this.confirm_password_form.errors = error.response.data.errors;
        this.confirm_password_form.error_message = error.response.data.message;
        this.loading = false;
      }
    },
    passwordVisibilityToggle() {
      this.show_password = !this.show_password;
    },
  },
};
</script>

<style scoped></style>
