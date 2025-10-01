import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'

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
      
      const userData = await $api('/auth/me', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
      console.error('Auth check failed:', err)
      error.value = err
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
      error.value = err
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
