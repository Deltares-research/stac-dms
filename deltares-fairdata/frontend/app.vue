<template>
  <div
    v-if="isLoading || configLoading"
    class="d-flex justify-center align-center"
    style="height: 100vh;"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </div>
  <ClientOnly v-else>
    <NuxtLayout :name="layoutName">
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>

<script setup>
  import { useAuth } from '~/composables/useAuth'
  import { useConfigStore } from '~/stores/config'
  import { computed } from 'vue'
  import { useNuxtApp } from '#app'

  const nuxtApp = useNuxtApp()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const configStore = useConfigStore()
  
  // Fetch configuration first
  await configStore.fetchConfig(nuxtApp.$api)
  
  // Only check auth if auth is enabled
  if (configStore.authEnabled) {
    // Check authentication on server-side (SSR)
    // Pass the $api instance to avoid calling useNuxtApp() in stores during SSR
    await checkAuth(nuxtApp.$api)
  }
  
  const layoutName = computed(() => {
    // If auth is disabled, always use logged-in layout
    if (!configStore.authEnabled) {
      return 'logged-in'
    }
    
    // If auth is enabled, switch based on authentication state
    if (isAuthenticated.value) {
      return 'logged-in'
    }
    return 'default'
  })
  
  const configLoading = computed(() => configStore.isLoading)
</script>
