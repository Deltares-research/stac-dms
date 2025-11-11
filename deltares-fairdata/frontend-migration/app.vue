<template>
  <div
    v-if="isLoading"
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
  import { computed } from 'vue'
  import { useNuxtApp } from '#app'

  const nuxtApp = useNuxtApp()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  
  // Check authentication on server-side (SSR)
  // Pass the $api instance to avoid calling useNuxtApp() in stores during SSR
  await checkAuth(nuxtApp.$api)
  
  const layoutName = computed(() => {
    if(isAuthenticated.value) {
      return 'logged-in'
    }
    return 'default'
  })
</script>
