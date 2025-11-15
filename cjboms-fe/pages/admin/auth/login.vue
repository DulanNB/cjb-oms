<template>
  <div class="page page-center min-vh-100">
    <div class="container-fluid">
      <div class="text-center my-4">
        <Logo/>
      </div>
    </div>

    <div class="container container-tight">
      <div class="mx-auto">
        <form autocomplete="off" @submit.prevent="login">
          <div class="card shadow-lg br-16">
            <div class="card-body p-4 p-sm-6">
              <h4 class="text-h4 text-center mb-4">Login</h4>

              <div class="login-wrapper mt-6">
                <!-- Error Alert -->
                <div
                    v-if="loginForm.message"
                    class="alert alert-danger"
                    role="alert"
                >
                  {{ loginForm.message }}
                </div>

                <!-- Email Field -->
                <div class="form-input mb-4">
                  <label class="form-label">Email address</label>
                  <input
                      id="login_form_email"
                      v-model="loginForm.fields.email"
                      :class="[loginForm.errors.email ? 'is-invalid' : '']"
                      autocomplete="off"
                      class="form-control"
                      placeholder="Enter email"
                      type="email"
                  />
                  <div v-if="loginForm.errors.email" class="invalid-feedback">
                    {{ loginForm.errors.email[0] }}
                  </div>
                </div>

                <!-- Password Field -->
                <div class="form-input mb-3">
                  <label class="form-label">Password</label>
                  <div class="input-icon input-icon__right">
                    <input
                        id="login_form_password"
                        v-model="loginForm.fields.password"
                        :class="[loginForm.errors.password ? 'is-invalid' : '']"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="off"
                        class="form-control"
                        placeholder="Password"
                    />
                    <span class="input-icon-addon mb-2 pe-auto">
                      <a
                          class="link-secondary"
                          href="#"
                          title="Show password"
                          @click.prevent="passwordVisibilityToggle"
                      >
                        <!-- Eye Icon (Show) -->
                        <svg
                            v-if="!showPassword"
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
                          <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                          <line x1="3" x2="21" y1="3" y2="21"></line>
                          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"></path>
                          <path
                              d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341"
                          ></path>
                        </svg>
                      </a>
                    </span>
                    <div v-if="loginForm.errors.password" class="invalid-feedback">
                      {{ loginForm.errors.password[0] }}
                    </div>
                  </div>
                </div>

                <!-- Remember Me / Forgot Password -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-check">
                      <input
                          v-model="loginForm.fields.remember"
                          type="checkbox"
                          class="form-check-input"
                      />
                      <span class="form-check-label fs-14 fw-medium">
                        Remember me
                      </span>
                    </label>

                    <NuxtLink
                        class="text-primary text-decoration-underline fw-medium"
                        to="/admin/auth/forgot-password"
                    >
                      Forgot Password?
                    </NuxtLink>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="form-footer">
                  <button
                      v-if="!loginForm.loading"
                      class="btn btn-primary w-100"
                      type="submit"
                  >
                    Sign in
                  </button>
                  <button v-else class="btn btn-primary w-100" disabled>
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    Signing in...
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="text-center mt-3">
          <p class="fs-14">
            Don't have account yet?
            <NuxtLink
                class="text-primary text-decoration-underline fw-semibold"
                to="/admin/auth/signup"
            >
              Sign up
            </NuxtLink>
          </p>
        </div>
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
const loginForm = reactive({
  fields: {
    email: '',
    password: '',
    remember: false
  },
  errors: {},
  message: '',
  loading: false
})

const showPassword = ref(false)

// Methods
const passwordVisibilityToggle = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  const errors = {}

  if (!loginForm.fields.email) {
    errors.email = ['Email is required']
  } else if (!/\S+@\S+\.\S+/.test(loginForm.fields.email)) {
    errors.email = ['Email is invalid']
  }

  if (!loginForm.fields.password) {
    errors.password = ['Password is required']
  }

  loginForm.errors = errors
  return Object.keys(errors).length === 0
}

const login = async () => {
  loginForm.errors = {}
  loginForm.message = ''

  if (!validateForm()) return

  try {
    loginForm.loading = true

    await $fetch('/sanctum/csrf-cookie', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })

    const response = await $fetch('/api/admin/profile/login', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      body: loginForm.fields
    })

    const user = await $fetch('/api/admin/profile', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })

    const { setUser, setLoggedIn } = useAuth()
    setUser(user.data)
    setLoggedIn(true)

    $toast.success('Login successful!')

    await navigateTo('/admin/orders')

  } catch (error) {
    console.error('Login error:', error)

    if (error.data?.errors) {
      loginForm.errors = error.data.errors
      loginForm.message = error.data.message || 'Login failed'
    } else {
      loginForm.message = error.data?.message || 'Login failed'
    }
  } finally {
    loginForm.loading = false
  }
}


// Head management
useHead({
  title: 'Login - Admin Portal',
  bodyAttrs: {
    class: 'd-flex flex-column'
  }
})
</script>

<style scoped>
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