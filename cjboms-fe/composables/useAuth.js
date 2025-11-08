// composables/useAuth.js
export const useAuth = () => {
  const user = useState('auth.user', () => null)
  const loggedIn = useState('auth.loggedIn', () => false)
  const isInitialized = useState('auth.initialized', () => false)
  const config = useRuntimeConfig()

  const setUser = (userData) => {
    user.value = userData
    // Persist to localStorage
    if (process.client && userData) {
      localStorage.setItem('auth.user', JSON.stringify(userData))
    } else if (process.client && !userData) {
      localStorage.removeItem('auth.user')
    }
  }

  const setLoggedIn = (status) => {
    loggedIn.value = status
    // Persist to localStorage
    if (process.client) {
      localStorage.setItem('auth.loggedIn', status.toString())
    }
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
      const userData = await $fetch('/api/admin/profile/', {
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
      const csrfToken = useCookie('XSRF-TOKEN')
      
      const userData = await $fetch('/api/admin/profile/', {
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : '',
          'X-Requested-With': 'XMLHttpRequest'
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
      // Check if we have cached auth data in localStorage
      const cachedUser = localStorage.getItem('auth.user')
      const cachedLoggedIn = localStorage.getItem('auth.loggedIn')

      // Restore from localStorage if available
      // Don't check cookies here because cross-port cookies can't be read by JS
      // If session expires, the 401 error handler will catch it
      if (cachedUser && cachedLoggedIn === 'true') {
        try {
          user.value = JSON.parse(cachedUser)
          loggedIn.value = true
          console.log('Auth restored from localStorage')
        } catch (parseError) {
          console.error('Error parsing cached user:', parseError)
          setUser(null)
          setLoggedIn(false)
        }
      } else {
        // No cached data, user needs to login
        setUser(null)
        setLoggedIn(false)
      }
      
      isInitialized.value = true
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
    isInitialized: readonly(isInitialized),
    login,
    logout,
    fetchUser,
    initAuth,
    checkAuth,
    setUser,
    setLoggedIn
  }
}