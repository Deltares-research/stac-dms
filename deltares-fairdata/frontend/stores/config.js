import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useConfigStore = defineStore('config', () => {
  const config = useRuntimeConfig()
  
  // Read from Nuxt runtime config (can be set via env variable AUTH_ENABLED)
  const authEnabled = config.public.authEnabled ?? true // Default to true for safety

  return {
    authEnabled,
  }
})

