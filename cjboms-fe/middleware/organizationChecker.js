// middleware/organizationChecker.js
export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware checks if user has selected an organization
  if (process.client) {
    const organizationData = localStorage.getItem('organization')

    if (!organizationData) {
      console.log('No organization selected, redirecting to clinics')
      return navigateTo('/admin/organizations/clinics')
    } else {
      const org = JSON.parse(organizationData)
      console.log('Organization found:', org)
    }
  }
})