import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  // Create an axios instance if needed, or use the default
  const instance = axios.create();

  instance.interceptors.request.use(config => {
    if (
        typeof localStorage !== 'undefined' &&
        localStorage.getItem('organization') &&
        !config.url.toLowerCase().includes("aws") &&
        !config.url.toLowerCase().includes("primedpharmacy")
    ) {
      config.params = {
        ...config.params,
        'organization_id': JSON.parse(localStorage.getItem('organization')).id
      };
    }
    return config;
  });

  instance.interceptors.response.use(response => {
    if (response.data.two_factor === true) {
      return navigateTo({ name: 'admin-auth-two-factor-challenge' });
    }
    return response;
  }, error => {
    const code = parseInt(error.response && error.response.status);
    const nuxtAppInstance = useNuxtApp();

    if (code === 401) {
      // If using @sidebase/nuxt-auth or similar, adapt logout accordingly
      if (nuxtAppInstance.$auth && typeof nuxtAppInstance.$auth.logout === 'function') {
        nuxtAppInstance.$auth.logout();
      }
      //localStorage.clear();
      navigateTo('/admin/auth/login');
    }

    if (code === 423) {
      navigateTo({ name: 'admin-confirm-password', query: { return: nuxtAppInstance.$router?.currentRoute?.name } });
    }

    // 403 permission error handling placeholder
    // if (code === 403 && error.response.error === 'permission') {}

    return Promise.reject(error);
  });

  nuxtApp.provide('axios', instance);
});
