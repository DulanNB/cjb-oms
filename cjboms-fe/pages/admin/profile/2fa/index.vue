<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card br-8 overflow-hidden">
        <div class="card-header px-3">
          <div class="mb-md-0">
            <h6 class="fs-18 mb-0">2FA Authentication</h6>
          </div>
        </div>

        <template v-if="!$auth.user.two_factor_confirmed_at">
          <form @submit.prevent="enable2FA">
            <button class="btn btn-primary m-2" type="submit">
              Enable 2FA
            </button>
          </form>

          <div class="px-2 mt-4">
            <div v-if="qrCode" v-html="qrCode"></div>
            <form class="my-3" v-if="qrCode" @submit.prevent="confirm2FA">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-input mb-3">
                    <label
                      :class="[
                        confirm_2fa_form.errors.code ? 'text-danger' : '',
                      ]"
                      class="form-label"
                      >Enter OTP</label
                    >
                    <input
                      v-model="confirm_2fa_form.fields.code"
                      :class="[
                        confirm_2fa_form.errors.code ? 'is-invalid' : '',
                      ]"
                      autocomplete="off"
                      class="form-control"
                      placeholder="OTP Code"
                      type="text"
                    />
                    <div
                      v-if="confirm_2fa_form.errors.code"
                      class="invalid-feedback"
                    >
                      {{ confirm_2fa_form.errors.code[0] }}
                    </div>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary" type="submit">
                Confirm Code
              </button>
            </form>
          </div>
        </template>

        <form class="my-3" @submit.prevent="disable2FA" v-else>
          <div class="px-3">
            <button class="btn btn-danger" type="submit">Disable 2FA</button>
            <h6 class="mb-3 mt-4 text-decoration-underline">Recovery Codes</h6>
            <ul class="fs-14" style="margin-left: -5px">
              <li class="mb-2" v-for="recovery_code in recover_codes">
                {{ recovery_code }}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "general",
  data() {
    return {
      qrCode: "",
      recover_codes: [],
      confirm_2fa_form: {
        fields: {},
        error_message: "",
        errors: [],
      },
    };
  },
  mounted() {
    if (this.$auth.user.two_factor_confirmed_at) {
      this.getRecoveryCodes();
    }
  },
  methods: {
    async enable2FA() {
      await this.$axios.$get("sanctum/csrf-cookie");
      await this.$axios.$post("user/two-factor-authentication?portal=admin");

      this.qrCode = (
        await this.$axios.$get("user/two-factor-qr-code?portal=admin")
      ).svg;
    },
    async disable2FA() {
      await this.$axios.$get("sanctum/csrf-cookie");
      await this.$axios.$delete("user/two-factor-authentication?portal=admin");
      await this.$auth.fetchUser();
    },
    async confirm2FA() {
      try {
        await this.$axios.$get("sanctum/csrf-cookie");
        await this.$axios.$post(
          "user/confirmed-two-factor-authentication?portal=admin",
          this.confirm_2fa_form.fields
        );
        await this.$auth.fetchUser();
        this.qrCode = "";
        await this.getRecoveryCodes();
      } catch (e) {
        this.confirm_2fa_form.errors = e.response.data.errors;
        this.confirm_2fa_form.error_message = e.response.data.message;
      }
    },
    async getRecoveryCodes() {
      await this.$axios.$get("sanctum/csrf-cookie");
      this.recover_codes = await this.$axios.$get(
        "user/two-factor-recovery-codes?portal=admin"
      );
    },
  },
};
</script>

<style scoped></style>
