export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  const { isAuthenticated, hasPermission, checkAuth } = useAuth()

  // Check authentication status first
  checkAuth().then((authenticated) => {
    if (!authenticated) {
      // User is not authenticated, redirect to home page
      return navigateTo('/')
    }

    // Check if route requires specific permissions
    const requiredPermission = to.meta.permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
      // User doesn't have required permission, redirect to home page
      console.warn(`Permission required: ${ requiredPermission }`)
      return navigateTo('/')
    }
  })
})
