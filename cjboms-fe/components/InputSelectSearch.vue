<template>
  <div id="dropdownMenuButton">
    <div class="custom-form-wrap">
      <input id="dropdownMenuButton1" v-model="searchValue" :class="[border_color_danger ? 'is-invalid' : '']"
             :disabled="disabled"
             :placeholder="placeholder"
             aria-expanded="false" autocomplete="off" class="form-control dropdown-toggle" data-bs-toggle="dropdown" @keyup="search()">
      <span v-if="searchValue" class="close-icon" @click="clearInput"><i class="fas fa-times"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputSelectSearch",
  data() {
    return {
      query: null,
      searchValue: ''
    }
  },
  props: {
    attributes: {
      type: Object,
      default: () => ({})
    },
    border_color_danger: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 1
    },
    selected: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },

  },
  methods: {
    clearInput() {
      this.searchValue = ''
      this.$emit('queryUpdates', ''); // Reset query
    },
    getWidth() {
      let elemInput = document.getElementById('dropdownMenuButton');
      if (elemInput) return elemInput.clientWidth
    },
    setValue(data) {
      this.selected = data
      this.$emit('selectUpdates', data, this.index)
      this.$emit('queryUpdates', '')
    },
    search() {
      this.$emit('queryUpdates', this.searchValue)
    }
  }
}
</script>

<style scoped>
</style>
