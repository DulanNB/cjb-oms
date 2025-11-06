<template>
  <div></div>
  <!--  <Tutorial/>-->
</template>

<script>
export default {
  name: 'IndexPage',
  mounted() {
    this.checkOrganizationCount()
  },
  methods: {
    async checkOrganizationCount() {
      try {
        if (this.$auth.loggedIn) {
          // Note: You may need to update this depending on your HTTP client
          const response = await $fetch('api/admin/organizations', {
            params: {per_page: 3}
          })

          const clinics = response.data

          if (clinics.length === 1) {
            await this.$setGlobalOrganization(clinics[0].id)
            await this.$router.push('admin/settings/user-tokens/')
          } else {
            await this.$router.push('/admin/organizations/')
          }
        }
      } catch (e) {
        console.error('Error checking organization count:', e)
      }
    }
  }
}
</script>