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
  vite: {
    server: {
      hmr: {
        protocol: "wss",
        clientPort: 3000,
      },
    },
  },
  openFetch: {
    clients: {
      api: {
        schema: "https://deltares-fairdata.com/api/api",
        baseURL: "/api",
      },
    },
  },
  routeRules: {
    "/api/**": { proxy: "https://deltares-fairdata.com/api/**" },
  },
})
