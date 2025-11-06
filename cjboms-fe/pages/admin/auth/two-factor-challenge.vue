<template>
  <div class="page page-center min-vh-100">
    <div class="container-fluid">
      <div class="text-center my-4">
        <Logo />
      </div>
    </div>

    <div class="container container-tight">
      <div class="mx-auto">
        <form
          class=""
          autocomplete="off"
          @submit.prevent="submitRecoveryChallenge"
        >
          <div class="card shadow-lg br-16">
            <div class="card-body p-4 p-sm-6">
              <h4 class="text-h4 text-center mb-4">Two Factor Challenge</h4>

              <div class="login-wrapper mt-6">
                <div class="form-input mb-3">
                  <label class="form-label">Code</label>
                  <input
                    v-model="challenge_two_factor_form.fields.code"
                    type="code"
                    class="form-control"
                    :class="[
                      challenge_two_factor_form.errors.code ? 'is-invalid' : '',
                    ]"
                    placeholder="Enter code"
                    autocomplete="off"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="challenge_two_factor_form.errors.code"
                  >
                    {{ challenge_two_factor_form.errors.code[0] }}
                  </div>
                </div>
                <div class="form-footer">
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    v-if="!challenge_two_factor_form.loading"
                  >
                    Submit
                  </button>
                  <button class="btn btn-primary w-100" disabled v-else>
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="text-center text-muted mt-3">
        <p class="fs-14">
          Use your
          <NuxtLink
            class="text-primary text-decoration-underline fw-semibold"
            tabindex="-1"
            to="two-factor-challenge-recovery"
            >recovery code</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  auth: "guest",
  head() {
    return {
      bodyAttrs: {
        class: " d-flex flex-column",
      },
    };
  },
  data() {
    return {
      challenge_two_factor_form: {
        fields: {},
        errors: [],
        message: "",
        loading: false,
      },
      show_password: false,
    };
  },
  methods: {
    async submitRecoveryChallenge() {
      try {
        this.loading = true;
        await this.$axios.$get("sanctum/csrf-cookie");
        await this.$axios.$post(
          "two-factor-challenge?portal=admin",
          this.challenge_two_factor_form.fields
        );
        await this.$auth.fetchUser();

        this.$router.replace({ name: "index" });
      } catch (error) {
        this.challenge_two_factor_form.errors = error.response.data.errors;
        this.challenge_two_factor_form.message = error.response.data.message;
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
