<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Header -->
          <div class="header-section bg-white border-bottom p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
                <h1 class="page-title mb-0 ms-3">Shipment</h1>
              </div>
              <button class="btn btn-outline-secondary btn-sm">
                View Activity Log
              </button>
            </div>
          </div>

          <div class="row">
            <!-- Left Column - Patient & Delivery Info -->
            <div class="col-lg-8">
              <!-- Patient Information Card -->
              <div class="card mb-3">
                <div class="card-body">
                  <div class="mb-3">
                    <div class="fw-medium">{{ patientInfo.name }}</div>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-12">Email</label>
                      <div>{{ patientInfo.email }}</div>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-12">Clinic</label>
                      <div>{{ patientInfo.clinic }}</div>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-12">Date of Birth</label>
                      <div>{{ patientInfo.dateOfBirth }}</div>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-12">Registered Date</label>
                      <div>{{ patientInfo.registeredDate }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Combined Delivery Address & Prescriptions Card -->
              <div class="card">
                <div class="card-body">
                  <!-- Delivery Address Section -->
                  <h6 class="card-title mb-3">Delivery Address</h6>
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="mb-2">
                        <label class="form-label text-muted fs-12">Recipient</label>
                        <div>{{ deliveryAddress.recipient }}</div>
                      </div>
                      <div class="mb-2">
                        <label class="form-label text-muted fs-12">Address</label>
                        <div class="mb-1">{{ deliveryAddress.address }}</div>
                        <div class="mb-1">{{ deliveryAddress.street }}</div>
                        <div>{{ deliveryAddress.city }}</div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-2">
                        <label class="form-label text-muted fs-12">Delivery Type</label>
                        <div>
                          <select class="form-select form-select-sm" v-model="deliveryType">
                            <option value="">Select delivery type</option>
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                            <option value="priority">Priority</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Prescriptions Table Section -->
                  <div class="border-top pt-4">
                    <h6 class="card-title mb-3">Prescriptions</h6>

                    <Table :attributes="prescriptionTableAttributes" class="mb-0" @inputUpdates="prescriptionInputUpdates">
                      <template #orderId="{ record }">
                        <span class="text-primary fw-medium">#{{ record.orderId }}</span>
                      </template>

                      <template #customReference="{ record }">
                        <span class="text-muted">{{ record.customReference || 'N/A' }}</span>
                      </template>

                      <template #orderType="{ record }">
                        <span class="badge bg-light text-dark">{{ record.orderType }}</span>
                      </template>

                      <template #prescription="{ record }">
                        <span class="text-primary">{{ record.prescription }}</span>
                      </template>

                      <template #actions="{ record }">
                        <button class="btn btn-sm btn-outline-primary" @click="viewPrescription(record)">
                          View
                        </button>
                      </template>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Order Details -->
            <div class="col-lg-4">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title mb-3">Order Details</h6>

                  <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Order Date</span>
                      <span class="fs-13">{{ orderDetails.orderDate }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Submitted Date</span>
                      <span class="fs-13">{{ orderDetails.submittedDate }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Order Reference</span>
                      <span class="fs-13 text-primary">#{{ orderDetails.orderReference }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Clinic</span>
                      <span class="fs-13">{{ orderDetails.clinic }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Shipment Status</span>
                      <span class="badge bg-success-soft text-success">{{ orderDetails.shipmentStatus }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Custom Reference</span>
                      <span class="fs-13">{{ orderDetails.customReference || 'N/A' }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Payment Status</span>
                      <span class="badge bg-success-soft text-success">{{ orderDetails.paymentStatus }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted fs-13">Payment Transaction ID</span>
                      <span class="fs-13 text-primary">{{ orderDetails.paymentTransactionId }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                      <span class="text-muted fs-13">Payment Type</span>
                      <span class="fs-13">{{ orderDetails.paymentType }}</span>
                    </div>
                  </div>

                  <!-- Section Divider -->
                  <div class="my-4">
                    <hr class="border-light">
                  </div>

                  <!-- Order Summary -->
                  <div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted fs-13">Item Total</span>
                      <span class="fs-13">£{{ orderSummary.itemTotal }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-muted fs-13">Delivery Fee</span>
                      <span class="fs-13">£{{ orderSummary.deliveryFee }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                      <span class="text-muted fs-13">Tax</span>
                      <span class="fs-13">£{{ orderSummary.tax }}</span>
                    </div>
                    <div class="d-flex justify-content-between border-top pt-2 mb-0">
                      <span class="fw-bold">Total</span>
                      <span class="fw-bold">£{{ orderSummary.total }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons Section -->
              <div class="card mt-3">
                <div class="card-body p-3">
                  <!-- Default Button Layout -->
                  <div v-if="!showApproveOptions">
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-warning flex-fill" @click="holdOrder">
                        Hold
                      </button>
                      <button class="btn btn-outline-danger flex-fill" @click="cancelOrder">
                        Cancel
                      </button>
                    </div>
                    <div class="mt-2">
                      <button class="btn btn-success w-100" @click="showApproveOptions = true">
                        Approve
                      </button>
                    </div>
                  </div>

                  <!-- Approve Options Layout -->
                  <div v-else>
                    <div class="d-flex gap-2 mb-2">
                      <button class="btn btn-outline-warning flex-fill" @click="holdOrder">
                        Hold
                      </button>
                      <button class="btn btn-outline-danger flex-fill" @click="cancelOrder">
                        Cancel
                      </button>
                    </div>
                    <div class="d-flex gap-2 mb-2">
                      <button class="btn btn-outline-secondary flex-fill" @click="disapproveOrder">
                        Disapprove
                      </button>
                    </div>
                    <div>
                      <button class="btn btn-dispatch w-100" @click="dispatchOrder">
                        Dispatch Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})

// Reactive state for patient information
const patientInfo = ref({
  name: 'Sarah Taylor (32 years)',
  email: 'sarah@gmail.com',
  clinic: 'Sunnydale Health Center',
  dateOfBirth: '10. Jun 1991',
  registeredDate: '10. Jun 2025'
})

// Show approve options state
const showApproveOptions = ref(false)

// Delivery address information
const deliveryAddress = ref({
  recipient: 'John Carter',
  address: 'Flat 72 Woodhouse Place,',
  street: '41 Epsoms Road,',
  city: 'Guildford, GUI 3hv'
})

// Delivery type selection
const deliveryType = ref('')

// Mock prescriptions data
const allPrescriptionsData = ref([
  {
    id: 1,
    orderId: 'ODR-1232',
    customReference: null,
    orderType: 'Prescription',
    prescription: 'Prescription PDF'
  },
  {
    id: 2,
    orderId: 'ODR-1233',
    customReference: 'REF-001',
    orderType: 'Prescription',
    prescription: 'Prescription PDF'
  }
])

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
  orderDate: '18. Jun 2025 11:45 AM',
  submittedDate: '20. Jun 2025 01:32 PM',
  orderReference: 'SHIP-120323',
  clinic: 'Hartley Street Clinic',
  shipmentStatus: 'Approved',
  customReference: 'N/A',
  paymentStatus: 'Paid',
  paymentTransactionId: '1243235321',
  paymentType: 'Patient to Pay'
})

// Order summary
const orderSummary = ref({
  itemTotal: '110.12',
  deliveryFee: '13.55',
  tax: '0',
  total: '123.67'
})

// Methods
const goBack = () => {
  // Navigate back to previous page
  window.history.back()
}

const viewPrescription = (prescription) => {
  // Handle prescription view
  console.log('Viewing prescription:', prescription)
  // You can implement modal or navigation to prescription detail
}

const holdOrder = () => {
  // Handle hold order action
  console.log('Hold order action')
  // Add your hold order logic here
}

const cancelOrder = () => {
  // Handle cancel order action
  console.log('Cancel order action')
  // Add your cancel order logic here
}

const approveOrder = () => {
  // Handle approve order action
  console.log('Approve order action')
  // Show the approve options instead of direct approval
  showApproveOptions.value = true
}

const disapproveOrder = () => {
  // Handle disapprove order action
  console.log('Disapprove order action')
  // Reset to default view after action
  showApproveOptions.value = false
  // Add your disapprove order logic here
}

const dispatchOrder = () => {
  // Handle dispatch order action
  console.log('Dispatch order action')
  // Reset to default view after action
  showApproveOptions.value = false
  // Add your dispatch order logic here
}

const updatePrescriptionTableData = (page = 1, per_page = 10, sort = "", search = "") => {
  let data = [...allPrescriptionsData.value]

  // Apply search
  if (search) {
    data = data.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
    )
  }

  // Apply sorting
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

  // Pagination
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

// Set page title and meta for Nuxt 3
useHead({
  title: 'Shipment Details',
  meta: [
    { name: 'description', content: 'View and manage shipment details' }
  ]
})

// Load initial data
onMounted(() => {
  updatePrescriptionTableData()
})
</script>

<style scoped>
/* Custom styles for pixel-perfect design */
.fs-12 {
  font-size: 12px;
}

.fs-13 {
  font-size: 13px;
}

.fs-14 {
  font-size: 14px;
}

/* Header section styling */
.header-section {
  background-color: #ffffff !important;
  border-bottom: 1px solid #dee2e6 !important;
  margin: 0 -20px 0 -20px;
}

/* Page title styling */
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
}

/* Back button styling */
.btn-link {
  color: #6c757d;
  text-decoration: none;
  padding: 4px;
}

.btn-link:hover {
  color: #495057;
}

.fs-20 {
  font-size: 20px;
}

/* Header button styling */
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

/* Card styling */
.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #212529;
}

.card-body {
  padding: 20px;
}

/* Form labels */
.form-label {
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Text styling */
.fw-medium {
  font-weight: 500;
}

.text-muted {
  color: #6c757d !important;
}

/* Table styling */
.table {
  font-size: 13px;
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
}

.table tbody td {
  padding: 12px 16px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f3f4;
}

/* Status badges */
.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.bg-success-soft {
  background-color: #d4edda !important;
  color: #155724 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.text-dark {
  color: #495057 !important;
}

/* Primary text and links */
.text-primary {
  color: #007bff !important;
}

.text-primary.fw-medium {
  color: #007bff !important;
  font-weight: 500 !important;
  text-decoration: none;
}

.text-primary.fw-medium:hover {
  text-decoration: underline;
}

/* Button styling */
.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  font-weight: 500;
  border: 1px solid;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
  background-color: transparent;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.btn-outline-warning {
  border-color: #ffc107;
  color: #ffc107;
  background-color: transparent;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-dispatch {
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
}

.btn-dispatch:hover {
  background-color: #7A3E0F;
  border-color: #6D360D;
  color: #fff;
}

/* Form controls */
.form-select-sm {
  padding: 6px 8px;
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.form-select-sm:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Order details section styling */
.border-top {
  border-top: 1px solid #dee2e6 !important;
}

/* Grid spacing */
.d-grid.gap-2 {
  gap: 8px !important;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .col-lg-8, .col-lg-4 {
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }

  .card-body {
    padding: 16px;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
  }
}



/* Line height for address */
.lh-sm {
  line-height: 1.25;
}

/* Prescription table specific styling */
.table-light th {
  background-color: #f8f9fa;
  color: #495057;
}

/* Order details list styling */
.d-flex.justify-content-between {
  margin-bottom: 8px;
}

.d-flex.justify-content-between:last-child {
  margin-bottom: 0;
}

/* Combined section styling */
.border-top.pt-4 {
  border-top: 1px solid #dee2e6 !important;
  padding-top: 1.5rem !important;
}
</style>