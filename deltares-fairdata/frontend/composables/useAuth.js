import { useAuthStore } from '~/stores/auth'
import { usePermissionsStore } from '~/stores/permissions'
import { useConfigStore } from '~/stores/config'
import { computed } from 'vue'

export function useAuth() {
  const authStore = useAuthStore()
  const permissionsStore = usePermissionsStore()
  const configStore = useConfigStore()

  // Combined authentication and permission checking
  const isAuthenticated = computed(() => authStore.isLoggedIn)
  const user = computed(() => authStore.user)
  const displayName = computed(() => authStore.displayName)
  const isLoading = computed(() => authStore.isLoading || permissionsStore.isLoading)

  // Permission checking with authentication
  function hasPermission(permission) {
    // If auth is disabled, grant all permissions
    if (!configStore.authEnabled) {
      return true
    }
    if (!isAuthenticated.value) {
      return false
    }
    return permissionsStore.hasPermission(permission)
  }

  function requirePermission(permission) {
    // If auth is disabled, grant all permissions
    if (!configStore.authEnabled) {
      return true
    }
    if (!isAuthenticated.value) {
      authStore.login()
      return false
    }
    return permissionsStore.requirePermission(permission)
  }

  // Authentication actions
  async function login() {
    return await authStore.login()
  }

  async function logout() {
    return await authStore.logout()
  }

  async function checkAuth($api = null) {
    const authResult = await authStore.checkAuth($api)
    if (authResult) {
      // Refresh permissions when user is authenticated
      await permissionsStore.fetchPermissions($api)
    }
    return authResult
  }

  return {
    isAuthenticated,
    user,
    displayName,
    isLoading,
    hasPermission,
    requirePermission,
    login,
    logout,
    checkAuth,
  }
}
