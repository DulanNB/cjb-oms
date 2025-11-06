<template>
  <div class="page page-center min-vh-100">
    <div class="container-fluid">
      <div class="text-center my-4">
        <Logo />
      </div>
    </div>

    <div class="container container-tight">
      <div class="mx-auto">
        <form class="" @submit.prevent="signup">
          <div class="card shadow-lg br-16">
            <div class="card-body p-4 p-sm-6">
              <h4 class="text-h4 text-center mb-4">Sign up</h4>

              <div class="login-wrapper mt-6">
                <!-- Error Message -->
                <div
                    v-if="signupForm.message"
                    class="alert alert-danger"
                    role="alert"
                >
                  {{ signupForm.message }}
                </div>

                <!-- First Name -->
                <div class="form-input mb-3">
                  <label class="form-label required">First Name</label>
                  <input
                      id="signup_form_first_name"
                      v-model="signupForm.fields.first_name"
                      :class="[signupForm.errors.first_name ? 'is-invalid' : '']"
                      class="form-control"
                      placeholder="Enter first name"
                      type="text"
                  />
                  <div
                      v-if="signupForm.errors.first_name"
                      class="invalid-feedback"
                  >
                    {{ signupForm.errors.first_name[0] }}
                  </div>
                </div>

                <!-- Last Name -->
                <div class="form-input mb-3">
                  <label class="form-label required">Last Name</label>
                  <input
                      id="signup_form_last_name"
                      v-model="signupForm.fields.last_name"
                      :class="[signupForm.errors.last_name ? 'is-invalid' : '']"
                      class="form-control"
                      placeholder="Enter last name"
                      type="text"
                  />
                  <div
                      v-if="signupForm.errors.last_name"
                      class="invalid-feedback"
                  >
                    {{ signupForm.errors.last_name[0] }}
                  </div>
                </div>

                <!-- Email -->
                <div class="form-input mb-3">
                  <label class="form-label required">Email address</label>
                  <input
                      id="signup_form_email"
                      v-model="signupForm.fields.email"
                      :class="[signupForm.errors.email ? 'is-invalid' : '']"
                      class="form-control"
                      placeholder="Enter email"
                      type="email"
                  />
                  <div v-if="signupForm.errors.email" class="invalid-feedback">
                    {{ signupForm.errors.email[0] }}
                  </div>
                </div>

                <!-- Password -->
                <div class="form-input mb-3">
                  <label class="form-label required">Password</label>
                  <div class="input-icon input-icon__right">
                    <input
                        id="signup_form_password"
                        v-model="signupForm.fields.password"
                        :class="[signupForm.errors.password ? 'is-invalid' : '']"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="off"
                        class="form-control"
                        placeholder="Password"
                    />

                    <span class="input-icon-addon mb-2 pe-auto">
                      <a
                          class="link-secondary"
                          data-bs-toggle="tooltip"
                          href="#"
                          title="Show password"
                          @click.prevent="passwordVisibilityToggle('password')"
                      >
                        <!-- Eye Icon (Show) -->
                        <svg
                            v-if="showPassword"
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
                          <circle cx="12" cy="12" r="2" />
                          <path
                              d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                          />
                        </svg>
                        <!-- Eye Off Icon (Hide) -->
                        <svg
                            v-else
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
                          <path
                              d="M0 0h24v24H0z"
                              fill="none"
                              stroke="none"
                          ></path>
                          <line x1="3" x2="21" y1="3" y2="21"></line>
                          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                          <path
                              d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                          ></path>
                        </svg>
                      </a>
                    </span>
                    <div
                        v-if="signupForm.errors.password"
                        class="invalid-feedback"
                    >
                      {{ signupForm.errors.password[0] }}
                    </div>
                  </div>
                </div>

                <!-- Password Confirmation -->
                <div class="form-input mb-3">
                  <label class="form-label required">Password Confirmation</label>
                  <div class="input-icon input-icon__right">
                    <input
                        id="signup_form_password_confirmation"
                        v-model="signupForm.fields.password_confirmation"
                        :class="[
                        signupForm.errors.password_confirmation
                          ? 'is-invalid'
                          : '',
                      ]"
                        :type="showPasswordConfirmation ? 'text' : 'password'"
                        autocomplete="off"
                        class="form-control"
                        placeholder="Confirm Password"
                    />
                    <span class="input-icon-addon mb-2 pe-auto">
                      <a
                          class="link-secondary"
                          data-bs-toggle="tooltip"
                          href="#"
                          title="Show password"
                          @click.prevent="passwordVisibilityToggle('password_confirmation')"
                      >
                        <!-- Eye Icon (Show) -->
                        <svg
                            v-if="showPasswordConfirmation"
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
                          <circle cx="12" cy="12" r="2" />
                          <path
                              d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"
                          />
                        </svg>
                        <!-- Eye Off Icon (Hide) -->
                        <svg
                            v-else
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
                          <path
                              d="M0 0h24v24H0z"
                              fill="none"
                              stroke="none"
                          ></path>
                          <line x1="3" x2="21" y1="3" y2="21"></line>
                          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                          <path
                              d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                          ></path>
                        </svg>
                      </a>
                    </span>
                    <div
                        v-if="signupForm.errors.password_confirmation"
                        class="invalid-feedback"
                    >
                      {{ signupForm.errors.password_confirmation[0] }}
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="form-footer">
                  <button
                      class="btn btn-primary w-100"
                      type="submit"
                      :disabled="isBtnLoading"
                  >
                    <span v-if="isBtnLoading">
                      <div class="spinner-border spinner-border-sm me-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Signing up...
                    </span>
                    <span v-else>
                      Create new account
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Sign In Link -->
      <div class="text-center text-muted mt-3">
        <p class="fs-14">
          Already have account?
          <NuxtLink
              class="text-primary text-decoration-underline fw-semibold"
              tabindex="-1"
              to="/admin/auth/login"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

// Middleware to redirect authenticated users
definePageMeta({
  middleware: 'guest'
})

// Runtime config
const config = useRuntimeConfig()

// Reactive data
const signupForm = reactive({
  fields: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
  errors: {},
  message: '',
})

const isBtnLoading = ref(false)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

// Methods
const passwordVisibilityToggle = (type) => {
  switch (type) {
    case 'password':
      showPassword.value = !showPassword.value
      break
    case 'password_confirmation':
      showPasswordConfirmation.value = !showPasswordConfirmation.value
      break
  }
}

const validateForm = () => {
  const errors = {}

  // Validate first name and last name (for frontend display)
  if (!signupForm.fields.first_name) {
    errors.first_name = ['First name is required']
  } else if (signupForm.fields.first_name.length > 127) {
    errors.first_name = ['First name cannot exceed 127 characters']
  }

  if (!signupForm.fields.last_name) {
    errors.last_name = ['Last name is required']
  } else if (signupForm.fields.last_name.length > 127) {
    errors.last_name = ['Last name cannot exceed 127 characters']
  }

  // Combined name validation (what gets sent to Laravel)
  const fullName = `${signupForm.fields.first_name} ${signupForm.fields.last_name}`.trim()
  if (fullName.length > 255) {
    errors.first_name = ['Combined first and last name cannot exceed 255 characters']
  }

  if (!signupForm.fields.email) {
    errors.email = ['Email is required']
  } else if (!/\S+@\S+\.\S+/.test(signupForm.fields.email)) {
    errors.email = ['Email is invalid']
  } else if (signupForm.fields.email.length > 255) {
    errors.email = ['Email cannot exceed 255 characters']
  }

  if (!signupForm.fields.password) {
    errors.password = ['Password is required']
  } else if (signupForm.fields.password.length < 8) {
    errors.password = ['Password must be at least 8 characters']
  }

  if (!signupForm.fields.password_confirmation) {
    errors.password_confirmation = ['Password confirmation is required']
  } else if (signupForm.fields.password !== signupForm.fields.password_confirmation) {
    errors.password_confirmation = ['Passwords do not match']
  }

  signupForm.errors = errors
  return Object.keys(errors).length === 0
}

const signup = async () => {
  // Clear previous errors
  signupForm.errors = {}
  signupForm.message = ''

  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    isBtnLoading.value = true

    // Get CSRF token first
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })

    // Small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get CSRF token from cookie
    const csrfCookie = useCookie('XSRF-TOKEN')
    const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''

    console.log('CSRF Token:', csrfToken) // Debug log

    // Register user - prepare data for Laravel API
    const registrationData = {
      name: `${signupForm.fields.first_name} ${signupForm.fields.last_name}`,
      email: signupForm.fields.email,
      password: signupForm.fields.password,
      password_confirmation: signupForm.fields.password_confirmation
    }

    await $fetch('/api/admin/profile/register', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      body: registrationData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // Get fresh CSRF token after registration (session may have changed)
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })

    // Small delay to ensure new cookie is set
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get the new CSRF token from cookie
    const newCsrfCookie = useCookie('XSRF-TOKEN')
    const newCsrfToken = newCsrfCookie.value ? decodeURIComponent(newCsrfCookie.value) : ''

    console.log('New CSRF Token for login:', newCsrfToken) // Debug log

    // Auto-login after successful registration
    const loginResponse = await $fetch('/api/admin/profile/login', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      body: {
        email: signupForm.fields.email,
        password: signupForm.fields.password
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': newCsrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // Get user data after successful login (use the new token)
    const user = await $fetch('/api/admin/profile/profile', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': newCsrfToken
      }
    })

    // Store user data using auth composable
    const { setUser, setLoggedIn } = useAuth()

    if (user && user.data) {
      setUser(user.data)
      setLoggedIn(true)

      console.log('User registered and logged in successfully:', user.data)
    }

    // Show success message
    const { $toast } = useNuxtApp()
    if ($toast) {
      $toast.success('Account created successfully!')
    }

    // Redirect to dashboard
    await navigateTo('/admin/shipments')

  } catch (error) {
    console.error('Signup error:', error)

    if (error.data && error.data.errors) {
      signupForm.errors = error.data.errors
      signupForm.message = error.data.message || 'Registration failed'
    } else if (error.data && error.data.message) {
      signupForm.message = error.data.message
    } else if (error.statusCode === 419) {
      signupForm.message = 'Session expired. Please refresh the page and try again.'
    } else {
      signupForm.message = 'Network error. Please try again.'
    }
  } finally {
    isBtnLoading.value = false
  }
}

// Head management
useHead({
  title: 'Sign Up - Admin Portal',
  bodyAttrs: {
    class: 'd-flex flex-column'
  }
})
</script>

<style scoped>
.required:after {
  content: " *";
  color: red;
}

.page-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.br-16 {
  border-radius: 16px;
}

.input-icon {
  position: relative;
}

.input-icon__right .input-icon-addon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>