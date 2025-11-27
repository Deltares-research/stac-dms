import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchGroups } from '~/requests/groups'

export const useGroupsStore = defineStore('groups', () => {
  // State
  const groups = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const hasGroups = computed(() => groups.value.length > 0)

  // Actions
  async function fetchGroupsList() {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchGroups()
      groups.value = data || []
      return true
    } catch (err) {
      console.error('Failed to fetch groups:', err?.message || err?.toString() || 'Unknown error')
      error.value = err?.message || 'Failed to fetch groups'
      groups.value = []
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
    groups,
    isLoading,
    error,
    
    // Computed
    hasGroups,
    
    // Actions
    fetchGroupsList,
    clearError,
  }
})

