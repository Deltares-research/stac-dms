export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.server) return

  const { isAuthenticated, checkAuth } = useAuth()

  // Check authentication status
  checkAuth().then((authenticated) => {
    if (authenticated) {
      // User is authenticated, redirect to home page
      return navigateTo('/')
    }
  })
})
