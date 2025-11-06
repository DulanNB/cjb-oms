<template>
  <div id="tab-1" class="card br-8 overflow-hidden tab-pane active show">
    <!-- Loading State -->
    <div v-if="!user" class="card-body text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading user information...</p>
    </div>

    <!-- Form Content -->
    <form v-else @submit.prevent="updateProfile">
      <div class="card-body">
        <!-- Error Message Alert -->
        <div v-if="updateProfileForm.errorMessage" class="alert alert-danger" role="alert">
          {{ updateProfileForm.errorMessage }}
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-input mb-3">
              <label
                  :class="[updateProfileForm.errors.first_name ? 'text-danger' : '']"
                  class="form-label"
              >
                First Name
              </label>
              <input
                  v-model="updateProfileForm.fields.first_name"
                  :class="[updateProfileForm.errors.first_name ? 'is-invalid' : '']"
                  autocomplete="off"
                  class="form-control"
                  placeholder="First name"
                  type="text"
              >
              <div v-if="updateProfileForm.errors.first_name" class="invalid-feedback">
                {{ updateProfileForm.errors.first_name[0] }}
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-input mb-3">
              <label
                  :class="[updateProfileForm.errors.last_name ? 'text-danger' : '']"
                  class="form-label"
              >
                Last Name
              </label>
              <input
                  v-model="updateProfileForm.fields.last_name"
                  :class="[updateProfileForm.errors.last_name ? 'is-invalid' : '']"
                  autocomplete="off"
                  class="form-control"
                  placeholder="Last name"
                  type="text"
              >
              <div v-if="updateProfileForm.errors.last_name" class="invalid-feedback">
                {{ updateProfileForm.errors.last_name[0] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer text-end">
        <div class="d-flex gap-3 justify-content-end">
          <button
              class="btn btn-primary"
              :disabled="isBtnLoading"
              type="submit"
          >
            {{ isBtnLoading ? 'Updating...' : 'Update User' }}
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
const { user, refreshUser } = useAuth() // Assuming you have an auth composable
const config = useRuntimeConfig()

// Add error handling for auth
onErrorCaptured((error) => {
  console.error('Auth error:', error)
  if (error.message.includes('user')) {
    // Handle auth-related errors
    navigateTo('/login')
  }
  return false
})

// Reactive state
const isBtnLoading = ref(false)

// Form data structure
const updateProfileForm = ref({
  fields: {
    first_name: '',
    last_name: ''
  },
  errorMessage: '',
  errors: {}
})

// Initialize form with user data
const initializeForm = () => {
  if (user?.value) {
    updateProfileForm.value.fields.first_name = user.value.first_name || ''
    updateProfileForm.value.fields.last_name = user.value.last_name || ''
  }
}

// Clear form errors
const clearErrors = () => {
  updateProfileForm.value.errors = {}
  updateProfileForm.value.errorMessage = ''
}

// Update profile method
const updateProfile = async () => {
  isBtnLoading.value = true
  clearErrors()

  try {
    // Get CSRF token if using Laravel Sanctum
    const csrfToken = useCookie('XSRF-TOKEN')

    // Prepare payload
    const payload = {
      first_name: updateProfileForm.value.fields.first_name,
      last_name: updateProfileForm.value.fields.last_name
    }

    // Make API call
    const response = await $fetch('/api/admin/profile', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : ''
      },
      body: payload
    })

    // Refresh user data
    await refreshUser()

    // Show success notification
    showNotification('Profile updated successfully!', 'success')

  } catch (error) {
    console.error('Profile update error:', error)

    // Handle validation errors
    if (error.status === 422 && error.data?.errors) {
      updateProfileForm.value.errors = error.data.errors
    }

    // Handle general error message
    if (error.data?.message) {
      updateProfileForm.value.errorMessage = error.data.message
    } else {
      updateProfileForm.value.errorMessage = 'An error occurred while updating your profile'
    }

    // Show error notification
    showNotification(updateProfileForm.value.errorMessage, 'error')
  }

  isBtnLoading.value = false
}

// Reset form to original values
const reset = () => {
  initializeForm()
  clearErrors()
}

// Simple notification function (you can replace with your preferred notification system)
const showNotification = (message, type = 'info') => {
  // You can implement your notification system here
  // For example: useToast, useNotification, etc.
  console.log(`${type.toUpperCase()}: ${message}`)

  // Example with a simple alert (replace with your notification system)
  if (type === 'success') {
    // Success notification
  } else if (type === 'error') {
    // Error notification
  }
}

// Initialize form when component mounts
onMounted(() => {
  initializeForm()
})

// Watch for user changes and update form
watch(() => user?.value, (newUser) => {
  if (newUser) {
    initializeForm()
  }
}, { immediate: true })
</script>

<style scoped>
.br-8 {
  border-radius: 8px !important;
}

.form-input {
  position: relative;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
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
</style>