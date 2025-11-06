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
              <button class="btn btn-outline-secondary btn-sm" @click="viewActivityLog">
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
            <div class="col-lg-8">
              <div v-if="!showDispatchForm">
                <PatientInformationCard :patient-info="patientInfo" />

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
                    ref="dispatchFormTabsRef"
                    :patient-info="patientInfo"
                    :delivery-address="deliveryAddress"
                    :delivery-type="deliveryType"
                    @update:deliveryType="deliveryType = $event"
                    :all-prescriptions-data="allPrescriptionsData"
                    :active-tab="activeDispatchTab"
                    @update:activeTab="activeDispatchTab = $event"
                    :dispatch-form-data="dispatchFormData"
                    @update:dispatchFormData="dispatchFormData = $event"
                    :prescription-table-attributes="prescriptionTableAttributes"
                    @prescription-input-updates="prescriptionInputUpdates"
                    @view-prescription="viewPrescription"
                    :delivery-types="deliveryTypes"
                    :loading-delivery-types="loadingDeliveryTypes"
                    @shipment-tab-ref="shipmentTabRef = $event"
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
                  :shipment-status="orderDetails.shipmentStatus"
                  :show-approve-options="showApproveOptions"
                  :show-dispatch-form="showDispatchForm"
                  :show-confirm-shipment="showConfirmShipment"
                  :show-reverse-held="showReverseHeld"
                  @hold-order="holdOrder"
                  @cancel-order="cancelOrder"
                  @approve="approveOrder"
                  @disapprove="disapproveOrder"
                  @dispatch="dispatchOrder"
                  @reverse-dispatch="reverseDispatch"
                  @continue-shipment="continueToShipment"
                  @proceed-to-shipment="proceedToShipment"
                  @confirm-shipment="confirmShipment"
                  @reverse-held="reverseHeld"
                  @reverse-cancel="reverseCancel"
                  @reverse-approve="reverseApprove"
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
import PatientInformationCard from "~/components/shipments/PatientInformationCard.vue";
import DeliveryPrescriptionsCard from "~/components/shipments/DeliveryPrescriptionsCard.vue";
import DispatchFormTabs from "~/components/shipments/DispatchFormTabs.vue";
import OrderDetailsCard from "~/components/shipments/OrderDetailsCard.vue";
import ActionButtonsCard from "~/components/shipments/ActionButtonsCard.vue";

definePageMeta({
  layout: 'dashboard-admin'
})

const config = useRuntimeConfig()
const csrfCookie = useCookie('XSRF-TOKEN')
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''

const route = useRoute()
const shipmentId = route.params.id

const loading = ref(true)
const shipmentData = ref(null)

const patientInfo = ref({
  name: '',
  email: '',
  clinic: '',
  dateOfBirth: '',
  registeredDate: ''
})

const showApproveOptions = ref(false)
const showDispatchForm = ref(false)
const showConfirmShipment = ref(false)
const showReverseHeld = ref(false)

const activeDispatchTab = ref('general')

const dispatchFormData = ref({
  services: '',
  weight: '',
  customsValue: '',
  collectionDate: '',
  deliveryTypeId: null
})

const deliveryAddress = ref({
  recipient: '',
  address: '',
  street: '',
  city: '',
  post_code: ''
})

const deliveryType = ref({})

const deliveryTypes = ref([])
const loadingDeliveryTypes = ref(false)

const allPrescriptionsData = ref([])

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

const orderSummary = ref({
  itemTotal: '0.00',
  deliveryFee: '0.00',
  tax: '0.00',
  total: '0.00'
})

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
  } finally {
    loading.value = false
  }
}

const updateShipmentState = async (transitionState) => {
  try {
    loading.value = true
    
    const response = await $fetch(`/api/admin/shipments/${shipmentId}?transition_state=${transitionState}`, {
      method: 'PUT',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    })
    
    if (response && response.data) {
      shipmentData.value = response.data
      populateComponentData(response.data)
      
      showApproveOptions.value = false
      showDispatchForm.value = false
      showConfirmShipment.value = false
      showReverseHeld.value = false
    }
    
    return response
    
  } catch (error) {
    console.error('Error updating shipment state:', error)
    throw error
  } finally {
    loading.value = false
  }
}

const populateComponentData = (data) => {
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

  const patientAddress = patient?.addresses?.[0] || {}
  
  deliveryAddress.value = {
    recipient: patient ? `${patient.first_name} ${patient.last_name}` : 'N/A',
    address: patientAddress.street_address_1 || 'N/A',
    street: patientAddress.street_address_2 || '',
    city: patientAddress.city || '',
    post_code: patientAddress.post_code || 'N/A'
  }
  
  if (data.delivery_type) {
    deliveryType.value = data.delivery_type
    dispatchFormData.value.deliveryTypeId = data.delivery_type.id
  }
  
  orderDetails.value = {
    orderDate: formatDateTime(data.created_at),
    submittedDate: formatDateTime(data.updated_at),
    orderReference: data.order_cart?.orders?.[0]?.reference_id || 'N/A', // because order cart have one order
    clinic: data.order_cart?.clinic?.name || 'N/A',
    shipmentStatus: data.state,
    customReference: data.custom_reference_id || 'N/A',
    paymentStatus: 'N/A', 
    paymentTransactionId: 'N/A', 
    paymentType: data.order_cart?.payment_method || 'N/A'
  }
  
  orderSummary.value = {
    itemTotal: (data.price || 0).toFixed(2),
    deliveryFee: (data.delivery_type?.price || 0).toFixed(2),
    tax: '0.00', 
    total: ((data.price || 0) + (data.delivery_type?.price || 0)).toFixed(2)
  }

  if (data.order_cart?.orders) {
    allPrescriptionsData.value = data.order_cart.orders.map(order => {
      return {
        id: order.id, 
        orderId: order.id,
        customReference: order.custom_reference_id,
        orderType: capitalizeFirst(order.order_type),
        prescription: 'Prescription PDF' 
      }
    })
  }
}

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

const formatDateForAPI = (dateString) => {
  if (!dateString) return null
  
  let date
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    const parts = dateString.split('/')
    date = new Date(parts[2], parts[0] - 1, parts[1])
  } else {
    date = new Date(dateString)
  }
  
  if (isNaN(date.getTime())) {
    return null
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

const goBack = () => {
  window.history.back()
}

const viewActivityLog = () => {
  navigateTo(`/admin/shipments/activities?shipment_id=${shipmentId}`)
}

const viewPrescription = async (record, showOrderPopup) => {
  // Find the order in shipmentData/order_cart/orders
  const shipment = shipmentData.value
  if (!shipment || !shipment.order_cart) return

  const order = shipment.order_cart.orders.find(o => o.id === record.orderId)
  if (!order) return

  // Prepare patient/address info
  const patient = order.patient || shipment.order_cart.orders[0]?.patient || {}
  const address = patient.addresses?.[0] || {}

  // Map items correctly - data is in item.pivot
  const items = (order.items || []).map(item => {
    const pivotData = item.pivot || {}
    const itemPrice = pivotData.price || item.price || 0
    const itemQuantity = pivotData.quantity || 1
    const itemTotal = itemPrice * itemQuantity
    
    return {
      product: pivotData.name || item.name || 'N/A',
      quantity: itemQuantity,
      price: `£${itemPrice.toFixed(2)}`,
      tax: 0, // Not in your data structure
      total: `£${itemTotal.toFixed(2)}`,
      note: pivotData.note || '' // Include note if needed
    }
  })

  const itemsData = items.length ? items : []

  showOrderPopup({
    order,
    shipment,
    items: itemsData,
    patient_name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
    patient_email: patient.email || '',
    address_line_1: address.street_address_1 || '',
    address_line_2: address.street_address_2 || '',
    city: address.city || '',
    post_code: address.post_code || ''
  })
}

const holdOrder = async () => {
  try {
    await updateShipmentState('held')
  } catch (error) {
    console.error('Failed to hold order:', error)
  }
}

const cancelOrder = async () => {
  try {
    await updateShipmentState('cancelled')
  } catch (error) {
    console.error('Failed to cancel order:', error)
  }
}

const disapproveOrder = async () => {
  try {
    await updateShipmentState('clinicalCheck')
    showApproveOptions.value = false
  } catch (error) {
    console.error('Failed to disapprove order:', error)
  }
}

const approveOrder = async () => {
  try {
    await updateShipmentState('approved')
    showApproveOptions.value = true
  } catch (error) {
    console.error('Failed to approve order:', error)
  }
}

const dispatchOrder = async () => {
  try {
    await updateShipmentState('dispatched')
    showDispatchForm.value = true
    showApproveOptions.value = false
    activeDispatchTab.value = 'general'
  } catch (error) {
    console.error('Failed to dispatch order:', error)
  }
}

const reverseDispatch = async () => {
  try {
    await updateShipmentState('approved')
    showDispatchForm.value = false
    showApproveOptions.value = false
    showConfirmShipment.value = false
    showReverseHeld.value = false
    dispatchFormData.value = {
      services: '',
      weight: '',
      customsValue: '',
      collectionDate: '',
      deliveryTypeId: null
    }
  } catch (error) {
    console.error('Failed to reverse dispatch:', error)
  }
}

const continueToShipment = () => {
  showDispatchForm.value = true
  activeDispatchTab.value = 'general'
}

const proceedToShipment = () => {
  activeDispatchTab.value = 'shipment'
  showConfirmShipment.value = true
}

const shipmentTabRef = ref(null)

const confirmShipment = async () => {
  if (activeDispatchTab.value === 'shipment' && shipmentTabRef.value) {
    const isValid = shipmentTabRef.value.validateForm()
    if (!isValid) {
      return 
    }
  }
  
  loading.value = true
  try {
    const requestBody = {
      transition_state: 'shipped',
      delivery_type_id: dispatchFormData.value.deliveryTypeId || deliveryType.value?.id,
      collection_date: formatDateForAPI(dispatchFormData.value.collectionDate),
      custom_value: dispatchFormData.value.customsValue || null,
      weight: dispatchFormData.value.weight || null
    }

    const response = await $fetch(`/api/admin/shipments/${shipmentId}/confirm-shipment`, {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: requestBody
    })
    
    if (response && response.data) {
      const {$toast} = useNuxtApp()
      if (response?.success) {
        $toast.success('Shipment confirmed successfully!')
      } 
      // check shipment is already shipped and if shipped toast success message and reload data 
      else if (response?.error) {
        $toast.success(response.error)
      }

      shipmentData.value = response.data
      populateComponentData(shipmentData.value)
      
      showDispatchForm.value = false
      showConfirmShipment.value = false
      showReverseHeld.value = false
      
      await refreshShipmentData()
    }
    
  } catch (error) {
    console.error('Failed to confirm shipment:', error)

  } finally {
    loading.value = false
  }
}

const refreshShipmentData = async () => {
  try {
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
    console.error('Error refreshing shipment data:', error)
  }
}

const reverseHeld = async () => {
  try {
    await updateShipmentState('clinicalCheck')
    showDispatchForm.value = false
    showApproveOptions.value = false
    showConfirmShipment.value = false
    showReverseHeld.value = false
    dispatchFormData.value = {
      services: '',
      weight: '',
      customsValue: '',
      collectionDate: '',
      deliveryTypeId: null
    }
  } catch (error) {
    console.error('Failed to reverse held:', error)
  }
}

const reverseCancel = async () => {
  try {
    await updateShipmentState('clinicalCheck')
  } catch (error) {
    console.error('Failed to reverse cancel:', error)
  }
}

const reverseApprove = async () => {
  try {
    await updateShipmentState('approved')
  } catch (error) {
    console.error('Failed to reverse approve:', error)
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

// Add fetch delivery types function
const fetchDeliveryTypes = async () => {
  try {
    loadingDeliveryTypes.value = true
    
    const response = await $fetch('/api/admin/delivery-types', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    })
    
    if (response && response.data) {
      deliveryTypes.value = response.data
    }
    
  } catch (error) {
    console.error('Error fetching delivery types:', error)
  } finally {
    loadingDeliveryTypes.value = false
  }
}

useHead({
  title: 'Shipment Details',
  meta: [
    { name: 'description', content: 'View and manage shipment details' }
  ]
})

onMounted(() => {
  fetchShipmentData()
  fetchDeliveryTypes()
  updatePrescriptionTableData()
})

watch(deliveryTypes, (newVal) => {
}, { deep: true })

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