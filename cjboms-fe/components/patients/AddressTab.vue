<template>
  <div class="tab-content">
    <div v-for="address in addressData" :key="address.id" class="row mb-2">
      <div class="col-md-3">
        <h6 class="text-muted fs-13 fw-medium mb-1">Address</h6>
        <div class="address-text">
          <div>{{ patientName }}</div>
          <div>{{ address.street_address_1 }}</div>
          <div>{{ address.street_address_2 }}</div>
          <div>{{ address.city }}</div>
          <div>{{ address.post_code }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <h6 class="text-muted fs-13 fw-medium mb-1">Post Code</h6>
        <div class="address-text">
          {{ address.post_code }}
        </div>
      </div>
      <div class="col-md-3">
        <h6 class="text-muted fs-13 fw-medium mb-1">Country</h6>
        <div class="address-text">
          {{ address.country }}
        </div>
      </div>
      <div class="col-md-3">
        <h6 class="text-muted fs-13 fw-medium mb-1">Type</h6>
        <div class="address-text">
          {{ formatType(address.type) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  addressData: {
    type: Array,
    required: true
  },
  patientName: {
    type: String,
    required: true
  }
})

// format first letter of type
const formatType = (type) => {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
}

</script>

<style scoped>
.fs-13 {
  font-size: 13px;
}

.address-text {
  font-size: 13px;
  line-height: 1.4;
  color: #495057;
}

.tab-content {
  min-height: 400px;
}
</style>
