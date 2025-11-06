<template>
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
            <div class="lh-sm">
              <div class="mb-1">{{ deliveryAddress.address }},</div>
              <div class="mb-1" v-if="deliveryAddress.street">{{ deliveryAddress.street }},</div>
              <div class="mb-1">{{ deliveryAddress.city }},</div>
              <div>{{ deliveryAddress.post_code }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-2">
            <label class="form-label text-muted fs-12">Delivery Type</label>
            <div>
              <select
                  class="form-select form-select-sm"
                  :value="deliveryType.name || 'N/A'"
                  disabled
              >
                <option :value="deliveryType.name || 'N/A'">{{ deliveryType.name || 'N/A' }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Prescriptions Table Section -->
      <div class="border-top pt-4">
        <h6 class="card-title mb-3">Prescriptions</h6>

        <Table
            :attributes="prescriptionTableAttributes"
            class="mb-0"
            @inputUpdates="$emit('prescription-input-updates', $event)"
        >
          <template #orderId="{ record }">
            <span class="text-primary fw-medium">#ODR-{{ record.orderId }}</span>
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
            <button class="btn btn-sm btn-outline-primary" @click="onViewPrescription(record)">
              View
            </button>
          </template>
        </Table>
      </div>
    </div>
  </div>

  <!-- Order Details Modal -->
  <transition name="modal-fade">
    <div v-if="showOrderModal" class="modal-overlay" @click.self="closeOrderModal">
      <div class="order-modal">
        <div class="modal-header-custom">
          <h5 class="modal-title">Order View - #{{ orderDetailsData.reference_id }}</h5>
          <button class="btn-close-custom" @click="closeOrderModal" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="modal-body-custom">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="info-group">
                <span class="info-label">Order Status</span>
                <span :class="['status-badge-inline', getStateColor(orderDetailsData.state)]">
                  {{ formatShipmentState(orderDetailsData.state) }}
                </span>
              </div>

              <div class="info-group">
                <span class="info-label">Order Type</span>
                <span class="info-value">Prescription</span>
              </div>
              <div class="info-group">
                <span class="info-label">Patient Name</span>
                <span class="info-value">{{ orderDetailsData.patient_name }}</span>
              </div>
              <div class="info-group">
                <span class="info-label">Patient Email</span>
                <span class="info-value">{{ orderDetailsData.patient_email }}</span>
              </div>
              <div class="info-group">
                <span class="info-label">Custom Reference</span>
                <span class="info-value">{{ orderDetailsData.custom_reference_id || 'N/A' }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-group">
                <span class="info-label d-block mb-2">Address</span>
                <div class="info-value address-text">
                  {{ orderDetailsData.address_line_1 }}<br>
                  {{ orderDetailsData.address_line_2 }}<br>
                  {{ orderDetailsData.city }}<br>
                  {{ orderDetailsData.post_code }}
                </div>
              </div>
            </div>
          </div>
          <div class="products-section">
            <h6 class="section-title">Items</h6>
            <Table
              :attributes="itemsTableAttributes"
              class="mb-0"
              hide-pagination
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {state_with_colors} from "@/constants/constants.js";
const props = defineProps({
  deliveryAddress: {
    type: Object,
    required: true
  },
  deliveryType: {
    type: Object,
    required: true
  },
  prescriptionTableAttributes: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:deliveryType', 'prescription-input-updates', 'view-prescription'])

const showOrderModal = ref(false)
const orderDetailsData = ref({})
const itemsTableAttributes = ref({
  table_id: "order_items_table",
  cache: false,
  loading: false,
  labels: [
    { key: "product", name: "Product", sort: false },
    { key: "quantity", name: "Quantity", sort: false },
    { key: "price", name: "Price", sort: false },
    { key: "tax", name: "Tax(%)", sort: false },
    { key: "total", name: "Total", sort: false }
  ],
  api_response: {
    data: [],
    total: 0,
    from: 1,
    to: 0,
    current_page: 1,
    per_page: 100
  }
})

// get the state background colors and text colors
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


function onViewPrescription(record) {
  emit('view-prescription', record, showOrderPopup)
}

function showOrderPopup(orderData) {
  // orderData: { order, shipment, items }
  orderDetailsData.value = {
    reference_id: orderData.shipment.reference_id,
    state: orderData.shipment.state,
    patient_name: orderData.patient_name,
    patient_email: orderData.patient_email,
    custom_reference_id: orderData.order.custom_reference_id,
    address_line_1: orderData.address_line_1,
    address_line_2: orderData.address_line_2,
    city: orderData.city,
    post_code: orderData.post_code
  }
  itemsTableAttributes.value.api_response.data = orderData.items
  showOrderModal.value = true
}

function closeOrderModal() {
  showOrderModal.value = false
}

const capitalizeFirst = (str) => {
  if (!str) return 'N/A'
  return str.charAt(0).toUpperCase() + str.slice(1)
}
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

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #212529;
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lh-sm {
  line-height: 1.25;
}

.border-top {
  border-top: 1px solid #dee2e6 !important;
}

.pt-4 {
  padding-top: 1.5rem !important;
}

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

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.text-dark {
  color: #495057 !important;
}

.text-primary {
  color: #007bff !important;
}

.text-muted {
  color: #6c757d !important;
}

.fw-medium {
  font-weight: 500;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
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

/* Modal styles (copy from OrderHistoryTab.vue for consistency) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}
.order-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  width: 100%;
  animation: modal-slide-up 0.3s ease-out;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
@keyframes modal-slide-up {
  from { opacity: 0; transform: translateY(50px);}
  to { opacity: 1; transform: translateY(0);}
}
.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
.btn-close-custom {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}
.btn-close-custom:hover {
  background-color: #f3f4f6;
  color: #374151;
}
.modal-body-custom {
  padding: 24px;
}
.info-group { margin-bottom: 16px; font-size: 14px; line-height: 1.5;}
.info-label { font-weight: 400; color: #1f2937; margin-right: 8px;}
.info-value { color: #6b7280;}
.address-text { line-height: 1.6; color: #6b7280;}

.status-badge-inline {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 4px;
}
.products-section {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}
</style>