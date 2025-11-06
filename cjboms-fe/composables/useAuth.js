// composables/useAuth.js
export const useAuth = () => {
  const user = useState('auth.user', () => null)
  const loggedIn = useState('auth.loggedIn', () => false)
  const config = useRuntimeConfig()

  const setUser = (userData) => {
    user.value = userData
  }

  const setLoggedIn = (status) => {
    loggedIn.value = status
  }

  const login = async (credentials) => {
    try {
      // Get CSRF token first
      await $fetch('/sanctum/csrf-cookie', {
        baseURL: config.public.apiUrl,
        credentials: 'include'
      })

      // Get CSRF token from cookie
      const csrfToken = useCookie('XSRF-TOKEN')

      // Login request with CSRF token
      const response = await $fetch('/api/admin/profile/login', {
        method: 'POST',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        body: credentials,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : ''
        }
      })

      // Get user data
      const userData = await $fetch('/api/admin/profile/profile', {
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      })

      setUser(userData.data)
      setLoggedIn(true)

      return { success: true, user: userData.data }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const csrfToken = useCookie('XSRF-TOKEN')

      await $fetch('/api/admin/profile/logout', {
        method: 'POST',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : ''
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setLoggedIn(false)
      await navigateTo('/admin/auth/login')
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await $fetch('/api/admin/profile/profile', {
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      })

      setUser(userData.data)
      setLoggedIn(true)
      return userData.data
    } catch (error) {
      console.error('Fetch user error:', error)
      setUser(null)
      setLoggedIn(false)
      throw error
    }
  }

  const initAuth = async () => {
    if (process.client) {
      try {
        // First check if we have any session cookies
        const sessionCookie = useCookie('laravel_session')
        const xsrfCookie = useCookie('XSRF-TOKEN')

        if (!sessionCookie.value && !xsrfCookie.value) {
          // No session cookies, user is not authenticated
          setUser(null)
          setLoggedIn(false)
          return
        }

        await fetchUser()
      } catch (error) {
        console.log('Auth initialization failed:', error)
        // User not authenticated
        setUser(null)
        setLoggedIn(false)
      }
    }
  }

  const checkAuth = async () => {
    if (process.client) {
      // If we already have a user, return true
      if (user.value && loggedIn.value) {
        return true
      }

      try {
        await fetchUser()
        return true
      } catch (error) {
        setUser(null)
        setLoggedIn(false)
        return false
      }
    }
    return false
  }

  return {
    user: readonly(user),
    loggedIn: readonly(loggedIn),
    login,
    logout,
    fetchUser,
    initAuth,
    checkAuth,
    setUser,
    setLoggedIn
  }
}