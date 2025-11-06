export default defineNuxtPlugin(() => {
  // Get runtime config and composables
  const { $fetch } = useNuxtApp()

  // Helper functions
  const setGlobalOrganization = async (organization_id) => {
    try {
      const response = await $fetch(`/api/admin/organizations/${organization_id}`)
      const organization = response.data

      organization['permissions'] = [].concat.apply([], organization.admin_organization_roles.map(admin_organization_role => {
        return admin_organization_role.role.permissions;
      }))

      if (process.client) {
        localStorage.setItem('organization', JSON.stringify(organization))
      }
    } catch (error) {
      console.error('Error setting global organization:', error)
    }
  }

  const checkOrganizationPermission = (code, portal = 'admin') => {
    if (process.client && localStorage.getItem('organization')) {
      const current_organization = JSON.parse(localStorage.getItem('organization'))
      const permission = current_organization.permissions.find(permission =>
          permission.code === code && permission.portal === portal
      )
      return typeof permission === "object"
    }
    return false
  }

  // Initialize organization on plugin load (client-side only)
  if (process.client) {
    const initializeOrganization = async () => {
      try {
        if (localStorage.getItem('organization')) {
          let organization = JSON.parse(localStorage.getItem('organization'))

          // Refresh organization data
          const response = await $fetch(`/api/admin/organizations/${organization.id}`)
          organization = response.data

          organization['permissions'] = [].concat.apply([], organization.admin_organization_roles.map(admin_organization_role => {
            return admin_organization_role.role.permissions;
          }))

          localStorage.setItem('organization', JSON.stringify(organization))
        }
      } catch (error) {
        console.error('Error initializing organization:', error)
      }
    }

    // Run initialization
    initializeOrganization()
  }

  // Return helpers to make them available globally
  return {
    provide: {
      setGlobalOrganization,
      checkOrganizationPermission
    }
  }
})