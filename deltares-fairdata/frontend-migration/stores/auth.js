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

      console.log('userData', JSON.stringify(userData, undefined, 2))
      
      if (!userData) {
        // User is not authenticated
        user.value = null
        isAuthenticated.value = false
        return false
      }
      
      // User is authenticated
      user.value = userData
      isAuthenticated.value = true
      console.log('Setting isAuthenticated to true')
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
      const { $api } = useNuxtApp()
      
      await $api('/auth/logout', {
        method: 'POST',
      })
      
      // Clear user data
      user.value = null
      isAuthenticated.value = false
      
      // Redirect to home page
      if (process.client) {
        window.location.href = '/'
      }
      
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth check on store creation
  checkAuth()

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
