import glsl from 'vite-plugin-glsl'

export default defineNuxtConfig({
  devtools: {enabled: false},
  modules: ['@nuxtjs/sanity', '@nuxtjs/device'],
  pages: true,

  routeRules: {
    '/': {prerender: true},
    '/**': {prerender: true},
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_ID,
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-05-03',
  },

  build: {
    transpile: ['gsap', 'three'],
  },

  runtimeConfig: {
    sanity: {
      projectId: process.env.NUXT_SANITY_ID,
    },
  },

  css: ['@/assets/styles/globals.scss'],

  vite: {
    plugins: [glsl()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/_functions.scss" as *;',
        },
      },
    },
  },

  compatibilityDate: '2024-07-02',
})
