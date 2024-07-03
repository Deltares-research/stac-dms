// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxt/image"],
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
});
