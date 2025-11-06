<template>
  <div>
    <div class="">
      <form ref="create_invitation" @submit.prevent="updatePrimedToken">
        <div class="card">
          <div class="card-header">
            <h6 class="fs-18 mb-0">Primed Token and Clinic ID</h6>
          </div>
          <div class="card-body">
            <div v-if="showForm || (user.primed_token === null || user.primed_clinic_id === null)">
              <div class="mb-3">
                <label :class="[update_primed_token.errors.primed_token ? 'text-danger' : '']"
                       class="form-label">Primed Token</label>
                <input v-model="update_primed_token.fields.primed_token"
                       :class="[update_primed_token.errors.primed_token ? 'is-invalid' : '']" autocomplete="off"
                       class="form-control" type="text" placeholder="Primed Token">
                <div v-if="update_primed_token.errors.primed_token" class="invalid-feedback">
                  {{ update_primed_token.errors.primed_token[0] }}
                </div>
              </div>

              <div class="mb-3">
                <label :class="[update_primed_token.errors.primed_clinic_id ? 'text-danger' : '']"
                       class="form-label">Primed Clinic ID</label>
                <input v-model="update_primed_token.fields.primed_clinic_id"
                       :class="[update_primed_token.errors.primed_clinic_id ? 'is-invalid' : '']" autocomplete="off"
                       class="form-control" type="text" placeholder="Primed Clinic ID">
                <div v-if="update_primed_token.errors.primed_clinic_id" class="invalid-feedback">
                  {{ update_primed_token.errors.primed_clinic_id[0] }}
                </div>
              </div>

              <div class="card-footer text-end">
                <div class="d-flex gap-3 justify-content-end">
                  <button class="btn btn-primary" :disabled="is_btn_loading" type="submit">
                    {{ is_btn_loading ? 'Adding...' : 'Add' }}</button>
                  <button class="btn btn-outline-primary" @click.prevent="reset">Reset</button>
                </div>
              </div>
            </div>
            <div v-else-if="user.primed_token !== undefined && user.primed_token !== null || user.primed_clinic_id !== undefined && user.primed_clinic_id !== null">
              <div class="alert alert-primary" role="alert">
                You have already added the token and the clinic ID.
              </div>
              <div class="mb-3  d-flex justify-content-center">
                <button class="btn btn-secondary" type="button" @click="showForm = true">Update Primed Token or Clinic ID</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ErrorMessages from "../../../mixins/ErrorMessages";

export default {
  name: "create",
  mixins: [ErrorMessages],
  data() {
    return {
      roles_list: {},
      update_primed_token: {
        fields: {
          primed_token: '',
          primed_clinic_id: ''
        },
        error_message: '',
        errors: [],
      },
      showForm: false,
      is_btn_loading: false,
      user: {}
    }
  },
  methods: {
    getUser() {
      this.user = this.$auth.user
      this.update_primed_token.fields.primed_token = this.user.primed_token
      this.update_primed_token.fields.primed_clinic_id = this.user.primed_clinic_id
    },
    async updatePrimedToken() {
      this.is_btn_loading = true;
      try {
        await this.$axios.$get('sanctum/csrf-cookie')
        await this.$axios.$put(`/api/admin/profile/primed-token`, this.update_primed_token.fields)
        // await this.$auth.fetchUser()
        this.getUser()
        this.$router.push(`/admin/profile/primed-token`)
        this.showForm = false;
        this.reset()
      }  catch (e) {
        this.update_primed_token.errors = e.response.data.errors;
        this.update_primed_token.error_message = e.response.data.message;
        this.convertAndNotifyError(e);
      }
      this.is_btn_loading = false;
    },
    async reset() {
      this.update_primed_token = {
        fields: {
          primed_token: '',
          primed_clinic_id: ''
        },
        error_message: '',
        errors: [],
      }
      if (this.update_primed_token.fields.primed_token || this.update_primed_token.fields.primed_clinic_id) {
        this.update_primed_token.fields.primed_token = ''
        this.update_primed_token.fields.primed_clinic_id = ''
        this.showForm = true
      } else {
        this.showForm = false
      }
      this.getUser()
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<style scoped>

</style>
