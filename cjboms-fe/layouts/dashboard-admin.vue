<template>
  <div class="page">
    <!-- Sidebar -->
    <LazyLayoutsDashboardAdminSidebar />

    <!-- Header -->
    <LazyLayoutsDashboardAdminHeader />

    <!-- Main Content -->
    <div class="page-wrapper p-2">
      <slot />

      <!-- Footer -->
      <LazyLayoutsFooter />
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

// Auth check
const { user, loggedIn } = useAuth()

// Redirect to login if not authenticated
watch(loggedIn, (newValue) => {
  if (!newValue && process.client) {
    navigateTo('/admin/auth/login')
  }
})

// Simple organization check without the composable
onMounted(() => {
  if (process.client) {
    const org = localStorage.getItem('organization')
    if (org) {
      console.log('Current organization:', JSON.parse(org))
    }
  }
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-wrapper {
  flex: 1;
  margin-top: 60px; /* Adjust based on your header height */
  margin-left: 280px; /* Adjust based on your sidebar width */
}

@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0;
  }
}
</style>