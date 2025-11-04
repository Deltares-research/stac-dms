// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  runtimeConfig: {
    // Server-side API URL (for Docker/local)
    apiUrl: process.env.API_URL || 'http://backend:8000',
  },
  
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/image",
    "nuxt-open-fetch",
  ],
  
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  
  openFetch: {
    clients: {
      api: {
        schema: process.env.API_URL + "/api/api",
        baseURL: "/api", // Always use relative path - load balancer handles routing
      },
    },
  },
  
  routeRules: {
    // Only use proxy in local development (when Caddy is running)
    ...(process.env.NODE_ENV === 'development' && {
      "/api/**": { 
        proxy: (process.env.API_URL || 'http://backend:8000') + "/api/**"
      },
    }),
  },
  
  ssr: true,
  
  compatibilityDate: "2025-03-11",
})