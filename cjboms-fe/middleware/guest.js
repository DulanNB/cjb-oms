// middleware/guest.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useAuth()

  if (loggedIn.value) {
    return navigateTo('/admin/shipments')
  }
})
