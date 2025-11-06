<template>
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
          <span class="fs-13 text-primary">{{ orderDetails.orderReference }}</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
          <span class="text-muted fs-13">Clinic</span>
          <span class="fs-13">{{ orderDetails.clinic }}</span>
        </div>
        <div class="d-flex justify-content-between mb-1">
          <span class="text-muted fs-13">Shipment Status</span>
          <span :class="['badge', getStateColor(orderDetails.shipmentStatus)]">
            {{ formatShipmentState(orderDetails.shipmentStatus) }}
          </span>
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
</template>

<script setup>
import { state_with_colors } from '~/constants/constants.js'
const props = defineProps({
  orderDetails: {
    type: Object,
    required: true
  },
  orderSummary: {
    type: Object,
    required: true
  }
})

// get state background color and the text color
const getStateColor = (state) => {
  if (!state) return "";
  const match = state_with_colors.find((x) => x.text === state);
  return match ? `bg-${match.color}-5 text-${match.color}` : "";
}

// format the shipment state
const formatShipmentState = (state) => {
  if (!state) return "";

  // format lowercase states
  if (state === state.toLowerCase()) {
    return state.charAt(0).toUpperCase() + state.slice(1);
  }

  // format camelCase state
  return state.replace(/([A-Z])/g, " $1") 
              .replace(/^./, (str) => str.toUpperCase()); 
};

</script>

<style scoped>
.fs-13 {
  font-size: 13px;
}

.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #212529;
}

.text-muted {
  color: #6c757d !important;
}

.text-primary {
  color: #007bff !important;
}

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.bg-success-soft {
  background-color: #d4edda !important;
}

.text-success {
  color: #155724 !important;
}

.border-top {
  border-top: 1px solid #dee2e6 !important;
}

.border-light {
  border-color: #e9ecef !important;
}

.fw-bold {
  font-weight: 700;
}

.d-flex.justify-content-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>