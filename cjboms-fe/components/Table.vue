<template>
  <div style="display: contents">
    <!-- Desktop Table -->
    <div class="table-responsive">
      <table class="table card-table table-vcenter text-nowrap datatable d-none d-md-table">
        <thead>
        <tr>
          <!-- for check box -->
          <th v-if="attributes.check_box" class="w-1 text-center">
            <input
              class="form-check-input m-0 align-middle rounded-1"
              type="checkbox"
              aria-label="Select all"
              v-model="selectAll"
              @change="toggleSelectAll"
            >
          </th>
          <th v-for="label in attributes.labels" :key="label.key">
            <div v-if="label.sort" role="button" @click="sortChange(label.key)">
              {{ label.name }}
              <svg
                  v-if="tableData.sort.key === label.key && tableData.sort.direction === false"
                  class="icon icon-tabler icon-tabler-sort-ascending"
                  fill="none" height="24" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                <line x1="4" x2="11" y1="6" y2="6"></line>
                <line x1="4" x2="11" y1="12" y2="12"></line>
                <line x1="4" x2="13" y1="18" y2="18"></line>
                <polyline points="15 9 18 6 21 9"></polyline>
                <line x1="18" x2="18" y1="6" y2="18"></line>
              </svg>
              <svg
                  v-else-if="tableData.sort.key === label.key && tableData.sort.direction === true"
                  class="icon icon-tabler icon-tabler-sort-descending"
                  fill="none" height="24" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                <line x1="4" x2="13" y1="6" y2="6"></line>
                <line x1="4" x2="11" y1="12" y2="12"></line>
                <line x1="4" x2="11" y1="18" y2="18"></line>
                <polyline points="15 15 18 18 21 15"></polyline>
                <line x1="18" x2="18" y1="6" y2="18"></line>
              </svg>
            </div>
            <div v-else>{{ label.name }}</div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="attributes.loading">
          <td class="text-center" :colspan="attributes.labels.length + (attributes.check_box ? 1 : 0)">
            <div class="loader-container">
              <div class="loader"></div>
            </div>
          </td>
        </tr>
        <tr v-else-if="Array.isArray(attributes.api_response.data) && !attributes.api_response.data.length">
          <td class="text-center" :colspan="attributes.labels.length + (attributes.check_box ? 1 : 0)">
            No records available
          </td>
        </tr>
        <tr v-for="record in attributes.api_response.data" :key="record.id" v-else>
          <!-- for check box -->
          <td v-if="attributes.check_box" class="w-1 text-center">
            <input
              class="form-check-input rounded-1"
              type="checkbox"
              v-model="selectedRecords"
              :value="record.id"
              @change="onRowCheckboxChange"
            >
          </td>
          <td v-for="label in attributes.labels" :key="label.key" class="h-3rem">
            <slot :name="label.key" :record="record">
              {{ record[label.key] }}
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile View -->
    <div class="d-md-none p-3">
      <div class="row">
        <div v-if="attributes.loading">
          <div class="loader-container">
            <div class="loader"></div>
          </div>
        </div>
        <div v-else-if="Array.isArray(attributes.api_response.data) && !attributes.api_response.data.length" class="text-center">
          No records available
        </div>
        <div v-for="record in attributes.api_response.data" :key="record.id" v-else class="col-sm-6">
          <div class="p-3 mb-3 pb-1" style="background-color: #f0f0f178; border-radius: 4%">
            <div v-for="label in attributes.labels" :key="label.key" class="">
              <span class="fw-bold mb-2">{{ label.name }}</span><br/>
              <slot :name="label.key" :record="record">
                {{ record[label.key] }}
              </slot>
              <hr class="my-3"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Footer -->
    <div class="card-footer d-flex align-items-center row">
      <p class="m-0 fs-14 col-sm-6 mb-2 mb-sm-0">
        <span v-if="attributes.api_response.total === 0">
          Showing 0 to 0 of 0 entries
        </span>
        <span v-else>
          Showing <span>{{ attributes.api_response.from }}</span> to
          <span>{{ attributes.api_response.to }}</span> of
          <span>{{ attributes.api_response.total }}</span> entries
        </span>
      </p>
      <ul class="pagination gap-1 m-0 ms-auto col-sm-6 d-flex justify-content-sm-end">
        <li :class="[attributes.api_response.current_page <= 1 ? 'disabled' : '']" class="page-item">
          <a
              aria-disabled="true"
              class="page-link"
              href="#"
              tabindex="-1"
              @click.prevent="pageChange(attributes.api_response.current_page - 1)"
          >
            <i class="ti ti-chevron-left fs-3"></i>
          </a>
        </li>
        <li
            v-for="paginate_item in paginationGenerator(
            attributes.api_response.current_page,
            Math.ceil(attributes.api_response.total / attributes.api_response.per_page)
          )"
            :key="paginate_item"
            :class="[attributes.api_response.current_page === paginate_item ? 'active' : '']"
            class="page-item"
        >
          <a
              v-if="!isNaN(paginate_item)"
              class="page-link"
              href="#"
              @click.prevent="pageChange(paginate_item)"
          >
            {{ paginate_item }}
          </a>
          <p v-else class="page-link">{{ paginate_item }}</p>
        </li>
        <li
            :class="[
            attributes.api_response.current_page >=
            Math.ceil(attributes.api_response.total / attributes.api_response.per_page) ? 'disabled' : ''
          ]"
            class="page-item"
        >
          <a
              class="page-link"
              href="#"
              @click.prevent="pageChange(attributes.api_response.current_page + 1)"
          >
            <i class="ti ti-chevron-right fs-3"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  attributes: {
    type: Object,
    required: true
  }
})

// Define emits
const emit = defineEmits([
  'inputUpdates',
  'searchUpdate',
  'perPageUpdate',
  'sortChange',
  'pageChange'
])

// Reactive data
const tableData = ref({
  sort: { key: "", direction: false, sort_input: "" },
  per_page: 15,
  search: "",
  page: 1,
  pagination_array: []
})

const selectAll = ref(false);
const selectedRecords = ref([]);

// select all data
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRecords.value = props.attributes.api_response.data.map(r => r.id);
  } else {
    selectedRecords.value = [];
  }
};

// when individual check box change check is select all is check and data remove from array
const onRowCheckboxChange = () => {
  // if any check box is checked then uncheck select all checkbox
  if (selectedRecords.value.length !== props.attributes.api_response.data.length) {
    selectAll.value = false;
  } else if (selectedRecords.value.length === props.attributes.api_response.data.length) {
    selectAll.value = true;
  }
};


// Methods
const inputUpdates = () => {
  cacheInput()
  emit('inputUpdates', tableData.value)
}

const searchUpdate = () => {
  tableData.value.page = 1
  emit('searchUpdate', tableData.value.search)
  inputUpdates()
}

const perPageUpdate = () => {
  tableData.value.page = 1
  emit('perPageUpdate', tableData.value.per_page)
  inputUpdates()
}

const sortChange = (key) => {
  if (tableData.value.sort.key === key) {
    tableData.value.sort.direction = !tableData.value.sort.direction
  } else {
    tableData.value.sort.key = key
    tableData.value.sort.direction = true
  }

  let sort_direction = (tableData.value.sort.direction ? "-" : "") + tableData.value.sort.key
  tableData.value.sort.sort_input = sort_direction
  emit('sortChange', sort_direction)
  inputUpdates()
}

const pageChange = (page) => {
  tableData.value.page = page
  emit('pageChange', page)
  inputUpdates()
}

const cacheInput = () => {
  if (props.attributes.cache && process.client) {
    localStorage.setItem(props.attributes.table_id, JSON.stringify(tableData.value))
  } else if (process.client) {
    localStorage.removeItem(props.attributes.table_id)
  }
}

const paginationGenerator = (count, total_pages) => {
  const current = count
  const last = total_pages
  const delta = 2
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push("...")
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

// Lifecycle
onMounted(() => {
  if (process.client && localStorage.getItem(props.attributes.table_id)) {
    tableData.value = JSON.parse(localStorage.getItem(props.attributes.table_id))
  }
  inputUpdates()
})
</script>

<style scoped>
/* Loader styles */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fs-14 {
  font-size: 14px;
}

.h-3rem {
  height: 3rem;
}

.form-select-sm {
  padding: 0.25rem 1.75rem 0.25rem 0.5rem;
  font-size: 0.875rem;
  min-width: 80px;
}

/* Table styling to match the image */
.table {
  background-color: white;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  max-width: 100%;
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  color: #495057;
  padding: 12px 16px;
  font-size: 14px;
  text-transform: none;
  letter-spacing: normal;
}

.table tbody tr {
  border-bottom: 1px solid #f1f3f4;
}

.table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

.table tbody tr:nth-child(odd) {
  background-color: white;
}

.table tbody tr:hover {
  background-color: #f5f5f5 !important;
}

.table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  border-top: none;
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
}

/* Status dots/indicators */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-indicator::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Status colors based on the image */
.status-clinical::before {
  background-color: #17a2b8; /* Blue */
}

.status-approved::before {
  background-color: #28a745; /* Green */
}

.status-shipped::before {
  background-color: #6f42c1; /* Purple */
}

.status-cancelled::before {
  background-color: #6c757d; /* Gray */
}

/* Pagination styles to match the image */
.pagination {
  background-color: transparent;
  padding: 16px 0;
  border-top: none;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.page-item {
  margin: 0;
}

.page-link {
  color: #6c757d;
  background-color: transparent;
  border: none;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-link:hover {
  color: #495057;
  background-color: #f8f9fa;
  transform: none;
}

.page-item.active .page-link {
  color: white;
  background-color: rgba(57, 29, 24, 0.9);
  font-weight: 600;
}

.page-item.disabled .page-link {
  color: #adb5bd;
  background-color: transparent;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
}

/* Pagination arrows styling */
.page-link i {
  font-size: 12px;
}

/* Previous/Next button styling */
.page-item:first-child .page-link,
.page-item:last-child .page-link {
  padding: 8px 12px;
  font-size: 13px;
  gap: 4px;
}

/* Card footer pagination container */
.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-footer .pagination {
  margin: 0;
  padding: 0;
}

.card-footer p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

/* Pagination info styling */
.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 12px 16px;
}

.card-footer p {
  color: #6c757d;
  font-size: 14px;
}

/* Mobile card styling */
.d-md-none .card {
  border: 1px solid #dee2e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.d-md-none .card-body {
  padding: 16px;
}

/* Search and controls styling */
.card-body.border-bottom {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6 !important;
}

.form-control, .form-select {
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus, .form-select:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>