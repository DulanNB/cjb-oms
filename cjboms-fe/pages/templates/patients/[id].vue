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
            <h2 class="mb-0 fw-bold">{{ patientData.firstName }} {{ patientData.lastName }}</h2>
          </div>

          <!-- Tab Navigation -->
          <div class="card">
            <div class="card-header p-0">
              <ul class="nav nav-tabs nav-tabs-alt" role="tablist">
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
                  :address-data="addressData"
              />

              <OrderHistoryTab
                  v-if="activeTab === 'order_history'"
                  :patient-data="patientData"
                  :address-data="addressData"
              />

              <PatientNotesTab
                  v-if="activeTab === 'patient_notes'"
                  :patient-notes="patientNotes"
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

definePageMeta({
  layout: 'dashboard-admin'
})

// Get route params
const route = useRoute()
const router = useRouter()

// Reactive state
const activeTab = ref('general')

// Patient data
const patientData = ref({
  firstName: 'Sarah',
  lastName: 'Taylor',
  dateOfBirth: '10/06/1991',
  gender: 'Female',
  phoneNumber1: '+44123984764',
  phoneNumber2: 'N/A',
  email: 'sarah.taylor@gmail.com',
  notes: 'N/A'
})

// Address data
const addressData = ref({
  name: 'John Carter',
  line1: 'Flat 12 Woodhouse Place,',
  line2: '41 Epsome Road,',
  city: 'Guildford,',
  postcode: 'Gu1 3nx',
  country: 'United Kingdom',
  type: 'Residential Address'
})

// Patient notes data
const patientNotes = ref([
  {
    id: 1,
    title: 'Initial Consultation',
    author: 'Dr. Johnson',
    date: '10. Jun 2025',
    content: 'Patient presented with general wellness inquiry. No immediate concerns noted. Recommended routine follow-up in 6 months.'
  },
  {
    id: 2,
    title: 'Follow-up Visit',
    author: 'Dr. Smith',
    date: '15. Mar 2025',
    content: 'Patient reports feeling well. All vital signs within normal range. Continue current lifestyle recommendations.'
  }
])

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const goBack = () => {
  router.go(-1)
}

// Set page title and meta for Nuxt 3
useHead({
  title: `${patientData.value.firstName} ${patientData.value.lastName} - Patient Details`,
  meta: [
    { name: 'description', content: 'Patient details and information' }
  ]
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
  font-size: 14px;
  font-weight: 500;
}

.nav-tabs-alt .nav-link:hover {
  border-color: transparent;
  color: #495057;
  background-color: #f8f9fa;
}

.nav-tabs-alt .nav-link.active {
  color: #7c5a3a;
  border-bottom-color: #7c5a3a;
  background-color: transparent;
}

/* Card styling */
.card-header {
  background-color: #ffffff;
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