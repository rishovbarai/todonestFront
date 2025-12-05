// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  ssr: false, // Disable SSR for static site generation (SPA mode)
  nitro: {
    preset: 'static', // Explicitly set to static preset
    prerender: {
      crawlLinks: true,
    },
  },
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


