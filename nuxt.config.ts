// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: false, // Disable devtools completely to avoid native binding issues
  css: ['~/assets/scss/main.scss'],
  ssr: false, // Disable SSR for static site generation
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://todo-backend-production-8ea7.up.railway.app/api',
    },
  },
});


