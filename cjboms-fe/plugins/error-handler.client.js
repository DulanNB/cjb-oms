// plugins/error-handler.client.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(() => {
  // Handle global fetch errors
  $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        const { logout } = useAuth()
        logout()
      } else if (response.status === 419) {
        // CSRF token mismatch - refresh page
        if (process.client) {
          window.location.reload()
        }
      }
    }
  })
})
