export default defineNuxtPlugin(async () => {
  if (process.client) {
    try {
      const vaporModule = await import('./helpers/vapor-file-upload')
      window.Vapor = vaporModule.default || vaporModule
    } catch (error) {
      console.warn('Failed to load vapor-file-upload:', error)
    }
  }
})
