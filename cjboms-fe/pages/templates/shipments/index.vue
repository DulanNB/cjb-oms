<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Filter Tabs -->
          <div class="card mb-3">
            <div class="card-body py-2">
              <span class="text-muted me-3 fs-14 ">Filter By Order Type</span>
              <div class="d-flex align-items-center mt-3">
                <div class="d-flex gap-2 flex-wrap">
                  <button
                      v-for="tab in filterTabs"
                      :key="tab.key"
                      :class="[
                      'btn btn-sm rounded-pill d-flex align-items-center px-3 py-1',
                      activeTab === tab.key
                        ? 'border border-2 border-brown text-brown bg-white fw-medium shadow-none'
                        : 'border border-1 text-dark bg-white fw-normal shadow-none',
                      'filter-tab-btn'
                    ]"
                      @click="setActiveTab(tab.key)"
                  >
                    <i v-if="tab.icon"
                       :class="[tab.icon, 'me-2', activeTab === tab.key ? 'text-brown' : 'text-muted', 'tab-icon']"></i>
                    <span>{{ tab.label }} <span class="ms-1"
                                                :class="activeTab === tab.key ? 'text-brown' : 'text-muted'">{{
                        tab.count
                      }}</span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Form -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="row g-3">
                <!-- Clinic Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Clinic</label>
                  <select v-model="filters.clinic" class="form-select form-select-sm" @change="applyFilters">
                    <option value="">Select clinic</option>
                    <option value="hartley">Hartley Clinic</option>
                    <option value="sunnydale">Sunnydale Health</option>
                    <option value="riverside">Riverside Clinic</option>
                    <option value="pine_creek">Pine Creek Hos.</option>
                    <option value="hillside">Hillside Medical</option>
                    <option value="lakeside">Lakeside Clinic</option>
                    <option value="greenwood">Greenwood Ho.</option>
                  </select>
                </div>

                <!-- Delivery Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Delivery Type</label>
                  <select v-model="filters.deliveryType" class="form-select form-select-sm" @change="applyFilters">
                    <option value="">Select delivery type</option>
                    <option value="lable">Lable</option>
                    <option value="express">Express</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>

                <!-- Payment Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Payment Type</label>
                  <select v-model="filters.paymentType" class="form-select form-select-sm" @change="applyFilters">
                    <option value="">Select payment type</option>
                    <option value="credit">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <!-- Date Range Filter with v-calendar -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Created/Submitted Date</label>
                  <div class="custom-form-wrap">
                    <div class="form-field position-relative">
                      <v-date-picker
                          v-model="filters.dateRange"
                          :max-date="new Date()"
                          class="inline-block h-full"
                          is-range
                          @dayclick="selectDate"
                      >
                        <template v-slot="{ inputValue, togglePopover }">
                          <div class="w-100">
                            <input
                                :placeholder="'Select date range'"
                                :value="formatDateRange(inputValue)"
                                class="form-control form-control-sm date-range-input"
                                readonly
                                @click="togglePopover()"
                            />
                          </div>
                        </template>
                      </v-date-picker>
                      <span
                          v-if="filters.dateRange && filters.dateRange.start"
                          class="clear-date-icon"
                          @click="dateReset()"
                      >
                        <i class="fas fa-times"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Custom Reference ID Filter with FilterSearch -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Custom Reference ID</label>
                  <FilterSearch
                      ref="customRefSearchRef"
                      v-model="filters.customRefSelected"
                      :attributes="customRefAttributes"
                      :placeholder="'Enter Custom Reference ID'"
                      @queryUpdates="searchCustomRef"
                      @selectUpdates="selectCustomRef"
                  />
                </div>

                <!-- Reference ID / ODR ID / INV ID Filter with FilterSearch -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Reference ID / ODR ID / INV ID</label>
                  <FilterSearch
                      ref="referenceIdSearchRef"
                      v-model="filters.referenceIdSelected"
                      :attributes="referenceIdAttributes"
                      :placeholder="'Enter Reference ID / ODR ID / INV ID'"
                      @queryUpdates="searchReferenceId"
                      @selectUpdates="selectReferenceId"
                  />
                </div>
              </div>

              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-outline-primary btn-sm" @click="clearFilters">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Dispatched Orders Table -->
          <div class="card overflow-hidden">
            <div class="card-header">
              <h3 class="card-title">Dispatched Orders</h3>
            </div>

            <Table :attributes="dispatchedTableAttributes" class="mb-3" @inputUpdates="dispatchedInputUpdates">
              <template #patient_name="{ record }">
                <span>{{ record.patient_name }}</span>
              </template>

              <template #clinic="{ record }">
                <span>{{ record.clinic }}</span>
              </template>

              <template #order_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.order_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.order_date) }}</small>
                </div>
              </template>

              <template #dispatched_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.dispatched_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.dispatched_date) }}</small>
                </div>
              </template>

              <template #delivery_type="{ record }">
                <span>{{ record.delivery_type }}</span>
              </template>

              <template #odr_ref_id="{ record }">
                <span class="text-primary fw-medium">#{{ record.odr_ref_id }}</span>
              </template>

              <template #shipment_ref_id="{ record }">
                <span
                    class="text-primary fw-medium clickable-link"
                    @click="goToOrderDetail(record.odr_ref_id)"
                >
                  #{{ record.shipment_ref_id }}
                </span>
              </template>

              <template #shipment_total="{ record }">
                <span>{{ record.shipment_total }}</span>
              </template>

              <template #status="{ record }">
                <span class="status-badge status-approved">
                  <i class="status-dot"></i>
                  {{ record.status }}
                </span>
              </template>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterSearch from '~/components/FilterSearch.vue'

// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})

// Get runtime config for API URL
const config = useRuntimeConfig()
const csrfCookie = useCookie('XSRF-TOKEN')
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''

// Reactive state
const activeTab = ref('all')

const filterTabs = ref([
  {key: 'all', label: 'All', count: 0, icon: ''},
  {key: 'clinical_check', label: 'Clinical Check', count: 0, icon: 'ti ti-clipboard-check', class: 'outline'},
  {key: 'approved', label: 'Approved', count: 0, icon: 'ti ti-check', class: 'success'},
  {key: 'dispatched', label: 'Dispatched', count: 0, icon: 'ti ti-truck', class: 'warning'},
  {key: 'shipped', label: 'Shipped', count: 0, icon: 'ti ti-package', class: 'primary'},
  {key: 'held', label: 'Held', count: 0, icon: 'ti ti-hand-stop', class: 'secondary'},
  {key: 'cancelled', label: 'Cancelled', count: 0, icon: 'ti ti-x', class: 'danger'},
  {key: 'draft', label: 'Draft', count: 0, icon: 'ti ti-pencil', class: 'outline'}
])

// State mapping between frontend keys and backend state classes
const stateMapping = {
  'all': 'all',
  'clinical_check': 'clinical_check',
  'approved': 'approved',
  'dispatched': 'dispatched',
  'shipped': 'shipped',
  'held': 'held',
  'draft': 'draft',
  'cancelled': 'cancelled'
}

const filters = ref({
  clinic: '',
  deliveryType: '',
  paymentType: '',
  dateRange: null,
  customRefSelected: {},
  customRefQuery: '',
  referenceIdSelected: {},
  referenceIdQuery: ''
})

// Refs for FilterSearch components
const customRefSearchRef = ref(null)
const referenceIdSearchRef = ref(null)

// Custom Reference ID attributes
const customRefAttributes = ref({
  data: []
})

// Reference ID attributes
const referenceIdAttributes = ref({
  data: []
})

// Table attributes
const dispatchedTableAttributes = ref({
  table_id: "dispatched_orders_table",
  cache: false,
  loading: false,
  labels: [
    {key: "patient_name", name: "Patient Name", sort: true},
    {key: "clinic", name: "Clinic", sort: true},
    {key: "order_date", name: "Order Date", sort: true},
    {key: "dispatched_date", name: "Dispatched Date", sort: true},
    {key: "delivery_type", name: "Delivery Type", sort: true},
    {key: "odr_ref_id", name: "ODR REF ID", sort: false},
    {key: "shipment_ref_id", name: "Shipment REF ID", sort: false},
    {key: "shipment_total", name: "Shipment Total", sort: true},
    {key: "status", name: "Status", sort: true}
  ],
  api_response: {
    data: [],
    total: 0,
    from: 1,
    to: 0,
    current_page: 1,
    per_page: 15
  },
  filters: {},
  table_component_values: {},
})

// Delay timer for debouncing
let delayTimer = null

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
  const mappedState = stateMapping[tab] || tab
  if (mappedState === 'all') {
    delete dispatchedTableAttributes.value.filters['filter[state]']
  } else {
    dispatchedTableAttributes.value.filters['filter[state]'] = mappedState
  }
  fetchShipments()
}

const selectDate = () => {
  if (filters.value.dateRange && filters.value.dateRange.start && filters.value.dateRange.end) {
    const startDate = new Date(filters.value.dateRange.start)
    const endDate = new Date(filters.value.dateRange.end)
    
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    dispatchedTableAttributes.value.filters['filter[dates_between]'] = [
      formatDate(startDate),
      formatDate(endDate)
    ]
  }
  applyFilters()
}

const dateReset = () => {
  filters.value.dateRange = null
  delete dispatchedTableAttributes.value.filters['filter[dates_between]']
  applyFilters()
}

// Custom Reference ID Methods
const searchCustomRef = (query) => {
  filters.value.customRefQuery = query
  
  clearTimeout(delayTimer)
  delayTimer = setTimeout(() => {
    if (query && query.length > 0) {
      dispatchedTableAttributes.value.filters['filter[custom_reference_id]'] = query
    } else {
      delete dispatchedTableAttributes.value.filters['filter[custom_reference_id]']
      filters.value.customRefSelected = {}
    }
    applyFilters()
  }, 1000)
}

const selectCustomRef = (data) => {
  filters.value.customRefSelected = data
  if (data && data.value) {
    dispatchedTableAttributes.value.filters['filter[custom_reference_id]'] = data.value
  }
  applyFilters()
}

// Reference ID Methods
const searchReferenceId = (query) => {
  filters.value.referenceIdQuery = query
  
  clearTimeout(delayTimer)
  delayTimer = setTimeout(() => {
    if (query && query.length > 0) {
      dispatchedTableAttributes.value.filters['filter[reference_id]'] = query
    } else {
      delete dispatchedTableAttributes.value.filters['filter[reference_id]']
      filters.value.referenceIdSelected = {}
    }
    applyFilters()
  }, 1000)
}

const selectReferenceId = (data) => {
  filters.value.referenceIdSelected = data
  if (data && data.value) {
    dispatchedTableAttributes.value.filters['filter[reference_id]'] = data.value
  }
  applyFilters()
}

const applyFilters = () => {
  // Apply clinic filter
  if (filters.value.clinic) {
    dispatchedTableAttributes.value.filters['filter[clinic]'] = filters.value.clinic
  } else {
    delete dispatchedTableAttributes.value.filters['filter[clinic]']
  }
  
  // Apply delivery type filter
  if (filters.value.deliveryType) {
    dispatchedTableAttributes.value.filters['filter[delivery_type_id]'] = filters.value.deliveryType
  } else {
    delete dispatchedTableAttributes.value.filters['filter[delivery_type_id]']
  }
  
  fetchShipments()
}

const formatDateRange = (inputValue) => {
  if (!inputValue || !inputValue.start) return ''
  
  if (inputValue.start === inputValue.end) {
    return inputValue.start
  }
  
  return `${inputValue.start} - ${inputValue.end}`
}

const clearFilters = () => {
  const currentState = dispatchedTableAttributes.value.filters['filter[state]']
  
  filters.value = {
    clinic: '',
    deliveryType: '',
    paymentType: '',
    dateRange: null,
    customRefSelected: {},
    customRefQuery: '',
    referenceIdSelected: {},
    referenceIdQuery: ''
  }
  
  dispatchedTableAttributes.value.filters = {}
  if (currentState) {
    dispatchedTableAttributes.value.filters['filter[state]'] = currentState
  }
  
  // Clear FilterSearch inputs
  if (customRefSearchRef.value) {
    customRefSearchRef.value.clearInput()
  }
  if (referenceIdSearchRef.value) {
    referenceIdSearchRef.value.clearInput()
  }
  
  fetchShipments()
}

const formatOrderDate = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatOrderTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Transform backend data to match table structure
const transformShipmentData = (shipment) => {
  const firstOrder = shipment.order_cart?.orders?.[0]
  const patient = firstOrder?.patient
  
  return {
    id: shipment.id,
    patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'N/A',
    clinic: shipment.order_cart?.clinic?.name || 'N/A',
    order_date: shipment.created_at,
    dispatched_date: shipment.updated_at,
    delivery_type: shipment.delivery_type?.name || 'N/A',
    odr_ref_id: shipment.order_cart?.reference_id || 'N/A',
    shipment_ref_id: shipment.reference_id,
    shipment_total: shipment.order_cart?.total || 0,
    status: shipment.state.charAt(0).toUpperCase() + shipment.state.slice(1),
    custom_ref_id: firstOrder?.custom_reference_id
  }
}

// Fetch shipments from backend
const fetchShipments = async (page = 1, per_page = 15, sort = '', search = '') => {
  try {
    dispatchedTableAttributes.value.loading = true
    
    const params = {
      per_page: Math.min(per_page, 200),
      page,
      ...(sort && {sort}),
      ...(search && {'filter[search]': search}),
      ...dispatchedTableAttributes.value.filters
    }
    

    const response = await $fetch('/api/admin/shipments', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      params
    })
    
    // Transform the data
    const transformedData = response.data.map(transformShipmentData)
    
    dispatchedTableAttributes.value.api_response = {
      data: transformedData,
      total: response.meta.total,
      from: response.meta.from,
      to: response.meta.to,
      current_page: response.meta.current_page,
      per_page: response.meta.per_page
    }
    
    // Update tab counts (you may need a separate endpoint for this)
    updateTabCounts()
    
  } catch (error) {
    console.error('Error fetching shipments:', error)
    // Handle error appropriately
  } finally {
    dispatchedTableAttributes.value.loading = false
  }
}

// Update tab counts (you'll need to implement the backend endpoint for counts)
const updateTabCounts = async () => {
  try {
    // You may need to create a separate endpoint for counts
    // For now, this is a placeholder
    const counts = await $fetch('/api/admin/shipments/count', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    }).catch(() => null)
    console.log('Counts response:', counts)
    
    if (counts && counts.data) {
      filterTabs.value.forEach(tab => {
        const mappedState = stateMapping[tab.key]
        if (mappedState) {
          tab.count = counts.data[mappedState] || 0
        }
      })
    }
  } catch (error) {
    console.error('Error fetching counts:', error)
  }
}

const dispatchedInputUpdates = (values) => {
  dispatchedTableAttributes.value.table_component_values = values
  fetchShipments(
      values.page,
      values.per_page,
      values.sort?.sort_input || '',
      values.search || ''
  )
}

const router = useRouter()

const goToOrderDetail = (odr_ref_id) => {
  let id = odr_ref_id.replace(/^#/, '')
  id = id.replace(/^ODR-/, '') 
  router.push(`/templates/shipments/${id}`)
}

// Set page title and meta for Nuxt 3
useHead({
  title: 'Shipments Management',
  meta: [
    {name: 'description', content: 'Manage and track shipments across different statuses'}
  ]
})

// Load initial data
onMounted(() => {
  updateTabCounts(),
  fetchShipments()
})
</script>

<style scoped>
/* Custom styles for pixel-perfect design */
.fs-13 {
  font-size: 13px;
}

.fs-14 {
  font-size: 14px;
}

/* Tab button styling */
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
}

.btn .badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Active tab badge styling */
.btn-success .badge,
.btn-warning .badge,
.btn-primary .badge,
.btn-secondary .badge,
.btn-danger .badge {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Form styling */
.form-select-sm,
.form-control-sm {
  font-size: 13px;
  padding: 6px 8px;
}

.input-group-sm .btn {
  padding: 6px 12px;
}

/* Status badge styling */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-approved .status-dot {
  background-color: #28a745;
}

/* Table header styling */
.card-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

/* Table cell styling */
.table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  font-size: 13px;
}

.text-primary {
  color: #0066cc !important;
  font-weight: 500;
}

/* Filter form styling */
.card-body {
  padding: 16px;
}

.form-label {
  margin-bottom: 4px;
  font-weight: 500;
}

/* Button styling */
.btn-outline-primary {
  border-color: #dee2e6;
  color: #6c757d;
}

.btn-outline-primary:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

/* Input group styling */
.input-group .btn-outline-secondary {
  border-color: #ced4da;
  color: #6c757d;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
}

/* Filter Tabs */
.filter-tab-btn {
  transition: border-color 0.2s, color 0.2s;
  border-radius: 999px !important;
  background: #fff;
  border: 1.5px solid #bdbdbd;
  box-shadow: none;
  font-size: 15px;
  min-width: 110px;
}

.tab-icon {
  font-size: 18px;
}

.border-brown {
  border-color: #7c5a3a !important;
}

.text-brown {
  color: #7c5a3a !important;
}

/* Date Range Picker Styles */
.custom-form-wrap {
  position: relative;
}

.form-field {
  position: relative;
  display: flex;
  align-items: center;
}

.date-range-input {
  cursor: pointer;
}

.clear-date-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  font-size: 14px;
  z-index: 10;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

.clear-date-icon:hover {
  color: #495057;
  background: #f8f9fa;
}

.form-field input {
  padding-right: 35px !important;
}

/* Clickable link styling */
.clickable-link {
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.gap-2.flex-wrap {
    gap: 8px !important;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
  }
}

/* Card and table basic styling */
.card .table {
  margin-bottom: 0;
}

/* Better link styling */
.text-primary.fw-medium {
  color: #0066cc !important;
  font-weight: 500 !important;
  text-decoration: none;
}

.text-primary.fw-medium:hover {
  text-decoration: underline;
}
</style>