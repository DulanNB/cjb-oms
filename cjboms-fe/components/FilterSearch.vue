<template>
  <div class="filter-search-wrapper">
    <input
        ref="searchInputRef"
        v-model="query"
        class="form-control form-control-sm"
        :class="[borderColorDanger ? 'is-invalid' : '']"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        @keyup="search"
        @focus="handleFocus"
    />

    <ul
        v-if="attributes.data && attributes.data.length > 0 && showDropdown"
        class="list-group filter-search-dropdown"
        :style="{ width: dropdownWidth + 'px' }"
    >
      <li
          v-for="data in filteredData"
          :key="data.value"
          class="list-group-item"
          @click.prevent="setValue(data)"
      >
        <slot name="list_item" :record="data">{{ data.name }}</slot>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// Props
const props = defineProps({
  attributes: {
    type: Object,
    default: () => ({ data: [] })
  },
  borderColorDanger: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  index: {
    type: Number,
    default: 1
  },
  selected: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['selectUpdates', 'queryUpdates', 'update:modelValue'])

// Refs
const query = ref('')
const searchInputRef = ref(null)
const dropdownWidth = ref(200)
const showDropdown = ref(false)

// Computed
const filteredData = computed(() => {
  if (!props.attributes.data) return []

  return props.attributes.data.filter(data => {
    const isActive = (data.state && data.state === 'active') || !data.state
    return isActive
  })
})

// Methods
const getWidth = () => {
  if (searchInputRef.value) {
    return searchInputRef.value.clientWidth
  }
  return 200
}

const setValue = (data) => {
  emit('selectUpdates', data, props.index)
  emit('queryUpdates', '')
  emit('update:modelValue', data)
  query.value = data.name
  showDropdown.value = false
}

const search = () => {
  emit('queryUpdates', query.value)

  if (query.value === '') {
    emit('selectUpdates', {}, props.index)
    emit('update:modelValue', {})
  }

  showDropdown.value = query.value !== ''
}

const handleFocus = () => {
  if (query.value !== '') {
    showDropdown.value = true
  }
}

const clearInput = () => {
  query.value = ''
  emit('queryUpdates', '')
  emit('selectUpdates', {}, props.index)
  emit('update:modelValue', {})
  showDropdown.value = false
}

const handleClickOutside = (event) => {
  if (searchInputRef.value && !searchInputRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Watch for selected prop changes
watch(() => props.selected, (newVal) => {
  if (newVal && newVal.name) {
    query.value = newVal.name
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  dropdownWidth.value = getWidth()
  document.addEventListener('click', handleClickOutside)

  // Update width on window resize
  window.addEventListener('resize', () => {
    dropdownWidth.value = getWidth()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods for parent component
defineExpose({
  clearInput
})
</script>

<style scoped>
.filter-search-wrapper {
  position: relative;
}

.form-control-sm {
  font-size: 13px;
  padding: 6px 8px;
}

.filter-search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 2px;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-search-dropdown .list-group-item {
  cursor: pointer;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.filter-search-dropdown .list-group-item:last-child {
  border-bottom: none;
}

.filter-search-dropdown .list-group-item:hover {
  background-color: #f8f9fa;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>