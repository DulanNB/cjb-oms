// plugins/auth.client.js
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin({
  name: 'auth',
  parallel: false,
  async setup() {
    const { initAuth, isInitialized } = useAuth()

    // Initialize authentication on app start
    if (!isInitialized.value) {
      try {
        await initAuth()
        console.log('Auth plugin: Authentication initialized')
      } catch (error) {
        console.log('Auth plugin: Auth initialization failed:', error)
      }
    }
  }
})