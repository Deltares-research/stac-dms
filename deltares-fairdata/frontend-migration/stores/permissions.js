import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp } from '#app'

export const usePermissionsStore = defineStore('permissions', () => {
  // State
  const permissions = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchPermissions() {
    isLoading.value = true
    error.value = null
    
    try {
      const { $api } = useNuxtApp()
      
      const permissionData = await $api('/permissions', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })      
      
      if (!permissionData) {
        permissions.value = []
        return false
      }
      
      permissions.value = permissionData.value || permissionData || []
      
      return true
      
    } catch (err) {
      console.error('Failed to fetch permissions:', err)
      error.value = err
      permissions.value = []
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Permission checking functions
  function hasPermission(permission) {
    if (!permissions.value || !Array.isArray(permissions.value)) {
      return false
    }
    
    return permissions.value.includes(permission)
  }

  function requirePermission(permission) {
    if (!hasPermission(permission)) {
      // Show error message (you'll need to implement toast notification)
      console.warn(`Permission required: ${ permission }`)
      
      // Redirect to home page
      if (process.client) {
        window.location.href = '/'
      }
      return false
    }
    return true
  }

  // Collection-specific permissions
  async function fetchCollectionPermissions(collectionId) {
    isLoading.value = true
    error.value = null
    
    try {
      const { $api } = useNuxtApp()
      
      const permissionData = await $api(`/collection-permissions/${ collectionId }`, {
        credentials: 'include',
      })
      
      if (!permissionData) {
        return []
      }
      
      return permissionData.value || permissionData || []
      
    } catch (err) {
      console.error('Failed to fetch collection permissions:', err)
      error.value = err
      return []
    } finally {
      isLoading.value = false
    }
  }

  function hasCollectionPermission() {
    // This would need to be implemented based on your collection permissions structure
    // For now, returning false as a placeholder
    return false
  }

  function clearError() {
    error.value = null
  }

  // Permissions will be fetched explicitly when needed

  return {
    // State
    permissions,
    isLoading,
    error,
    
    // Actions
    fetchPermissions,
    hasPermission,
    requirePermission,
    fetchCollectionPermissions,
    hasCollectionPermission,
    clearError,
  }
})
