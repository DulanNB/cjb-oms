import moment from 'moment'
import 'moment/locale/ru'

export default defineNuxtPlugin(() => {
  moment.locale('ru')

  return {
    provide: {
      moment
    }
  }
})