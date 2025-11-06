<template>
  <div>
    <div class="">
      <div class="align-items-center">
        <div class="">
          <a :href="document.tempUrl" target="_blank" rel="noopener noreferre">
<!--            PDF file view -->
            <div v-if="document.mime_type === 'application/pdf'"
                 :style="[{
                     backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg)`,
                     height: '110px',
                     width: '110px',
                     backgroundRepeat: 'no-repeat',
                     backgroundColor: '#FDD8D8',
                     backgroundSize: 'auto 100%'}]"
                 class="d-flex mt-1 rounded-3 shadow justify-content-end">
            </div>
<!--            Image File view -->
            <div v-else
                 :style="[{
                   backgroundImage: `url(${document.tempUrl})`,
                   height: '110px',
                   backgroundRepeat: 'no-repeat',
                   backgroundColor: '#CFCFCF',
                   backgroundSize: 'auto 100%'}]"
                 class="mt-1 rounded-3 shadow d-flex justify-content-end"
            >
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FileView',
  props: ['document'],
  data() {
    return {}
  },
  mounted() {

  },
  methods: {},
}
</script>

<style scoped>
.rounded-3 {
  width: 110px;
  border: 1px solid grey;
}
</style>
