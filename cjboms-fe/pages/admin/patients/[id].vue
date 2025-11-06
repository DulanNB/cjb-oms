<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Header with Back Button -->
          <div class="d-flex align-items-center mb-4">
            <button class="btn btn-link text-dark p-0 me-3" @click="goBack">
              <i class="ti ti-arrow-left fs-5"></i>
            </button>
            <h2 class="mb-0 fw-bold">{{ patientData.first_name }} {{ patientData.last_name }}</h2>
          </div>

          <!-- Tab Navigation -->
          <div class="card">
            <div class="card-header p-0">
              <ul class="nav nav-tabs nav-tabs-alt mt-2 px-2" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                      class="nav-link"
                      :class="{ active: activeTab === 'general' }"
                      @click="setActiveTab('general')"
                      type="button"
                      role="tab"
                  >
                    General
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                      class="nav-link"
                      :class="{ active: activeTab === 'address' }"
                      @click="setActiveTab('address')"
                      type="button"
                      role="tab"
                  >
                    Address
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                      class="nav-link"
                      :class="{ active: activeTab === 'order_history' }"
                      @click="setActiveTab('order_history')"
                      type="button"
                      role="tab"
                  >
                    Order History
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                      class="nav-link"
                      :class="{ active: activeTab === 'patient_notes' }"
                      @click="setActiveTab('patient_notes')"
                      type="button"
                      role="tab"
                  >
                    Patient Notes
                  </button>
                </li>
              </ul>
            </div>

            <div class="card-body p-4">
              <!-- Dynamic Tab Content -->
              <GeneralTab
                  v-if="activeTab === 'general'"
                  :patient-data="patientData"
              />

              <AddressTab
                  v-if="activeTab === 'address'"
                  :patient-name="patientData.first_name + ' ' + patientData.last_name"
                  :address-data="patientData.addresses"
              />

              <OrderHistoryTab
                  v-if="activeTab === 'order_history'"
                  :patient-data="patientData"
              />

              <PatientNotesTab
                  v-if="activeTab === 'patient_notes'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define layout for Nuxt 3
import GeneralTab from "~/components/patients/GeneralTab.vue";
import AddressTab from "~/components/patients/AddressTab.vue";
import OrderHistoryTab from "~/components/patients/OrderHistoryTab.vue";
import PatientNotesTab from "~/components/patients/PatientNotesTab.vue";

const patientData = ref([]);

// Show toast message
const {$toast} = useNuxtApp();
// Runtime config
const config = useRuntimeConfig();

// Get route params
const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'dashboard-admin'
})

// Reactive state
const activeTab = ref('general')

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

// go back to patients index
const goBack = () => {
  window.history.back()
}

const getPatientData = async () => {
  try {
      const response = await $fetch(`/api/admin/patients/${route.params.id}`, {
        method: 'GET',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      patientData.value = response.data;

      // Set page title and meta for Nuxt 3
      useHead({
        title: `${patientData.value.first_name} ${patientData.value.last_name} - Patient Details`,
        meta: [
          { name: 'description', content: 'Patient details and information' }
        ]
      });
  } catch (error)
  {
    if ($toast) {
      $toast.error('Failed to fetch delivery types data.');
    }
  }
}

// Load initial data
onMounted(() => {
  getPatientData();
})
</script>

<style scoped>
/* Custom styles for pixel-perfect design */
.fs-13 {
  font-size: 13px;
}

.fs-5 {
  font-size: 1.25rem;
}

/* Tab styling */
.nav-tabs-alt {
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs-alt .nav-link {
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: #6c757d;
  padding: 12px 20px;
  padding-block: 6px !important;
  font-size: 14px;
  font-weight: 500;
}

.nav-tabs-alt .nav-link.active {
  color: #000000;
  background-color: white;
  border-top-left-radius: 10%;
  border-top-right-radius: 10%;
}

/* Card styling */
.card-header {
  background-color: #dee2e6;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
}

.card-body {
  padding: 24px;
}

/* Button styling */
.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: none;
}

/* Back button styling */
.btn-link.text-dark:hover {
  color: #495057 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-tabs-alt .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }

  .card-body {
    padding: 16px;
  }
}
</style>