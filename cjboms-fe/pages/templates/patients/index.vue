<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Filter Form -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="row g-3">
                <!-- Clinic Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Clinic</label>
                  <select v-model="filters.clinic" class="form-select form-select-sm">
                    <option value="">Select clinic</option>
                    <option value="sunnydale">Sunnydale Health Center</option>
                    <option value="pineview">Pineview Health Services</option>
                    <option value="riverband">Riverband Medical Center</option>
                    <option value="westside">Westside General Hospital</option>
                    <option value="greenwood">Greenwood Medical Clinic</option>
                    <option value="lakeside">Lakeside Health Institute</option>
                    <option value="cedar_park">Cedar Park Health Facilities</option>
                    <option value="hilltop">Hilltop Health Clinic</option>
                  </select>
                </div>

                <!-- Delivery Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Delivery Type</label>
                  <select v-model="filters.deliveryType" class="form-select form-select-sm">
                    <option value="">Select delivery type</option>
                    <option value="lable">Lable</option>
                    <option value="express">Express</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>

                <!-- Payment Type Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Payment Type</label>
                  <select v-model="filters.paymentType" class="form-select form-select-sm">
                    <option value="">Select payment type</option>
                    <option value="credit">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <!-- Date Range Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Created/Submitted Date</label>
                  <select v-model="filters.dateRange" class="form-select form-select-sm">
                    <option value="">Select date range</option>
                    <option value="today">Today</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_month">Last Month</option>
                  </select>
                </div>

                <!-- Custom Reference ID Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Custom Reference ID</label>
                  <select v-model="filters.customRef" class="form-select form-select-sm">
                    <option value="">Select reference ID</option>
                    <option value="ref_001">Reference 001</option>
                    <option value="ref_002">Reference 002</option>
                    <option value="ref_003">Reference 003</option>
                  </select>
                </div>

                <!-- Reference ID / ODR ID / INV ID Filter -->
                <div class="col-md-3">
                  <label class="form-label text-muted fs-13">Reference ID / ODR ID / INV ID</label>
                  <select v-model="filters.referenceId" class="form-select form-select-sm">
                    <option value="">Select ID</option>
                    <option value="odr_001">ODR 001</option>
                    <option value="odr_002">ODR 002</option>
                    <option value="odr_003">ODR 003</option>
                  </select>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-outline-primary btn-sm" @click="clearFilters">
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Patients Table -->
          <div class="card overflow-hidden">
            <div class="card-header">
              <h3 class="card-title">Patients</h3>
            </div>

            <Table :attributes="patientsTableAttributes" class="mb-3" @inputUpdates="patientsInputUpdates">
              <template #patient_name="{ record }">
                <span
                  class="text-primary fw-medium"
                  style="cursor:pointer"
                  @click="goToPatientDetail(record.id)"
                >{{ record.patient_name }}</span>
              </template>

              <template #email="{ record }">
                <span>{{ record.email }}</span>
              </template>

              <template #date_of_birth="{ record }">
                <span>{{ record.date_of_birth }}</span>
              </template>

              <template #registered_date="{ record }">
                <span>{{ record.registered_date }}</span>
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
</template>

<script setup>
// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})

// Reactive state
const filters = ref({
  clinic: '',
  deliveryType: '',
  paymentType: '',
  dateRange: '',
  customRef: '',
  referenceId: ''
})

// Mock patients data
const allPatientsData = ref([
  {
    id: 1,
    patient_name: 'Sarah Taylor',
    email: 'Sarah@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '10. Jun 2025',
    clinic: 'Sunnydale Health Center'
  },
  {
    id: 2,
    patient_name: 'James Brown',
    email: 'James@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Pineview Health Services'
  },
  {
    id: 3,
    patient_name: 'Chris Martinez',
    email: 'Chris@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Riverband Medical Center'
  },
  {
    id: 4,
    patient_name: 'Emily Davis',
    email: 'Emily@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Westside General Hospital'
  },
  {
    id: 5,
    patient_name: 'Michael Johnson',
    email: 'Michael@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Greenwood Medical Clinic'
  },
  {
    id: 6,
    patient_name: 'Sarah Taylor',
    email: 'Sarah@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Sunnydale Health Center'
  },
  {
    id: 7,
    patient_name: 'Linda Wilson',
    email: 'Linda@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Lakeside Health Institute'
  },
  {
    id: 8,
    patient_name: 'Daniel Lee',
    email: 'Daniel@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Cedar Park Health Facilities'
  },
  {
    id: 9,
    patient_name: 'Jennifer Clark',
    email: 'Jennifer@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Hilltop Health Clinic'
  },
  {
    id: 10,
    patient_name: 'Robert Wilson',
    email: 'Robert@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Sunnydale Health Center'
  },
  {
    id: 11,
    patient_name: 'Maria Garcia',
    email: 'Maria@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Pineview Health Services'
  },
  {
    id: 12,
    patient_name: 'David Anderson',
    email: 'David@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Riverband Medical Center'
  },
  {
    id: 13,
    patient_name: 'Lisa Thompson',
    email: 'Lisa@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Westside General Hospital'
  },
  {
    id: 14,
    patient_name: 'Mark Davis',
    email: 'Mark@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Greenwood Medical Clinic'
  },
  {
    id: 15,
    patient_name: 'Amy Johnson',
    email: 'Amy@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Lakeside Health Institute'
  },
  {
    id: 16,
    patient_name: 'Kevin Martinez',
    email: 'Kevin@gmail.com',
    date_of_birth: '10. Jun 1991',
    registered_date: '15. Jun 2020',
    clinic: 'Cedar Park Health Facilities'
  }
])

// Table attributes
const patientsTableAttributes = ref({
  table_id: "patients_table",
  cache: false,
  loading: false,
  labels: [
    { key: "patient_name", name: "Patient Name", sort: true },
    { key: "email", name: "Email", sort: true },
    { key: "date_of_birth", name: "Date of Birth", sort: true },
    { key: "registered_date", name: "Registered Date", sort: true },
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

// Methods
const clearFilters = () => {
  filters.value = {
    clinic: '',
    deliveryType: '',
    paymentType: '',
    dateRange: '',
    customRef: '',
    referenceId: ''
  }
  updatePatientsTableData()
}

const updatePatientsTableData = (page = 1, per_page = 8, sort = "", search = "") => {
  let data = [...allPatientsData.value]

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

      if (sortKey.includes('date')) {
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

  patientsTableAttributes.value.api_response = {
    data: paginatedData,
    total,
    from: total > 0 ? from : 0,
    to,
    current_page: page,
    per_page: parseInt(per_page)
  }
}

const patientsInputUpdates = (values) => {
  patientsTableAttributes.value.table_component_values = values
  updatePatientsTableData(
      values.page,
      values.per_page,
      values.sort.sort_input,
      values.search
  )
}

const router = useRouter()

const goToPatientDetail = (id) => {
  router.push(`/templates/patients/${id}`)
}

// Set page title and meta for Nuxt 3
useHead({
  title: 'Patients Management',
  meta: [
    { name: 'description', content: 'Manage and view patient information' }
  ]
})

// Load initial data
onMounted(() => {
  updatePatientsTableData()
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
  border: 1.5px solid #bdbdbd; /* darker border for non-active */
  box-shadow: none;
}

.border-brown {
  border-color: #7c5a3a !important;
}

.text-brown {
  color: #7c5a3a !important;
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