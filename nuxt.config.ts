// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/fonts',
    '@nuxtjs/leaflet',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  fonts: {
    families: [
      { name: 'Helvetica', src: '/helvetica/Helvetica.ttf' },
      { name: 'Helvetica Bold', src: '/helvetica/Helvetica-Bold.ttf' },
      { name: 'Helvetica Bold Condensed', src: '/helvetica/Helvetica\ Bold\ Condensed.otf' },
      { name: 'Helvetica Bold Rounded', src: '/helvetica/Helvetica Rounded Bold.otf' },
    ],
  },
  runtimeConfig: {
    public: {
      title: process.env.title,
    }
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-07-04',
  routeRules: {
    '/': {
      ssr: false,
    },
  }
})
