import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchCollections } from '~/requests/collections'

export const useDomainsStore = defineStore('domains', () => {
  // State
  const collections = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const hasCollections = computed(() => collections.value.length > 0)

  // Actions
  async function fetchDomains() {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchCollections({ limit: 1000 })
      collections.value = data?.collections || []
      return true
    } catch (err) {
      console.error('Failed to fetch domains:', err?.message || err?.toString() || 'Unknown error')
      error.value = err?.message || 'Failed to fetch domains'
      collections.value = []
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    collections,
    isLoading,
    error,
    
    // Computed
    hasCollections,
    
    // Actions
    fetchDomains,
    clearError,
  }
})

