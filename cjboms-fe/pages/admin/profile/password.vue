<template>
  <div id="tab-1" class="card br-8 overflow-hidden tab-pane active show">
    <form @submit.prevent="changePassword">
      <div class="card-body">
        <!-- Error Message Alert -->
        <div v-if="changePasswordForm.errorMessage" class="alert alert-danger" role="alert">
          {{ changePasswordForm.errorMessage }}
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-input mb-4">
              <label
                  :class="[changePasswordForm.errors.current_password ? 'text-danger' : '']"
                  class="form-label required"
              >
                Current Password
              </label>
              <div class="input-icon input-icon__right">
                <input
                    v-model="changePasswordForm.fields.current_password"
                    :class="[changePasswordForm.errors.current_password ? 'is-invalid' : '']"
                    :type="changePasswordForm.currentPasswordShow ? 'text' : 'password'"
                    autocomplete="off"
                    class="form-control"
                    placeholder="Enter current password"
                />
                <span class="input-icon-addon mb-2 pe-auto">
                  <a
                      class="link-secondary"
                      href="#"
                      title="Show password"
                      @click.prevent="passwordVisibilityToggle('current_password')"
                  >
                    <!-- Eye Off Icon -->
                    <svg
                        v-if="changePasswordForm.currentPasswordShow"
                        class="icon icon-tabler icon-tabler-eye-off"
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                      <line x1="3" x2="21" y1="3" y2="21"></line>
                      <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                      <path
                          d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                      ></path>
                    </svg>
                    <!-- Eye Icon -->
                    <svg
                        v-else
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path
                          d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                      />
                    </svg>
                  </a>
                </span>
              </div>
              <div v-if="changePasswordForm.errors.current_password" class="invalid-feedback">
                {{ changePasswordForm.errors.current_password[0] }}
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-input mb-4">
              <label
                  :class="[changePasswordForm.errors.password ? 'text-danger' : '']"
                  class="form-label required"
              >
                New Password
              </label>
              <div class="input-icon input-icon__right">
                <input
                    v-model="changePasswordForm.fields.password"
                    :class="[changePasswordForm.errors.password ? 'is-invalid' : '']"
                    :type="changePasswordForm.passwordShow ? 'text' : 'password'"
                    autocomplete="off"
                    class="form-control"
                    placeholder="Enter new password"
                />
                <span class="input-icon-addon mb-2 pe-auto">
                  <a
                      class="link-secondary"
                      href="#"
                      title="Show password"
                      @click.prevent="passwordVisibilityToggle('password')"
                  >
                    <!-- Eye Off Icon -->
                    <svg
                        v-if="changePasswordForm.passwordShow"
                        class="icon icon-tabler icon-tabler-eye-off"
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                      <line x1="3" x2="21" y1="3" y2="21"></line>
                      <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                      <path
                          d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                      ></path>
                    </svg>
                    <!-- Eye Icon -->
                    <svg
                        v-else
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path
                          d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                      />
                    </svg>
                  </a>
                </span>
              </div>
              <div v-if="changePasswordForm.errors.password" class="invalid-feedback">
                {{ changePasswordForm.errors.password[0] }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-input mb-4">
              <label
                  :class="[changePasswordForm.errors.password_confirmation ? 'text-danger' : '']"
                  class="form-label required"
              >
                Password Confirmation
              </label>
              <div class="input-icon input-icon__right">
                <input
                    v-model="changePasswordForm.fields.password_confirmation"
                    :class="[changePasswordForm.errors.password_confirmation ? 'is-invalid' : '']"
                    :type="changePasswordForm.passwordConfirmationShow ? 'text' : 'password'"
                    autocomplete="off"
                    class="form-control"
                    placeholder="Confirm password"
                />
                <span class="input-icon-addon mb-2 pe-auto">
                  <a
                      class="link-secondary"
                      href="#"
                      title="Show password"
                      @click.prevent="passwordVisibilityToggle('password_confirmation')"
                  >
                    <!-- Eye Off Icon -->
                    <svg
                        v-if="changePasswordForm.passwordConfirmationShow"
                        class="icon icon-tabler icon-tabler-eye-off"
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                      <line x1="3" x2="21" y1="3" y2="21"></line>
                      <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                      <path
                          d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                      ></path>
                    </svg>
                    <!-- Eye Icon -->
                    <svg
                        v-else
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
                      <path d="M0 0h24v24H0z" fill="none" stroke="none"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path
                          d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                      />
                    </svg>
                  </a>
                </span>
              </div>
              <div v-if="changePasswordForm.errors.password_confirmation" class="invalid-feedback">
                {{ changePasswordForm.errors.password_confirmation[0] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer text-end">
        <div class="d-flex gap-3 justify-content-end">
          <button
              class="btn btn-primary"
              type="submit"
              :disabled="isBtnLoading"
          >
            {{ isBtnLoading ? 'Changing...' : 'Change Password' }}
          </button>
          <button
              class="btn btn-outline-primary"
              @click.prevent="reset"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

// Composables
const { refreshUser } = useAuth() // Assuming you have an auth composable
const config = useRuntimeConfig()

// Reactive state
const isBtnLoading = ref(false)

// Form data structure
const changePasswordForm = ref({
  fields: {
    current_password: '',
    password: '',
    password_confirmation: ''
  },
  errorMessage: '',
  errors: {},
  currentPasswordShow: false,
  passwordShow: false,
  passwordConfirmationShow: false
})

// Clear form errors
const clearErrors = () => {
  changePasswordForm.value.errors = {}
  changePasswordForm.value.errorMessage = ''
}

// Change password method
const changePassword = async () => {
  isBtnLoading.value = true
  clearErrors()

  try {
    // Get CSRF token if using Laravel Sanctum
    const csrfToken = useCookie('XSRF-TOKEN')

    // Make API call
    const response = await $fetch('/user/password', {
      method: 'PUT',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : ''
      },
      query: {
        portal: 'admin'
      },
      body: changePasswordForm.value.fields
    })

    // Refresh user data
    await refreshUser()

    // Reset form after successful change
    reset()

    // Show success notification
    showNotification('Password changed successfully!', 'success')

  } catch (error) {
    console.error('Password change error:', error)

    // Handle validation errors
    if (error.status === 422 && error.data?.errors) {
      changePasswordForm.value.errors = error.data.errors
    }

    // Handle general error message
    if (error.data?.message) {
      changePasswordForm.value.errorMessage = error.data.message
    } else {
      changePasswordForm.value.errorMessage = 'An error occurred while changing your password'
    }

    // Show error notification
    showNotification(changePasswordForm.value.errorMessage, 'error')
  }

  isBtnLoading.value = false
}

// Reset form to initial state
const reset = () => {
  changePasswordForm.value = {
    fields: {
      current_password: '',
      password: '',
      password_confirmation: ''
    },
    errorMessage: '',
    errors: {},
    currentPasswordShow: false,
    passwordShow: false,
    passwordConfirmationShow: false
  }
}

// Toggle password visibility
const passwordVisibilityToggle = (type) => {
  switch (type) {
    case 'current_password':
      changePasswordForm.value.currentPasswordShow = !changePasswordForm.value.currentPasswordShow
      break
    case 'password':
      changePasswordForm.value.passwordShow = !changePasswordForm.value.passwordShow
      break
    case 'password_confirmation':
      changePasswordForm.value.passwordConfirmationShow = !changePasswordForm.value.passwordConfirmationShow
      break
  }
}

// Simple notification function (replace with your preferred notification system)
const showNotification = (message, type = 'info') => {
  // You can implement your notification system here
  console.log(`${type.toUpperCase()}: ${message}`)

  // Example implementations:
  // useToast().add({ title: message, color: type === 'success' ? 'green' : 'red' })
  // useNotification().show({ message, type })
}
</script>

<style scoped>
.br-8 {
  border-radius: 8px !important;
}

.required:after {
  content: " *";
  color: red;
}

.form-input {
  position: relative;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input-icon {
  position: relative;
}

.input-icon__right .input-icon-addon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: #6c757d;
  cursor: pointer;
}

.input-icon__right .form-control {
  padding-right: 2.5rem;
}

.form-control {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 0.2rem rgba(139, 92, 246, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.icon {
  width: 20px;
  height: 20px;
}

.link-secondary {
  color: #6c757d;
  text-decoration: none;
}

.link-secondary:hover {
  color: #495057;
}

.btn {
  transition: all 0.15s ease-in-out;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
}

.btn-primary:hover:not(:disabled) {
  background-color: #7C3AED;
  border-color: #7C3AED;
}

.btn-outline-primary {
  color: #8B5CF6;
  border-color: #8B5CF6;
}

.btn-outline-primary:hover {
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  color: white;
}

.alert {
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.pe-auto {
  pointer-events: auto;
}
</style>