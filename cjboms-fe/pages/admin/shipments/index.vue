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
                  <label class="form-label text-muted fs-4 mb-1 fw-semibold">Clinic</label>
                  <div class="input-icon">
                    <Select
                      ref="clinicSearchRef"
                      :attributes="clinics"
                      :placeholder="'Select clinic'"
                      @selectUpdates="selectClinic"
                    />
                    <span class="input-icon-addon">
                      <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                        fill="none"/><path d="M6 9l6 6l6 -6" />
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Delivery Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-4 mb-1 fw-semibold">Delivery Type</label>
                  <div class="input-icon">
                    <Select
                      ref="deliveryTypeSearchRef"
                      :attributes="deliveryTypes"
                      :placeholder="'Select delivery type'"
                      @selectUpdates="selectDeliveryType"
                    />
                    <span class="input-icon-addon">
                      <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                        fill="none"/><path d="M6 9l6 6l6 -6" />
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Payment Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-4 mb-1 fw-semibold">Payment Type</label>
                  <div class="input-icon">
                    <Select
                      ref="paymentTypeSearchRef"
                      :attributes="paymentTypeData"
                      :placeholder="'Select payment type'"
                      @selectUpdates="selectPaymentType"
                    />
                    <span class="input-icon-addon">
                      <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                        class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                        fill="none"/><path d="M6 9l6 6l6 -6" />
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Date Range Filter with v-calendar -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-4 mb-1 fw-semibold">Created/Submitted Date</label>
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
                            <div class="input-icon">
                              <input
                                  :placeholder="'Select date range'"
                                  :value="formatDateRange(inputValue)"
                                  class="form-control form-control-sm date-range-input"
                                  readonly
                                  @click="togglePopover()"
                              />
                              <span class="input-icon-addon">
                                <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" 
                                  class="icon icon-tabler icons-tabler-filled icon-tabler-calendar"><path stroke="none" d="M0 0h24v24H0z" 
                                  fill="none"/>
                                  <path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 
                                  -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 
                                  1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 
                                  .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z" />
                                  <path d="M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
                                </svg>
                              </span>
                            </div>
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

                <!-- Reference ID / ODR ID / INV ID Filter with FilterSearch -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-4 mb-1 fw-semibold">Shipment REF ID</label>
                  <div class="input-icon">
                    <FilterSearch
                        ref="referenceIdSearchRef"
                        v-model="filters.referenceIdSelected"
                        :attributes="referenceIdAttributes"
                        :placeholder="'Shipment REF ID'"
                        @queryUpdates="searchReferenceId"
                        @selectUpdates="selectReferenceId"
                    />
                    <span class="input-icon-addon">
                      <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M21 21l-6 -6"></path>
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="col-auto d-flex justify-content-end align-items-end ms-auto">
                  <button class="btn clear-filter-btn" @click="clearFilters">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Dispatched Orders Table -->
          <div class="card overflow-hidden">
            <div class="card-header">
              <h3 class="card-title">{{ displayTab }} Orders</h3>
            </div>

            <Table :attributes="dispatchedTableAttributes" class="mb-3" @inputUpdates="dispatchedInputUpdates">
              <template #shipment_ref_id="{ record }">
                <span
                    class="text-primary fw-medium clickable-link"
                    @click="goToOrderDetail(record.id)"
                >
                  {{ record.shipment_ref_id }}
                </span>
              </template>

              <template #patient_name="{ record }">
                <span
                    class="text-primary fw-medium clickable-link"
                    @click="goToPatientDetails(record.id)"
                >
                  {{ truncateText(record.patient_name) }}
                </span>
              </template>

              <template #clinic="{ record }">
                <span>{{ record.clinic }}</span>
              </template>

              <template #created_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.created_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.created_date) }}</small>
                </div>
              </template>

              <template #submitted_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.submitted_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.submitted_date) }}</small>
                </div>
              </template>
              
              <template #approved_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.approved_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.approved_date) }}</small>
                </div>
              </template>
              
              <template #dispatched_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.dispatched_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.dispatched_date) }}</small>
                </div>
              </template>
              
              <template #shipped_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.shipped_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.shipped_date) }}</small>
                </div>
              </template>
              
              <template #cancelled_date="{ record }">
                <div class="text-center">
                  <div class="fw-bold">{{ formatOrderDate(record.cancelled_date) }}</div>
                  <small class="text-muted">{{ formatOrderTime(record.cancelled_date) }}</small>
                </div>
              </template>

              <template #delivery_type="{ record }">
                <span>{{ record.delivery_type }}</span>
              </template>
              
              <template #shipment_total="{ record }">
                <span>£{{ record.shipment_total }}</span>
              </template>

              <template #status="{ record }">
                <span class="status-badge">
                  <span :class="['status-dot', getStateColor(record.status)]"></span>
                  {{ formatShipmentState(record.status) }}
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
import { state_with_colors, payment_type } from '~/constants/constants.js'

// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})

// Get runtime config for API URL
const config = useRuntimeConfig()
const csrfCookie = useCookie('XSRF-TOKEN')
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''
const route = useRoute()

// Reactive state
const activeTab = ref('all')
const displayTab = ref('All')

const filterTabs = ref([
  {key: 'all', label: 'All', count: 0, icon: ''},
  {key: 'clinicalCheck', label: 'Clinical Check', count: 0, icon: 'ti ti-clipboard-check', class: 'outline'},
  {key: 'approved', label: 'Approved', count: 0, icon: 'ti ti-check', class: 'success'},
  {key: 'dispatched', label: 'Dispatched', count: 0, icon: 'ti ti-truck', class: 'warning'},
  {key: 'shipped', label: 'Shipped', count: 0, icon: 'ti ti-package', class: 'primary'},
  {key: 'held', label: 'Held', count: 0, icon: 'ti ti-hand-stop', class: 'secondary'},
  {key: 'cancelled', label: 'Cancelled', count: 0, icon: 'ti ti-x', class: 'danger'}
])

// State mapping between frontend keys and backend state classes
const stateMapping = {
  'all': 'all',
  'clinicalCheck': 'clinicalCheck',
  'approved': 'approved',
  'dispatched': 'dispatched',
  'shipped': 'shipped',
  'held': 'held',
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
const clinicSearchRef = ref(null);
const deliveryTypeSearchRef = ref(null);
const paymentTypeSearchRef = ref(null);
const customRefSearchRef = ref(null)
const referenceIdSearchRef = ref(null)

// for select component 
const clinics = ref({
  data: [],
  selected: null
})
const deliveryTypes = ref({
  data: [],
  selected: null
})
const paymentTypeData = ref({
  data: payment_type,
  selected: null
})

// Custom Reference ID attributes
const customRefAttributes = ref({
  data: []
})

// Reference ID attributes
const referenceIdAttributes = ref({
  data: []
})

// base columns for table
const baseColumns = [
  { key: "shipment_ref_id", name: "Shipment REF ID", sort: false },
  { key: "patient_name", name: "Patient Name", sort: true },
  { key: "clinic", name: "Clinic", sort: true },
  { key: "created_date", name: "Created Date", sort: true },
  { key: "submitted_date", name: "Submitted Date", sort: true },
  { key: "delivery_type", name: "Delivery Type", sort: true },
  { key: "shipment_total", name: "Shipment Total", sort: true },
  { key: "status", name: "Status", sort: true },
]

// state date recorder columns
const stateDateColumns = {
  Approved: { key: "approved_date", name: "Approved Date", sort: true },
  Dispatched: { key: "dispatched_date", name: "Dispatched Date", sort: true },
  Shipped: { key: "shipped_date", name: "Shipped Date", sort: true },
  Cancelled: { key: "cancelled_date", name: "Cancelled Date", sort: true },
}

// Table attributes
const dispatchedTableAttributes = ref({
  table_id: "dispatched_orders_table",
  cache: false,
  loading: false,
  labels: [...baseColumns], // initially add base columns

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

//truncate the text
const truncateText = (text) => {
    if (text && typeof text === 'string') {
        return text.length > 10 ? text.substring(0, 10) + '...' : text;
    }
    return '';
}

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
  
  // display tab name in table
  const found = filterTabs.value.find(item => item.key === tab);
  displayTab.value = found ? found.label : 'All';

  // reset labels
  dispatchedTableAttributes.value.labels = [...baseColumns];

  // get the submitted date index in labels
  const submittedIndex = dispatchedTableAttributes.value.labels.findIndex(
    col => col.key === 'submitted_date'
  )

  // add state date recorded column after that submitted date column
  if (stateDateColumns[displayTab.value] && submittedIndex !== -1) {
    dispatchedTableAttributes.value.labels.splice(
      submittedIndex + 1,
      0,
      stateDateColumns[displayTab.value]
    );
  }

  const mappedState = stateMapping[tab] || tab
  if (mappedState === 'all') {
    delete dispatchedTableAttributes.value.filters['filter[state]']
  } else {
    dispatchedTableAttributes.value.filters['filter[state]'] = mappedState
  }
  fetchShipments()
}

// get the state background color
const getStateColor = (state) => {
  if (!state) return "";
  const match = state_with_colors.find((x) => x.text === state);
  return match ? `bg-${match.color}-100` : "";
}

// format the shipment state
const formatShipmentState = (state) => {
  if (!state) return "";

  // format lowercase states
  if (state === state.toLowerCase()) {
    return state.charAt(0).toUpperCase() + state.slice(1);
  }

  // format camelCase state
  return state.replace(/([A-Z])/g, " $1") 
              .replace(/^./, (str) => str.toUpperCase()); 
};

const selectDate = () => {
  if (filters.value.dateRange && filters.value.dateRange.start && filters.value.dateRange.end) {
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    const startDate = formatDate(filters.value.dateRange.start)
    const endDate = formatDate(filters.value.dateRange.end)
    
    // Set the filter as an array, not object
    dispatchedTableAttributes.value.filters['filter[dates_between]'] = [startDate, endDate]
    
    // Apply filters after setting
    fetchShipments()
  }
}

const dateReset = () => {
  filters.value.dateRange = {
    start: null,
    end: null
  }
  delete dispatchedTableAttributes.value.filters['filter[dates_between]']
  fetchShipments() 
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

// select clinic id for filtering
const selectClinic = (selectedClinic) => {
  filters.value.clinic = selectedClinic.id;
  applyFilters();
}

// select delivery type id for filtering
const selectDeliveryType = (selectedDeliveryType) => {
  filters.value.deliveryType = selectedDeliveryType.id;
  applyFilters();
}

// select delivery type id for filtering
const selectPaymentType = (selectedPaymentType) => {
  // still payment type values are not store in the database
  applyFilters();
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
    dateRange: {
      start: null,
      end: null
    },
    customRefSelected: {},
    customRefQuery: '',
    referenceIdSelected: {},
    referenceIdQuery: ''
  }
  
  dispatchedTableAttributes.value.filters = {}
  if (currentState && currentState !== 'all') {
    dispatchedTableAttributes.value.filters['filter[state]'] = currentState
  }
  
  // Clear FilterSearch inputs
  if (customRefSearchRef.value) {
    customRefSearchRef.value.clearInput()
  }
  if (referenceIdSearchRef.value) {
    referenceIdSearchRef.value.clearInput()
  }
  // reset select component from the child component
  clinicSearchRef.value.reset();
  deliveryTypeSearchRef.value.reset();
  paymentTypeSearchRef.value.reset();
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
    created_date: shipment.created_at,
    submitted_date: shipment.updated_at,
    approved_date: shipment.approved_date,
    dispatched_date: shipment.dispatched_date,
    shipped_date: shipment.shipped_date,
    cancelled_date: shipment.cancelled_date,
    delivery_type: shipment.delivery_type?.name || 'N/A',
    odr_ref_id: shipment.order_cart?.reference_id || 'N/A',
    shipment_ref_id: shipment.reference_id,
    shipment_total: shipment.price || 0,
    status: shipment.state,
    custom_ref_id: firstOrder?.custom_reference_id
  }
}

// get clinics data for the dropdown
const getClinicsData = async () => {
  try {
      const response = await $fetch('/api/admin/clinics', {
        method: 'GET',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      // format clinic data for select component
      clinics.value.data = response.data.map((item) => ({
        name: item.name,
        id: item.id,
        state: item.state
      }));
  } catch (error)
  {
    if ($toast) {
      $toast.error('Failed to fetch clinics data.');
    }
  }
}

// Fetch shipments from backend
const fetchShipments = async (page = 1, per_page = 15, sort = '', search = '') => {
  try {
    dispatchedTableAttributes.value.loading = true
    
    // Build params object
    const params = {
      per_page: Math.min(per_page, 200),
      page,
      ...(sort && {sort}),
      ...(search && {'filter[search]': search}),
    }
    
    // Add filters to params
    Object.keys(dispatchedTableAttributes.value.filters).forEach(key => {
      const value = dispatchedTableAttributes.value.filters[key]
      
      // Special handling for dates_between array
      if (key === 'filter[dates_between]' && Array.isArray(value)) {
        params['filter[dates_between][0]'] = value[0]
        params['filter[dates_between][1]'] = value[1]
      } else {
        params[key] = value
      }
    })

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
    
    // Update tab counts
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
  // check is there have any state in history
  const state = history.state?.tab;
  // if there have state then call for that state data or then fetch data with out state
  if (state){
    setActiveTab(state);
    // replace the state from the history
    history.replaceState(null, '', location.href);
  } else {
    dispatchedTableAttributes.value.table_component_values = values
    fetchShipments(
        values.page,
        values.per_page,
        values.sort?.sort_input || '',
        values.search || ''
    )
  }
}

const router = useRouter()

const goToOrderDetail = (id) => {

  router.push(`/admin/shipments/${id}`)
}

// navigate to patient details page
const goToPatientDetails = (id) => {
  router.push(`/admin/patients/${id}`);
  // store state for when we back from patient tab
  history.replaceState({ tab: activeTab.value }, '', location.href);
}

// Fetch delivery types from backend
const fetchDeliveryTypes = async () => {
  try {
    const response = await $fetch('/api/admin/delivery-types', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    })
    
    if (response && response.data) {
      // format delivery type data for select component
      deliveryTypes.value.data = response.data.map((deliveryType) => ({
        name: deliveryType.name,
        id: deliveryType.id,
        state: deliveryType.is_active == 1 ? 'active' : 'inactive'
      }));
    }
  } catch (error) {
    console.error('Error fetching delivery types:', error)
    // Handle error appropriately - maybe show a toast notification
  }
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
  getClinicsData();
  fetchDeliveryTypes();
})
</script>

<style scoped>
/* Custom styles for pixel-perfect design */
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