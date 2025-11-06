<template>
  <div id="dropdownMenuButton">
    <div class="custom-form-wrap">
      <div class="form-field select-wrapper">
        <input
          id="dropdownMenuButton1"
          class="form-control select-input-field 
            dropdown-toggle rounded-left-custom
            rounded-right-custom"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          :class="[border_color_danger ? 'is-invalid' : '']"
          v-model="localSelectedName"
          @keyup="onSearch"
          autocomplete="off"
          :placeholder="placeholder"
          :disabled="disabled"
          readonly
        />

          <ul
            class="dropdown-menu select-menu rounded-1"
            aria-labelledby="dropdownMenuButton1"
          >
            <li v-if="filteredData.length === 0" class="text-center">
              No data available
            </li>

            <li
              v-for="item in filteredData"
              :key="item.id"
              :class="[item.id === attributes.selected?.id ? 'active-item' : '']"
            >
              <a class="dropdown-item" @click.prevent="selectItem(item)">
                <slot name="list_item" :record="item">{{ item.name }}</slot>
              </a>
            </li>

          </ul>

      </div>

      <span v-if="selectedItem?.name" @click="reset">
        <i class="fas fa-times close-icon"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  attributes: {
    type: Object,
    default: () => ({
      data: [],
      selected: null
    })
  },
  border_color_danger: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['selectUpdates', 'queryUpdates']);

const localSelectedName = ref(props.attributes.selected?.name || '');
const selectedItem = ref(props.attributes.selected || null);
const dataList = ref(props.attributes.data || []);

watch(
  () => props.attributes.data,
  (newData) => {
    dataList.value = newData || [];
  },
  { deep: true, immediate: true }
)

watch(
  () => props.attributes.selected,
  (newSelected) => {
    selectedItem.value = newSelected || null;
    localSelectedName.value = newSelected?.name || '';
  },
  { deep: true, immediate: true }
)

const filteredData = computed(() => {
  return dataList.value.filter(
    (item) => item && (!item.state || item.state === 'active')
  )
})

const selectItem = (item) => {
  selectedItem.value = item;
  localSelectedName.value = item.name;
  emit('selectUpdates', item);
}

const reset = () => {
  selectedItem.value = null;
  localSelectedName.value = '';
  emit('queryUpdates');
}

const onSearch = () => {
  emit('queryUpdates', localSelectedName.value);
}

defineExpose({
  reset
})
</script>

<style scoped>
.dropdown-item {
  white-space: normal;
}

.select-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;
}

li:hover {
  background-color: #cbcacf5c;
}

.active-item {
  background-color: #cbcacf;
}

.select-input-field {
  font-size: 13px;
  padding: 6px 8px;
  cursor: pointer;
}
</style>
