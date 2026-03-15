// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        {rel: 'icon', type: 'image/png', href: '/logo.png'},
        {rel: 'stylesheet', href: '/reset.css'},
        {rel: 'stylesheet', href: '/custom.css'} ,
        {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Uncial+Antiqua&display=swap'}
      ]
    }
  }
})
