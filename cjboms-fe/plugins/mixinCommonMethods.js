import moment from 'moment-timezone'

const commonMethodsMixin = {
  data() {
    return {
      notification: { show_notify: false },
      icon_copy: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-box-multiple" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="7" y="3" width="14" height="14" rx="2"></rect>
                    <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2"></path>
                  </svg>`,
      icon_copied: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler classNametabler-check" width="24" height="24"
                           viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                           stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M5 12l5 5l10 -10"></path>
                    </svg>`,
    }
  },
  methods: {
    getPrice (price) {
      return `£ ${parseFloat(price).toFixed(2)}`
    },
    getDateTime(date,format) {
      return moment(date).format(format)
    },
    momentConvertToUK(value, arg){
      return moment(moment(new Date(moment.utc(value).format())).format(arg)).utc().format(arg)
    },
    momentFormat(value, arg) {
      // Get client timezone
      const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      return moment.utc(value).tz(clientTimezone).format(arg);
    },
    firstLetterUpperCase (value) {
      if (value === null) return 'N/A'
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    async showSuccessMessage ( text, time = 1500 ) {
      this.notification = {
        type : 'Success',
        message : text,
        show_notify : true
      }
      setTimeout(() => { this.notification.show_notify = false }, time)
    },
    async showErrorMessage ( error, time = 1500 ) {
      this.notification = {
        type : 'Error',
        message : error.response.data.error ? error.response.data.error : error.response.data.message,
        show_notify : true
      }
      setTimeout(() => { this.notification.show_notify = false }, time)
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin(commonMethodsMixin);
});
