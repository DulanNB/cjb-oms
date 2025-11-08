// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  ssr: false,
  devtools: { enabled: false },

  devServer: {
    port: 3001
  },

  app: {
    head: {
      title: 'cjboms-fe',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/tabler@latest/dist/js/tabler.min.js' },
        { src: 'https://cdn.jsdelivr.net/npm/@tabler/icons@1.74.0/icons-react/dist/index.umd.min.js' },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/delivery-service.jpg' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css' }
      ]
    }
  },

  css: [
    '~/assets/css/tabler.min.css',
    '~/assets/css/main.css',
  ],

  plugins: [
    { src: '~/plugins/auth.client.js', mode: 'client' },
    { src: '~/plugins/error-handler.client.js', mode: 'client' },
    { src: '~/plugins/v-calendar.js', mode: 'client' },
    { src: '~/plugins/mixinCommonMethods.js', mode: 'client' },
    { src: '~/plugins/axios.js', mode: 'client' },
    { src: '~/plugins/repositories.js', mode: 'client' },
    { src: '~/plugins/helpers/g-organization.js', mode: 'client' },
    { src: '~/plugins/echo.js', mode: 'client' },
    { src: '~/plugins/multiselect.js', mode: 'client' },
    { src: '~/plugins/vuedraggable.js', mode: 'client' },
    { src: '~/plugins/vapor-file-upload.js', mode: 'client' },
    { src: '~/plugins/validation.js', mode: 'client' },
    { src: '~/plugins/toast.js', mode: 'client' },
  ],

  runtimeConfig: {
    public: {
      tinyApiKey: process.env.TINY_API_KEY,
      patientPortalURL: process.env.PATIENT_PORTAL_URL,
      apiUrl: process.env.API_URL
    }
  },

  // Add route redirects and development proxy
  nitro: {
    routeRules: {
      '/': { redirect: '/admin/auth/login' }
    },
    devProxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost'
      },
      '/sanctum': {
        target: 'http://localhost:8000/sanctum',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost'
      }
    }
  }
});