// plugins/error-handler.client.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin((nuxtApp) => {
  // Store original fetch
  const originalFetch = globalThis.$fetch

  // Create custom fetch with error handling
  const customFetch = originalFetch.create({
    onResponseError({ response }) {
      const status = response.status
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        console.log('401 Unauthorized - redirecting to login')
        
        const { setUser, setLoggedIn } = useAuth()
        setUser(null)
        setLoggedIn(false)
        
        // Clear localStorage
        if (process.client) {
          localStorage.removeItem('auth.user')
          localStorage.removeItem('auth.loggedIn')
          localStorage.removeItem('organization')
        }
        
        // Redirect to login
        navigateTo('/admin/auth/login')
      } else if (status === 419) {
        // CSRF token mismatch - try to refresh
        console.log('419 CSRF token mismatch')
        
        const { setUser, setLoggedIn } = useAuth()
        setUser(null)
        setLoggedIn(false)
        
        if (process.client) {
          localStorage.removeItem('auth.user')
          localStorage.removeItem('auth.loggedIn')
        }
        
        // Redirect to login with message
        navigateTo('/admin/auth/login?session_expired=1')
      }
    }
  })

  // Override global $fetch
  globalThis.$fetch = customFetch
  nuxtApp.provide('fetch', customFetch)
})
