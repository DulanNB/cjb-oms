
<template>
  <div class="container d-flex justify-content-end position-fixed notify" style="z-index: 1"
       v-if="notification.show_notify">
    <div class="card p-3 text-white me-5"
         :class="notification.type==='Error' ? 'bg-danger' : 'bg-info'" >
      <div class="media">
        <div class="media-body">
          <h4 class="mb-0">{{ notification.type }}</h4>
          <h5 class="mb-0">{{ notification.message }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import exportFromJSON from 'export-from-json'

export default {
  name: 'Notification',
  props: ['notification'],
  data() {
    return {
    }
  },
  mounted() {
    // if (localStorage.getItem(this.notification.show_notify)) {
    //   this.table_date = JSON.parse(localStorage.getItem(this.notification.show_notify));
    // }
  },
  methods: {

  }
}
</script>
<style>
/*.notify {*/
/*  animation: myfirst 5s 2;*/
/*}*/
/*@keyframes myfirst {*/
/*  50%  { left: 200px; right: 200px;}*/
/*}*/
</style>
