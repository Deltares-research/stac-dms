// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

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
        baseURL: "/api",
      },
    },
  },

  routeRules: {
    "/api/**": { proxy: process.env.API_URL + "/api/**" },
  },

  compatibilityDate: "2025-03-11",
})
