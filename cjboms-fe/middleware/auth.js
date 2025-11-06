// middleware/auth.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkAuth } = useAuth()

  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    return navigateTo('/admin/auth/login')
  }
})