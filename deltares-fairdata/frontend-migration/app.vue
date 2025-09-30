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
  import { computed } from 'vue'

  const { isAuthenticated, isLoading } = useAuth()

  console.log('useAuth result:', { isAuthenticated, isLoading })
  

  const layoutName = computed(() => {
    console.log('layoutName computed called')
    console.log('isAuthenticated', isAuthenticated.value);
    if(isAuthenticated.value) {
      console.log('isAuthenticated', isAuthenticated.value);
      return 'logged-in'
    }
    return 'default'
  })
</script>
