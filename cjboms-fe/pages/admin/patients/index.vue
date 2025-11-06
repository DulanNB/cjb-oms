<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Filter Form -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-11">
                  <div class="row">

                    <!-- Patient Name Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Patient Name</label>
                      <div class="input-icon">
                        <FilterSearch
                            ref="patientNameSearchRef"
                            v-model="patientName"
                            :placeholder="'Search'"
                            @queryUpdates="searchByPatientName"
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
                    
                    <!-- Patient email Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Patient Email</label>
                      <div class="input-icon">
                        <FilterSearch
                            ref="patientEmailSearchRef"
                            v-model="patientEmail"
                            :placeholder="'Search'"
                            @queryUpdates="searchByPatientEmail"
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


                    <!-- Registered Date Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Registered Date</label>
                      <div class="custom-form-wrap">
                        <div class="form-field position-relative">
                          <v-date-picker
                              v-model="filters.dates_between"
                              :max-date="new Date()"
                              class="inline-block h-full rounded-1"
                              is-range
                          >
                            <template v-slot="{ inputValue, togglePopover }">
                              <div class="w-100">
                                <div class="input-icon">
                                  <input
                                      :placeholder="'Select date'"
                                      :value="formatDateRange(inputValue)"
                                      class="form-control date-filter-field rounded-1"
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
                              v-if="filters.dates_between && filters.dates_between.start"
                              class="clear-date-icon"
                              @click="dateReset()"
                          >
                            <i class="fas fa-times"></i>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="col-1 d-flex justify-content-end align-items-end">
                  <button class="btn clear-filter-btn" @click="clearFilters">
                    Clear Filters
                  </button>
                </div>

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
                <span>{{ formatDateTime(record.date_of_birth) }}</span>
              </template>

              <template #registered_date="{ record }">
                <span>{{ formatDateTime(record.registered_date) }}</span>
              </template>

              <template #clinic="{ record }">
                <span>{{ record.clinic_name }}</span>
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

// Show toast message
const {$toast} = useNuxtApp();
// Runtime config
const config = useRuntimeConfig();
const clinics = ref({
  data: [],
  selected: null
})

// filter search references
const clinicSearchRef = ref(null);
const patientNameSearchRef = ref(null);
const patientEmailSearchRef = ref(null);
const patientName = ref({});
const patientEmail = ref({});

// Reactive state
const filters = ref({
  clinic_id: '',
  patientName: '',
  patientEmail: '',
  dates_between: {
    start: null, 
    end: null 
  },
});

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
    { key: "clinic_name", name: "Clinic", sort: true }
  ],
  api_response: {},
  filters: {},
  table_component_values: {},
});

watch(
  () => filters.value,
  (newFilters, oldFilters) => {
    updatePatientsTableData();
  },
  { deep: true }
)

const formatDateRange = (inputValue) => {
  if (!inputValue || !inputValue.start) return '';

  if (inputValue.start === inputValue.end) {
    return inputValue.start;
  }

  return `${inputValue.start} - ${inputValue.end}`;
}

// clear filters
const clearFilters = () => {
  filters.value = {
    clinic_id: '',
    patientName: '',
    patientEmail: '',
    dates_between: {
      start: null, 
      end: null 
    },
  };
  patientNameSearchRef.value.clearInput();
  patientEmailSearchRef.value.clearInput();
  clinicSearchRef.value.reset(); // call reset function in select component
}

// trigger when type in filter search
const searchByPatientName = (val) => {
  filters.value.patientName = val;
}

const searchByPatientEmail = (val) => {
  filters.value.patientEmail = val;
}

// format for backend filter without time
const formatDateRangeForBackend = (range) => {
  if (!range || !range.start) return null;
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const start = formatDate(range.start);
  const end = range.end ? formatDate(range.end) : start;

  return [start, end];
}

// format dates for display in table
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  if (isNaN(date)) return "Invalid date"

  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()

  return `${day}, ${month} ${year}`
}

const patientsInputUpdates = (values) => {
  patientsTableAttributes.value.table_component_values = values;
  updatePatientsTableData(
      values.page,
      values.per_page,
      values.sort.sort_input,
  );
}

// select clinic id for filtering
const selectClinic = (selectedClinic) => {
  filters.value.clinic_id = selectedClinic.id;
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

const updatePatientsTableData = async (page = 1, per_page = 15, sort = "") => {
  try {
    // active loading bar
    patientsTableAttributes.value.loading = true;
    const response = await $fetch("/api/admin/patients", {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      params: {
        per_page,
        page,
        'filter[clinic_id]': filters.value.clinic_id,
        'filter[patient_name]': filters.value.patientName,
        'filter[email]': filters.value.patientEmail,
        'filter[dates_between][]': formatDateRangeForBackend(filters.value.dates_between), // for send it as array
      }
    });
    // update patient data array with patient name and clinic name for easy to display in table
    let transformedData  = response.data.map(patient => ({
      ...patient,
      patient_name: `${patient.first_name} ${patient.last_name}`,
      clinic_name: patient.clinic?.name || '',
      registered_date: patient.created_at || '',
    }));

    // Apply sorting
    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = isDesc ? sort.substring(1) : sort;

      transformedData.sort((a, b) => {
        let aVal = a[sortKey] || '';
        let bVal = b[sortKey] || '';

        if (sortKey.includes('date')) {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return isDesc ? 1 : -1;
        if (aVal > bVal) return isDesc ? -1 : 1;
        return 0;
      })
    }
    // deactivate loading bar
    patientsTableAttributes.value.loading = false;
    // for update the table with new data
    patientsTableAttributes.value.api_response = {
      ...response,    // for keep pagination details
      data: transformedData, // for display table data 
    };
  } catch (error)
  {
    // disable loading bar
    patientsTableAttributes.value.loading = false;
    if ($toast) {
      $toast.error('Failed to fetch patients data.');
    }
  }
}

const router = useRouter()

const goToPatientDetail = (id) => {
  router.push(`/admin/patients/${id}`)
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
  getClinicsData();
})
</script>

<style scoped>
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

.date-filter-field {
  font-size: 13px;
  padding: 6px 8px !important;
  cursor: pointer;
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

/* Date Range Picker Styles */
.custom-form-wrap {
  position: relative;
}

.form-field {
  position: relative;
  display: flex;
  align-items: center;
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

</style>