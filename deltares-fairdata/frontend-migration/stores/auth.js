import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNuxtApp, useRequestHeaders } from '#app'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const displayName = computed(() => user.value?.display_name || '')
  const userEmail = computed(() => user.value?.email || '')
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

  // Actions
  async function checkAuth() {
    isLoading.value = true
    error.value = null
    
    try {
      const { $api } = useNuxtApp()
      
      // For SSR, we need to forward request headers to include cookies
      const headers = process.server ? useRequestHeaders() : {}
      
      const userData = await $api('/auth/me', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...headers, // Forward server-side headers (including cookies)
        },
      })
      
      if (!userData) {
        // User is not authenticated
        user.value = null
        isAuthenticated.value = false
        return false
      }
      
      // User is authenticated
      user.value = userData
      isAuthenticated.value = true
      return true
      
    } catch (err) {
      // 401 Unauthorized is normal for unauthenticated users - don't log as error
      if (err?.status !== 401) {
        console.error('Auth check failed:', err)
        error.value = err?.message || 'Authentication failed'
      } else {
        // Clear any previous errors for normal unauthenticated state
        error.value = null
      }
      user.value = null
      isAuthenticated.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function login() {
    // Redirect to Microsoft SSO login
    window.location.href = '/api/auth/login'
  }

  async function logout() {
    isLoading.value = true
    error.value = null
    
    try {
      // Clear user data first
      user.value = null
      isAuthenticated.value = false
      
      // Clear the DMS_TOKEN cookie
      if (process.client) {
        document.cookie = 'DMS_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        window.location.href = '/'
      }
      
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = err?.message || 'Logout failed'
      // Even if logout fails, clear local state and redirect
      user.value = null
      isAuthenticated.value = false
      if (process.client) {
        document.cookie = 'DMS_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        window.location.href = '/'
      }
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  // Auth check will be called explicitly when needed

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Getters
    displayName,
    userEmail,
    isLoggedIn,
    
    // Actions
    checkAuth,
    login,
    logout,
    clearError,
  }
})
