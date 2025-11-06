import createRepository from '~/src/repositories/Repository'

export default defineNuxtPlugin((nuxtApp) => {
  const { $axios } = useNuxtApp()
  nuxtApp.provide('repositories', createRepository($axios))
})
