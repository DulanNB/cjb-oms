<template>
  <header class="navbar navbar-expand-lg fixed-top d-print-none shadow-md topnav-wrapper">
    <div class="container-fluid">
      <div class="navbar-brand d-none d-lg-flex flex-column align-items-start">
        <h1 class="h2 mb-0 text-primary fw-bold">{{ pageTitle }}</h1>
        <p class="fs-4 text-muted fw-normal mb-0">{{ pageDescription }}</p>
      </div>
      <div class="d-flex ms-auto align-items-center">
        <div class="navbar-nav flex-row order-lg-last ms-auto me-3 me-lg-0">
          <!-- Profile -->
          <div class="nav-item dropdown">
            <a
                ref="profileDropdownRef"
                aria-label="Open user menu"
                class="nav-link d-flex align-items-center profile-trigger p-0"
                href="#"
                @click.prevent="toggleProfileDropdown"
            >
              <span
                  class="avatar avatar-sm rounded-circle bg-cover"
                  style="background-image: url(https://source.unsplash.com/iFgRcqHznqg/50x50);"
              ></span>
              <div class="d-none d-xl-block profile-info ms-2">
                <div class="profile-name text-primary">{{ user?.first_name || 'Test User' }} {{ user?.last_name || '' }}</div>
                <div class="profile-role">Admin</div>
              </div>
            </a>
            <div
                ref="profileDropdownMenuRef"
                class="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                :class="{ show: isProfileDropdownOpen }"
            >
              <NuxtLink class="dropdown-item" to="" @click="closeProfileDropdown">
                Profile & Account
              </NuxtLink>
              <div class="dropdown-divider my-0"></div>
              <a href="#" @click.prevent="handleLogout" class="dropdown-item">
                Logout
              </a>
            </div>
          </div>
        </div>

        <button
            ref="navbarTogglerRef"
            class="navbar-toggler d-lg-none"
            :class="{ collapsed: !isSidebarOpen }"
            type="button"
            aria-controls="sidebar-menu"
            :aria-expanded="isSidebarOpen"
            aria-label="Toggle navigation"
            @click="toggleSidebar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Composables
const { user, logout } = useAuth()
const config = useRuntimeConfig()

// Reactive data
const organizationData = ref({})
const currentOrganization = ref({})
const waitingRoomCount = ref(0)
const isProfileDropdownOpen = ref(false)
const isSidebarOpen = ref(false)

// Template refs
const profileDropdownRef = ref(null)
const profileDropdownMenuRef = ref(null)
const navbarTogglerRef = ref(null)

// Methods
const handleLogout = async () => {
  try {
    // Close dropdown first
    closeProfileDropdown()

    // Clear organization from localStorage
    if (process.client) {
      localStorage.setItem('organization', '')
    }

    // Logout using auth composable
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value

  // Toggle the sidebar element if it exists
  if (process.client) {
    const sidebar = document.getElementById('sidebar-menu')
    if (sidebar) {
      if (isSidebarOpen.value) {
        sidebar.classList.add('show')
      } else {
        sidebar.classList.remove('show')
      }
    }
  }
}

const getCurrentOrganization = () => {
  if (process.client && localStorage.getItem('organization')) {
    currentOrganization.value = JSON.parse(localStorage.getItem('organization'))
  }
}

const goToOrganization = async (organization) => {
  try {
    // Call your global organization setter (you'll need to implement this)
    // await setGlobalOrganization(organization.id)

    if (process.client) {
      localStorage.setItem('organization', JSON.stringify(organization))
      window.location.reload()
    }
  } catch (error) {
    console.error('Error setting organization:', error)
  }
}

const copyURL = async () => {
  try {
    const portalUrl = `${config.public.patientPortalURL}/patient/auth/${currentOrganization.value.uuid}/consultation-form`

    if (process.client && navigator.clipboard) {
      await navigator.clipboard.writeText(portalUrl)

      const copyElement = document.getElementById('copy_patient_portal')
      if (copyElement) {
        copyElement.innerHTML = 'Patient portal Link Copied'
        setTimeout(() => {
          copyElement.innerHTML = 'Patient portal Link'
        }, 3000)
      }
    }
  } catch (error) {
    console.error('Error copying URL:', error)
  }
}

const getWaitingRoomCount = async () => {
  try {
    const csrfToken = useCookie('XSRF-TOKEN')

    const response = await $fetch('/api/admin/appointment-waiting-room-count', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : ''
      }
    })

    waitingRoomCount.value = response.data
  } catch (error) {
    console.error('Error fetching waiting room count:', error)
  }
}

// Handle clicks outside dropdown to close it
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && profileDropdownMenuRef.value) {
    if (!profileDropdownRef.value.contains(event.target) &&
        !profileDropdownMenuRef.value.contains(event.target)) {
      closeProfileDropdown()
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  getCurrentOrganization()
  // getWaitingRoomCount()

  // Add click outside listener for dropdown
  if (process.client) {
    document.addEventListener('click', handleClickOutside)
  }

  // Uncomment if you want periodic updates
  // setInterval(() => {
  //   getWaitingRoomCount()
  // }, 3000)
})

onUnmounted(() => {
  // Clean up event listener
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})

// Handle escape key to close dropdown
onMounted(() => {
  if (process.client) {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeProfileDropdown()
      }
    }
    document.addEventListener('keydown', handleEscape)

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  }
})

const route = useRoute()

const pageTitle = computed(() => {
  // You can expand this mapping as needed
  const routeMap = [
    { match: /^\/templates\/shipments/, title: 'Shipments' },
      { match: /^\/admin\/shipments/, title: 'Shipments' },
    { match: /^\/templates\/patients/, title: 'Patients' },
    { match: /^\/admin\/patients/, title: 'Patients' },
    { match: /^\/admin\/products/, title: 'Products' },
    { match: /^\/admin(\/)?$/, title: 'Dashboard' },
    { match: /^\/$/, title: 'Dashboard' },
    // Add more mappings as needed
  ]
  const found = routeMap.find(r => r.match.test(route.path))
  return found ? found.title : 'Dashboard'
})

// add support text
const descriptions = {
  Dashboard: 'Stay updated on all order activities in real time',
  Patients: 'View and manage patient profiles efficiently',
  Shipments: 'View shipment status and history at a glance',
  Products: 'Monitor stock levels, availability, and product details'
}

// get the correct description for page title
const pageDescription = computed(() => descriptions[pageTitle.value] || '');
</script>

<style scoped>
#organization_list {
  max-height: 280px;
  overflow-y: auto;
}

/* Ensure dropdown positioning works correctly */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-menu-end {
  right: 0;
  left: auto;
}

/* Profile trigger styles to match the image */
.profile-trigger {
  min-width: 180px;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}
.profile-trigger:focus, .profile-trigger:hover {
  background: #f5f5f5;
  text-decoration: none;
}
.profile-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
}
.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.profile-name {
  font-size: 16px;
  font-weight: 500;
  color: #232323;
  line-height: 1.1;
}
.profile-role {
  font-size: 14px;
  color: #888;
  line-height: 1.1;
}

.navbar-brand{
  gap: 0;
}
</style>