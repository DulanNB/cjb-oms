<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Header -->
          <div class="header-section bg-white border-bottom p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <button class="btn btn-link p-0 me-2" @click="goBack">
                  <i class="ti ti-arrow-left fs-20"></i>
                </button>
                <h1 class="page-title mb-0">Shipment</h1>
              </div>
              <button class="btn btn-outline-secondary btn-sm">
                View Activity Log
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading shipment details...</p>
          </div>

          <!-- Content when loaded -->
          <div v-else-if="shipmentData" class="row">
            <!-- Left Column - Patient & Delivery Info / Dispatch Form -->
            <div class="col-lg-8">
              <!-- Show Patient & Delivery Info when not in dispatch mode -->
              <div v-if="!showDispatchForm">
                <!-- Patient Information Component -->
                <PatientInformationCard :patient-info="patientInfo" />

                <!-- Delivery Address & Prescriptions Component -->
                <DeliveryPrescriptionsCard
                    :delivery-address="deliveryAddress"
                    :delivery-type="deliveryType"
                    @update:deliveryType="deliveryType = $event"
                    :prescription-table-attributes="prescriptionTableAttributes"
                    @prescription-input-updates="prescriptionInputUpdates"
                    @view-prescription="viewPrescription"
                />
              </div>

              <!-- Dispatch Form with Tabs -->
              <div v-else>
                <DispatchFormTabs
                    :patient-info="patientInfo"
                    :delivery-address="deliveryAddress"
                    :delivery-type="deliveryType"
                    @update:deliveryType="deliveryType = $event"
                    :all-prescriptions-data="allPrescriptionsData"
                    :active-tab="activeDispatchTab"
                    @update:activeTab="activeDispatchTab = $event"
                    :dispatch-form-data="dispatchFormData"
                    @update:dispatchFormData="dispatchFormData = $event"
                    @view-prescription="viewPrescription"
                />
              </div>
            </div>

            <!-- Right Column - Order Details -->
            <div class="col-lg-4">
              <!-- Order Details Component -->
              <OrderDetailsCard
                  :order-details="orderDetails"
                  :order-summary="orderSummary"
              />

              <!-- Action Buttons Component -->
              <ActionButtonsCard
                  :show-approve-options="showApproveOptions"
                  :show-dispatch-form="showDispatchForm"
                  :show-confirm-shipment="showConfirmShipment"
                  :show-reverse-held="showReverseHeld"
                  @hold-order="holdOrder"
                  @cancel-order="cancelOrder"
                  @approve="showApproveOptions = true"
                  @disapprove="disapproveOrder"
                  @dispatch="dispatchOrder"
                  @reverse-dispatch="reverseDispatch"
                  @continue-shipment="continueToShipment"
                  @confirm-shipment="confirmShipment"
                  @reverse-held="reverseHeld"
              />
            </div>
          </div>

          <!-- Error State -->
          <div v-else class="text-center py-5">
            <div class="alert alert-danger">
              <h4>Error Loading Shipment</h4>
              <p>Unable to load shipment details. Please try again.</p>
              <button class="btn btn-primary" @click="fetchShipmentData">Retry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define layout for Nuxt 3
import PatientInformationCard from "~/components/shipments/PatientInformationCard.vue";
import DeliveryPrescriptionsCard from "~/components/shipments/DeliveryPrescriptionsCard.vue";
import DispatchFormTabs from "~/components/shipments/DispatchFormTabs.vue";
import OrderDetailsCard from "~/components/shipments/OrderDetailsCard.vue";
import ActionButtonsCard from "~/components/shipments/ActionButtonsCard.vue";

definePageMeta({
  layout: 'dashboard-admin'
})

// Get runtime config for API URL
const config = useRuntimeConfig()
const csrfCookie = useCookie('XSRF-TOKEN')
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''

// Get route parameters
const route = useRoute()
const shipmentId = route.params.id

// Loading state
const loading = ref(true)
const shipmentData = ref(null)

// Reactive state for patient information
const patientInfo = ref({
  name: '',
  email: '',
  clinic: '',
  dateOfBirth: '',
  registeredDate: ''
})

// Show approve options state
const showApproveOptions = ref(false)
const showDispatchForm = ref(false)
const showConfirmShipment = ref(false)
const showReverseHeld = ref(false)

// Active tab state for dispatch form
const activeDispatchTab = ref('general')

// Dispatch form data
const dispatchFormData = ref({
  services: '',
  weight: '',
  customsValue: '',
  collectionDate: ''
})

// Delivery address information
const deliveryAddress = ref({
  recipient: '',
  address: '',
  street: '',
  city: ''
})

// Delivery type selection
const deliveryType = ref({})

// Prescriptions data from API
const allPrescriptionsData = ref([])

// Table attributes for prescriptions
const prescriptionTableAttributes = ref({
  table_id: "prescriptions_table",
  cache: false,
  loading: false,
  labels: [
    { key: "orderId", name: "Order ID", sort: false },
    { key: "customReference", name: "Custom Reference", sort: false },
    { key: "orderType", name: "Order Type", sort: false },
    { key: "prescription", name: "Prescription", sort: false },
    { key: "actions", name: "Actions", sort: false }
  ],
  api_response: {
    data: [],
    total: 0,
    from: 1,
    to: 0,
    current_page: 1,
    per_page: 10
  },
  filters: {},
  table_component_values: {},
})

// Order details
const orderDetails = ref({
  orderDate: '',
  submittedDate: '',
  orderReference: '',
  clinic: '',
  shipmentStatus: '',
  customReference: '',
  paymentStatus: '',
  paymentTransactionId: '',
  paymentType: ''
})

// Order summary
const orderSummary = ref({
  itemTotal: '0.00',
  deliveryFee: '0.00',
  tax: '0.00',
  total: '0.00'
})

// Fetch shipment data from API
const fetchShipmentData = async () => {
  try {
    loading.value = true
    
    const response = await $fetch(`/api/admin/shipments/${shipmentId}`, {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    })
    
    if (response && response.data) {
      shipmentData.value = response.data
      populateComponentData(response.data)
    }
    
  } catch (error) {
    console.error('Error fetching shipment data:', error)
    // Handle error appropriately - maybe redirect back or show error message
  } finally {
    loading.value = false
  }
}

// Populate component data from API response
const populateComponentData = (data) => {
  // Patient Information
  const patient = data.order_cart?.orders?.[0]?.patient
  if (patient) {
    const age = calculateAge(patient.date_of_birth)
    patientInfo.value = {
      name: `${patient.first_name} ${patient.last_name} (${age} years)`,
      email: patient.email,
      clinic: data.order_cart?.clinic?.name || 'N/A',
      dateOfBirth: formatDate(patient.date_of_birth),
      registeredDate: formatDate(patient.created_at)
    }
  }
  
  // Delivery Information
  deliveryAddress.value = {
    recipient: data.delivery_name || patient?.first_name + ' ' + patient?.last_name || 'N/A',
    address: data.delivery_address_line_1 || 'N/A',
    street: data.delivery_address_line_2 || '',
    city: `${data.delivery_city || ''}, ${data.delivery_post_code || ''}`.trim()
  }
  
  // Delivery Type
  if (data.delivery_type) {
    deliveryType.value = data.delivery_type
  }
  
  // Order Details
  orderDetails.value = {
    orderDate: formatDateTime(data.created_at),
    submittedDate: formatDateTime(data.updated_at),
    orderReference: data.reference_id,
    clinic: data.order_cart?.clinic?.name || 'N/A',
    shipmentStatus: capitalizeFirst(data.state),
    customReference: data.order_cart?.orders?.[0]?.custom_reference_id || 'N/A',
    paymentStatus: 'N/A', // Not provided in API
    paymentTransactionId: 'N/A', // Not provided in API
    paymentType: data.order_cart?.payment_method || 'N/A'
  }
  
  // Order Summary
  orderSummary.value = {
    itemTotal: (data.order_cart?.total || 0).toFixed(2),
    deliveryFee: (data.delivery_type?.price || 0).toFixed(2),
    tax: '0.00', // Not provided in API
    total: ((data.order_cart?.total || 0) + (data.delivery_type?.price || 0)).toFixed(2)
  }

  
  // Prescriptions/Orders Data
  if (data.order_cart?.orders) {
    allPrescriptionsData.value = data.order_cart.orders.map(order => {
      console.log('Order data:', order)
      return {
        id: order.id, 
        orderId: order.id,
        customReference: order.reference_id,
        orderType: capitalizeFirst(order.order_type),
        prescription: 'Prescription PDF' // Placeholder as not provided in API
      }
    })
  }
}

// Helper functions
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A'
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const capitalizeFirst = (str) => {
  if (!str) return 'N/A'
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Methods
const goBack = () => {
  window.history.back()
}

const viewPrescription = (prescription) => {
  console.log('Viewing prescription:', prescription)
}

const holdOrder = () => {
  console.log('Hold order action')
}

const cancelOrder = () => {
  console.log('Cancel order action')
}

const disapproveOrder = () => {
  console.log('Disapprove order action')
  showApproveOptions.value = false
}

const dispatchOrder = () => {
  console.log('Dispatch order action')
  showDispatchForm.value = true
  showApproveOptions.value = false
  activeDispatchTab.value = 'general'
}

const reverseDispatch = () => {
  console.log('Reverse dispatch action')
  showDispatchForm.value = false
  showApproveOptions.value = false
  showConfirmShipment.value = false
  showReverseHeld.value = false
  dispatchFormData.value = {
    services: '',
    weight: '',
    customsValue: '',
    collectionDate: ''
  }
}

const continueToShipment = () => {
  console.log('Continue to shipment action', dispatchFormData.value)
  activeDispatchTab.value = 'shipment'
  showConfirmShipment.value = true
}

const confirmShipment = () => {
  console.log('Confirm shipment action', dispatchFormData.value)
  showDispatchForm.value = false
  showConfirmShipment.value = false
  showReverseHeld.value = true
}

const reverseHeld = () => {
  console.log('Reverse held action')
  showDispatchForm.value = false
  showApproveOptions.value = false
  showConfirmShipment.value = false
  showReverseHeld.value = false
  dispatchFormData.value = {
    services: '',
    weight: '',
    customsValue: '',
    collectionDate: ''
  }
}

const updatePrescriptionTableData = (page = 1, per_page = 10, sort = "", search = "") => {
  let data = [...allPrescriptionsData.value]

  if (search) {
    data = data.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
    )
  }

  if (sort) {
    const isDesc = sort.startsWith('-')
    const sortKey = isDesc ? sort.substring(1) : sort

    data.sort((a, b) => {
      let aVal = a[sortKey] || ''
      let bVal = b[sortKey] || ''

      if (aVal < bVal) return isDesc ? 1 : -1
      if (aVal > bVal) return isDesc ? -1 : 1
      return 0
    })
  }

  const total = data.length
  const from = (page - 1) * per_page + 1
  const to = Math.min(page * per_page, total)
  const paginatedData = data.slice((page - 1) * per_page, page * per_page)

  prescriptionTableAttributes.value.api_response = {
    data: paginatedData,
    total,
    from: total > 0 ? from : 0,
    to,
    current_page: page,
    per_page: parseInt(per_page)
  }
}

const prescriptionInputUpdates = (values) => {
  prescriptionTableAttributes.value.table_component_values = values
  updatePrescriptionTableData(
      values.page,
      values.per_page,
      values.sort.sort_input,
      values.search
  )
}

useHead({
  title: 'Shipment Details',
  meta: [
    { name: 'description', content: 'View and manage shipment details' }
  ]
})

// Load data when component mounts
onMounted(() => {
  fetchShipmentData()
  updatePrescriptionTableData()
})
</script>

<style scoped>
.fs-20 {
  font-size: 20px;
}

.header-section {
  background-color: #ffffff !important;
  border-bottom: 1px solid #dee2e6 !important;
  margin: 0 -20px 0 -20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
}

.btn-link {
  color: #6c757d;
  text-decoration: none;
  padding: 4px;
}

.btn-link:hover {
  color: #495057;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
  font-size: 13px;
  padding: 6px 12px;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}
</style>