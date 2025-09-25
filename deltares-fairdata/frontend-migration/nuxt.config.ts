import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  imports: {
    autoImport: true,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['mapbox-gl/dist/mapbox-gl.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    ['nuxt-open-fetch', {
      clients: {
        api: {
          // Point this to your actual OpenAPI schema endpoint
          // (commonly /openapi.json or /swagger.json)
          schema: `${process.env.API_URL}/openapi.json`,
          baseURL: '/api',
        },
      },
    }],
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls, // To resolve relative asset URLs
      },
    },
  },

  routeRules: {
    "/api/**": { proxy: process.env.API_URL + "/api/**" },
  },

})
