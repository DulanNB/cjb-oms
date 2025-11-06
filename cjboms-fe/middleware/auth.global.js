// middleware/auth.global.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
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
    const { loggedIn, user } = useAuth()

    // Check if user is logged in
    if (!loggedIn.value || !user.value) {
      return navigateTo('/admin/auth/login')
    }
  }
})