<template>
  <div>
    <div class="container-xl">
      <!-- Page Body -->
      <div class="page-body">
        <div class="container-xl">
          <!-- Stats Cards Row -->
          <div class="row row-deck row-cards mb-4">
            <!-- Total Orders Card -->
            <div class="col-sm-6 col-lg-4">
              <button type="button" class="btn card" @click.prevent="navigateToShipment('clinicalCheck')">
                <div class="card-body text-center">
                  <div class="display-1 fw-bold text-muted mb-2">213</div>
                  <div class="h3 mb-1">Orders</div>
                  <div class="text-muted small">Newly registered orders</div>
                </div>
              </button>
            </div>

            <!-- Not Shipped Orders Card -->
            <div class="col-sm-6 col-lg-4">
              <button type="button" class="btn card" @click.prevent="navigateToShipment('dispatched')">
                <div class="card-body text-center">
                  <div class="display-1 fw-bold text-muted mb-2">03</div>
                  <div class="h3 mb-1">Not Shipped Orders</div>
                  <div class="text-muted small">Orders awaiting shipment</div>
                </div>
              </button>
            </div>

            <!-- Shipped Orders Card -->
            <div class="col-sm-6 col-lg-4">
              <button type="button" class="btn card" @click.prevent="navigateToShipment('shipped')">
                <div class="card-body text-center">
                  <div class="display-1 fw-bold text-muted mb-2">12</div>
                  <div class="h3 mb-1">Shipped Orders</div>
                  <div class="text-muted small">Orders shipped to recipients</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Orders Tables Row -->
          <div class="row">
            <!-- Not Shipped Orders Table -->
            <div class="col-lg-6">
              <div class="card overflow-hidden w-100">
                <div class="card-header">
                  <h3 class="card-title">Not Shipped (03)</h3>
                </div>
                <Table :attributes="notShippedTableAttributes" class="mb-0" @inputUpdates="notShippedInputUpdates">
                  <template #order_date="{ record }">
                    <span class="text-muted">{{ record.order_date }}</span>
                  </template>

                  <template #clinic="{ record }">
                    <span>{{ record.clinic }}</span>
                  </template>
                </Table>
              </div>
            </div>

            <!-- Shipped Orders Table -->
            <div class="col-lg-6">
              <div class="card overflow-hidden w-100">
                <div class="card-header">
                  <h3 class="card-title">Shipped (12)</h3>
                </div>
                <Table :attributes="shippedTableAttributes" class="mb-0" @inputUpdates="shippedInputUpdates">
                  <template #order_date="{ record }">
                    <span class="text-muted">{{ record.order_date }}</span>
                  </template>

                  <template #clinic="{ record }">
                    <span>{{ record.clinic }}</span>
                  </template>
                </Table>
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
const router = useRouter()

// Mock data for not shipped orders
const allNotShippedData = [
  { id: 1, order_date: '11, Jun 2025 09:15 AM', clinic: 'Greenwood Hospital' },
  { id: 2, order_date: '12, Jun 2025 03:45 PM', clinic: 'Riverside Health Center' },
  { id: 3, order_date: '13, Jun 2025 01:30 PM', clinic: 'Sunnydale Medical' },
  { id: 4, order_date: '17, Jun 2025 07:45 PM', clinic: 'Oakridge Health Services' },
  { id: 5, order_date: '20, Jun 2025 03:10 PM', clinic: 'Lakeside Medical Center' },
  { id: 6, order_date: '23, Jun 2025 10:15 AM', clinic: 'Vista Point Medical' },
  { id: 7, order_date: '24, Jun 2025 08:30 PM', clinic: 'Highland Park Clinic' },
  { id: 8, order_date: '29, Jun 2025 03:10 PM', clinic: 'Lakeside Medical Center' }
]

// Mock data for shipped orders
const allShippedData = [
  { id: 1, order_date: '14, Jun 2025 11:20 AM', clinic: 'Maplewood Clinic' },
  { id: 2, order_date: '15, Jun 2025 02:55 PM', clinic: 'Cedar Springs Hospital' },
  { id: 3, order_date: '16, Jun 2025 10:00 AM', clinic: 'Pine Valley Medical' },
  { id: 4, order_date: '18, Jun 2025 12:30 PM', clinic: 'Elm Street Clinic' },
  { id: 5, order_date: '21, Jun 2025 01:50 PM', clinic: 'Cypress Grove Clinic' },
  { id: 6, order_date: '18, Jun 2025 12:30 PM', clinic: 'Elm Street Clinic' },
  { id: 7, order_date: '22, Jun 2025 04:30 PM', clinic: 'Willow Creek Health' },
  { id: 8, order_date: '19, Jun 2025 09:15 AM', clinic: 'Birchwood Hospital' },
  { id: 9, order_date: '25, Jun 2025 02:15 PM', clinic: 'Mountainview Clinic' },
  { id: 10, order_date: '26, Jun 2025 11:45 AM', clinic: 'Oceanside Health' },
  { id: 11, order_date: '27, Jun 2025 04:20 PM', clinic: 'Riverside Medical' },
  { id: 12, order_date: '28, Jun 2025 09:30 AM', clinic: 'Valley Health Center' },
  { id: 13, order_date: '30, Jun 2025 01:10 PM', clinic: 'Hillside Hospital' },
  { id: 14, order_date: '01, Jul 2025 03:45 PM', clinic: 'Metro Health Clinic' },
  { id: 15, order_date: '02, Jul 2025 10:20 AM', clinic: 'Central Medical' },
  { id: 111, order_date: '27, Jun 2025 04:20 PM', clinic: 'Riverside Medical' },
  { id: 121, order_date: '28, Jun 2025 09:30 AM', clinic: 'Valley Health Center' },
  { id: 131, order_date: '30, Jun 2025 01:10 PM', clinic: 'Hillside Hospital' },
  { id: 141, order_date: '01, Jul 2025 03:45 PM', clinic: 'Metro Health Clinic' },
  { id: 151, order_date: '02, Jul 2025 10:20 AM', clinic: 'Central Medical' }
]

// Not Shipped Orders Table Attributes
const notShippedTableAttributes = ref({
  table_id: "not_shipped_orders_table",
  cache: false,
  loading: false,
  labels: [
    { key: "order_date", name: "Order Date", sort: true },
    { key: "clinic", name: "Clinic", sort: true }
  ],
  api_response: {
    data: [],
    total: 0,
    from: 1,
    to: 0,
    current_page: 1,
    per_page: 8
  },
  filters: {},
  table_component_values: {},
})

// Shipped Orders Table Attributes
const shippedTableAttributes = ref({
  table_id: "shipped_orders_table",
  cache: false,
  loading: false,
  labels: [
    { key: "order_date", name: "Order Date", sort: true },
    { key: "clinic", name: "Clinic", sort: true }
  ],
  api_response: {
    data: [],
    total: 0,
    from: 1,
    to: 0,
    current_page: 1,
    per_page: 8
  },
  filters: {},
  table_component_values: {},
})

// Update Not Shipped Table Data
const updateNotShippedTableData = (page = 1, per_page = 8, sort = "", search = "") => {
  let data = [...allNotShippedData]

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

      if (sortKey === 'order_date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

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

  notShippedTableAttributes.value.api_response = {
    data: paginatedData,
    total,
    from: total > 0 ? from : 0,
    to,
    current_page: page,
    per_page: parseInt(per_page)
  }
}

// Update Shipped Table Data
const updateShippedTableData = (page = 1, per_page = 8, sort = "", search = "") => {
  let data = [...allShippedData]

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

      if (sortKey === 'order_date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

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

  shippedTableAttributes.value.api_response = {
    data: paginatedData,
    total,
    from: total > 0 ? from : 0,
    to,
    current_page: page,
    per_page: parseInt(per_page)
  }
}

// Handle table input updates for Not Shipped orders
const notShippedInputUpdates = (values) => {
  notShippedTableAttributes.value.table_component_values = values
  updateNotShippedTableData(
      values.page,
      8,
      values.sort.sort_input,
      values.search
  )
}

// Handle table input updates for Shipped orders
const shippedInputUpdates = (values) => {
  shippedTableAttributes.value.table_component_values = values
  updateShippedTableData(
      values.page,
      8,
      values.sort.sort_input,
      values.search
  )
}

// navigate to shipment page with state tab name
const navigateToShipment = async (state) => {
  router.push({ 
    path: '/admin/shipments', 
    state: { tab: state }
  });
}

// Set page title and meta for Nuxt 3
useHead({
  title: 'Dashboard',
  meta: [
    {name: 'description', content: 'Track and manage orders - shipped and not shipped'}
  ]
})

// Load initial data
onMounted(() => {
  updateNotShippedTableData()
  updateShippedTableData()
})
</script>

<style scoped>
/* Additional custom styles if needed */
.display-1 {
  font-size: 3.5rem;
  line-height: 1.2;
}

.text-muted {
  color: #6c757d !important;
}

/* Ensure proper spacing and alignment */
.row-deck > .col-lg-6 {
  margin-bottom: 1.5rem;
}

@media (min-width: 992px) {
  .row-deck > .col-lg-6 {
    margin-bottom: 0;
  }
}

/* Remove default card margin for tables */
.card .table {
  margin-bottom: 0;
}
</style>