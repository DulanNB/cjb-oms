// middleware/guest.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, isInitialized } = useAuth()

  // Wait for auth initialization if not done yet
  if (process.client && !isInitialized.value) {
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (isInitialized.value) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 50)
      
      // Timeout after 3 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        resolve()
      }, 3000)
    })
  }

  if (loggedIn.value) {
    return navigateTo('/admin/shipments')
  }
})
