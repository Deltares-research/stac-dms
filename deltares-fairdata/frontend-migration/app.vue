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

  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  
  // Check authentication on server-side (SSR)
  await checkAuth()
  
  const layoutName = computed(() => {
    if(isAuthenticated.value) {
      return 'logged-in'
    }
    return 'default'
  })
</script>
