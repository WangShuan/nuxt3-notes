// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css' },
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js", integrity: "sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ", crossorigin: "anonymous" }
      ]
    },
    baseURL: '/nuxt3-06-notes/' // for gh-pahes
  },
  ssr: false, // for gh-pahes
  modules: ['@nuxtjs/supabase'],
})