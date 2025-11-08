<template>
  <aside class="navbar navbar-vertical navbar-expand-lg overflow-y-auto sidenav-wrapper bg-primary">
    <div class="container-fluid">
      <div class="navbar-brand navbar-brand-autolite">
        <h3 id="header">CJBOMS</h3>
      </div>

      <div id="sidebar-menu" class="collapse navbar-collapse mt-3">
        <ul class="navbar-nav">
          <li class="nav-item">
            <NuxtLink 
              class="nav-link" 
              to="/templates/dashboard"
              active-class="active-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="icon icon-tabler icons-tabler-outline icon-tabler-layout"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
              </svg>
              <span class="nav-link-title manrope-sidebar-nav-tab-font"> Dashboard </span>
            </NuxtLink>
          </li>

          <li class="nav-item">
            <NuxtLink 
              class="nav-link" 
              to="/admin/shipments"
              active-class="active-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" 
                fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" />
              </svg>
              <span class="nav-link-title manrope-sidebar-nav-tab-font"> Shipments </span>
            </NuxtLink>
          </li>

          <li class="nav-item">
            <NuxtLink 
              class="nav-link" 
              to="/admin/orders"
              active-class="active-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
              </svg>
              <span class="nav-link-title manrope-sidebar-nav-tab-font"> Orders </span>
            </NuxtLink>
          </li>
          
          <!-- <li class="nav-item">
            <NuxtLink 
              class="nav-link" 
              to="/admin/products"
              active-class="active-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                class="icon icon-tabler icons-tabler-outline icon-tabler-archive"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" /><path d="M10 12l4 0" />
              </svg>
              <span class="nav-link-title manrope-sidebar-nav-tab-font"> Products </span>
            </NuxtLink>
          </li> -->
          
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

// Reactive data
const organizationData = ref({})
const currentOrganization = ref({})

// Watch route changes
watch(() => route.path, (newPath) => {
  if (newPath === "/admin/settings") {
    router.push("/admin/settings/users")
  }
})

// Methods
const handleLogout = async () => {
  try {
    if (process.client) {
      localStorage.setItem("organization", "")
    }

    const {logout} = useAuth()
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const getCurrentOrganization = () => {
  if (process.client && localStorage.getItem("organization")) {
    currentOrganization.value = JSON.parse(localStorage.getItem("organization"))
  }
}

const goToOrganization = async (organization) => {
  try {
    // For now, just set it in localStorage and reload
    // Later you can implement the API call to set global organization
    if (process.client) {
      localStorage.setItem('organization', JSON.stringify(organization))
      window.location.reload()
    }
  } catch (error) {
    console.error('Error setting organization:', error)
  }
}

// Lifecycle
onMounted(() => {
  getCurrentOrganization()
})
</script>

<style scoped>
#header {
  color: white !important;
}

.manrope-sidebar-nav-tab-font {
  font-family: "Manrope", sans-serif;
  font-size: 16px !important;
  font-weight: 400;
  font-style: normal;
}

/* Base nav-link styling */
.nav-link {
  font-weight: 400 !important;
  color: #ffffff !important;
  padding: 12px 16px !important;
  border-radius: 8px !important;
  margin: 4px 8px !important;
  display: flex !important;
  align-items: center !important;
}

.nav-link-title {
  margin-left: 8px;
  font-weight: 400 !important;
  color: #ffffff !important;
}

.nav-link svg {
  color: #ffffff !important;
  flex-shrink: 0;
}

/* Hover state */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Active state - using custom class */
.nav-link.active-link {
  font-weight: 600 !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.nav-link.active-link .nav-link-title {
  font-weight: 600 !important;
}
</style>