<template>
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
</template>

<script setup>
const props = defineProps({
  patientInfo: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.fs-12 {
  font-size: 12px;
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fw-medium {
  font-weight: 500;
}

.text-muted {
  color: #6c757d !important;
}
</style>