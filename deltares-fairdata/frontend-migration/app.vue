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
  <NuxtLayout v-else :name="layoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  import { useAuth } from '~/composables/useAuth'
  import { computed, onMounted } from 'vue'

  const { isAuthenticated, isLoading, checkAuth } = useAuth()  

  const layoutName = computed(() => {
    if(isAuthenticated.value) {
      return 'logged-in'
    }
    return 'default'
  })

  // Check authentication on app mount
  onMounted(async () => {
    await checkAuth()
  })
</script>
