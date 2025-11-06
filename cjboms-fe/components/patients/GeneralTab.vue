<!-- components/patient/GeneralTab.vue -->
<template>
  <div class="tab-content">
    <div v-if="loading" class="loader-container">
      <div class="loader"></div>
    </div>
    <div v-else class="row g-4">
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">First Name</label>
        <input
            v-model="patientData.first_name"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Last Name</label>
        <input
            v-model="patientData.last_name"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Date of Birth</label>
        <input
            v-model="patientData.date_of_birth"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Gender</label>
        <input
            v-model="patientData.gender"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Phone Number 1</label>
        <input
            v-model="patientData.phone_1"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Phone Number 2</label>
        <input
            v-model="patientData.phone_2"
            type="text"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <label class="form-label text-muted fs-13">Email</label>
        <input
            v-model="patientData.email"
            type="email"
            class="form-control form-control-sm bg-light"
            readonly
        >
      </div>
      <div class="col-md-6">
        <!-- Empty column to maintain grid alignment -->
      </div>
      <div class="col-12">
        <label class="form-label text-muted fs-13">Notes</label>
        <textarea
            v-model="patientData.notes"
            class="form-control bg-light rounded-1"
            rows="6"
            readonly
            placeholder="N/A"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  patientData: {
    type: Object,
    required: true
  }
})
const loading = ref(true)

watch(
  () => props.patientData,
  (newVal) => {
    loading.value = !newVal || Object.keys(newVal).length === 0
  },
  { immediate: true }
)
</script>

<style scoped>
.fs-13 {
  font-size: 13px;
}

.form-control-sm {
  font-size: 13px;
  padding: 8px 12px;
}

.form-control {
  font-size: 14px;
  padding: 8px 12px;
}

.bg-light {
  background-color: #f1f3f5 !important;
  border: 1px solid #dee2e6;
}

.form-label {
  margin-bottom: 6px;
  font-weight: 400;
  font-size: 13px;
}

.text-muted {
  color: #6c757d !important;
}

.tab-content {
  min-height: 400px;
  padding: 20px 0;
}

.row {
  margin: 0;
}

.g-4 {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 1.5rem;
}

.g-4 > * {
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}

.g-4 > *:nth-child(1),
.g-4 > *:nth-child(2) {
  margin-top: 0;
}

.col-md-6 {
  flex: 0 0 auto;
  width: 50%;
}

.col-12 {
  flex: 0 0 auto;
  width: 100%;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

textarea.form-control::placeholder {
  color: #adb5bd;
}

@media (max-width: 768px) {
  .col-md-6 {
    width: 100%;
  }
}

/* Loader styles */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}
</style>