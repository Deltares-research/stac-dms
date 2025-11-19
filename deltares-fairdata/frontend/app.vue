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
  
  // No need to fetch config anymore - it's read from runtimeConfig
  
  // Only check auth if auth is enabled
  if (configStore.authEnabled) {
    await checkAuth(nuxtApp.$api)
  }

  const layoutName = computed(() => {
    if (!configStore.authEnabled) {
      return 'logged-in'
    }
    if (isAuthenticated.value) {
      return 'logged-in'
    }
    return 'default'
  })

  // Remove configLoading - no longer needed
</script>
