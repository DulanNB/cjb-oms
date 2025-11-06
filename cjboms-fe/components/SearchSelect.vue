<template>
  <div id="dropdownMenuButton">
    <div class="custom-form-wrap">
      <div class="form-field">
        <input
          class="form-control dropdown-toggle"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          :class="[border_color_danger ? 'is-invalid' : '']"
          v-model="attributes.selected.name"
          @keyup="search()"
          autocomplete="off"
          :placeholder="placeholder"
          :disabled="disabled"
        />
        <ul
          class="dropdown-menu select-menu"
          aria-labelledby="dropdownMenuButton1"
          :style="{ width: getWidth() + 'px' }"
        >
          <li class="text-center" v-if="attributes.data.length === 0">
            No data available
          </li>
          <li
            v-for="data in attributes.data"
            :class="[
              data.value === attributes.selected.value ? 'active-item' : '',
            ]"
            v-if="
              attributes.data.length !== 0 &&
              ((data.state && data.state === 'active') || !data.state)
            "
          >
            <a class="dropdown-item" @click.prevent="setValue(data)">
              <slot name="list_item" :record="data">{{ data.name }}</slot>
            </a>
          </li>
        </ul>
      </div>
      <span v-if="attributes.selected.name" @click="reset()"><i class="fas fa-times close-icon"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchSelect",
  data() {
    return {
      query: null,
    };
  },
  props: {
    attributes: {
      type: Object,
      default: () => ({}),
    },
    border_color_danger: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getWidth() {
      let elemInput = document.getElementById("dropdownMenuButton");
      if (elemInput) return elemInput.clientWidth;
    },
    setValue(data) {
      this.attributes.selected = data;
      this.$emit("selectUpdates");
      this.$emit("queryUpdates", "");
    },
    search() {
      this.$emit("queryUpdates", this.attributes.selected.name);
      if (this.attributes.selected.name === "") {
        this.attributes.selected = {};
        this.$emit("selectUpdates", this.attributes.selected.name);
      }
    },
    reset(){
      this.attributes.selected.name = ''
      this.search()
    }
  },
};
</script>

<style scoped>
.dropdown-item {
  white-space: normal;
}
.select-menu {
  max-height: 230px;
  overflow: auto;
}
li:hover {
  background-color: #cbcacf5c;
}
.active-item {
  background-color: #cbcacf;
}
</style>
