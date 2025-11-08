// middleware/auth.global.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Define protected routes
  const protectedRoutes = ['/admin', '/compliance', '/dashboard']

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
      to.path.startsWith(route)
  )

  // Skip auth check for login page
  if (to.path.includes('/login') || to.path.includes('/auth')) {
    return
  }

  if (isProtectedRoute) {
    const { loggedIn, user, isInitialized } = useAuth()

    // Wait for auth initialization if not done yet
    if (process.client && !isInitialized.value) {
      // Wait a bit for the auth plugin to initialize
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

    // Check if user is logged in
    if (!loggedIn.value || !user.value) {
      return navigateTo('/admin/auth/login')
    }
  }
})