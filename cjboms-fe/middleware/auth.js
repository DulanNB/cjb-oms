// middleware/auth.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useAuth()

  // Check if user is logged in based on localStorage state
  if (!loggedIn.value || !user.value) {
    return navigateTo('/admin/auth/login')
  }
})