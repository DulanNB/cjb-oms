// plugins/auth.client.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()

  // Initialize authentication on app start
  try {
    await initAuth()
    console.log('Auth plugin: Authentication initialized')
  } catch (error) {
    console.log('Auth plugin: Auth initialization failed:', error)
  }
})