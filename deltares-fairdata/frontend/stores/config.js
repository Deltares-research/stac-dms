import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNuxtApp, useRequestHeaders } from '#app'

export const useConfigStore = defineStore('config', () => {
  // State
  const authEnabled = ref(null) 
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchConfig($api = null) {
    isLoading.value = true
    error.value = null
    
    try {
      const api = $api || useNuxtApp().$api
      
    
      const headers = process.server ? useRequestHeaders() : {}
      
      const config = await api('/config', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...headers, 
        },
      })
      
      authEnabled.value = config?.auth_enabled ?? true // Default to true for safety
      return authEnabled.value
      
    } catch (err) {
      console.error('Failed to fetch config:', err?.message || err?.toString() || 'Unknown error')
      error.value = err?.message || 'Failed to fetch config'
      // Default to true (auth enabled) for safety if we can't determine
      authEnabled.value = true
      return true
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    authEnabled,
    isLoading,
    error,
    
    // Actions
    fetchConfig,
    clearError,
  }
})

