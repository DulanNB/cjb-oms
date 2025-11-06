<template>
  <div class="card">
    <div class="card-body p-0">
      <!-- Tab Navigation -->
      <div class="border-bottom">
        <nav class="nav nav-tabs border-0">
          <button
              :class="['nav-link', activeTab === 'general' ? 'active' : '']"
              @click="$emit('update:activeTab', 'general')"
          >
            General
          </button>
          <button
              :class="['nav-link', activeTab === 'shipment' ? 'active' : '']"
              @click="$emit('update:activeTab', 'shipment')"
          >
            Shipment
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-4">
        <!-- General Tab Content -->
        <GeneralTabContent
            v-if="activeTab === 'general'"
            :patient-info="patientInfo"
            :delivery-address="deliveryAddress"
            :delivery-type="deliveryType"
            @update:deliveryType="$emit('update:deliveryType', $event)"
            :all-prescriptions-data="allPrescriptionsData"
            :prescription-table-attributes="prescriptionTableAttributes"
            @prescription-input-updates="prescriptionInputUpdates"
            @view-prescription="handleViewPrescription"
        />

        <!-- Shipment Tab Content -->
        <ShipmentTabContent
            v-if="activeTab === 'shipment'"
            ref="shipmentTabContentRef"
            :dispatch-form-data="dispatchFormData"
            @update:dispatchFormData="$emit('update:dispatchFormData', $event)"
            :delivery-types="deliveryTypes"
            :loading-delivery-types="loadingDeliveryTypes"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShipmentTabContent from "~/components/shipments/ShipmentTabContent.vue";
import GeneralTabContent from "~/components/shipments/GeneralTabContent.vue";

const props = defineProps({
  patientInfo: Object,
  deliveryAddress: Object,
  deliveryType: Object,
  allPrescriptionsData: Array,
  activeTab: String,
  dispatchFormData: Object,
  prescriptionTableAttributes: Object,
  deliveryTypes: {
    type: Array,
    default: () => []
  },
  loadingDeliveryTypes: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:activeTab', 'update:deliveryType', 'update:dispatchFormData', 'view-prescription', 'prescription-input-updates', 'shipment-tab-ref'])

const shipmentTabContentRef = ref(null)

// Watch for shipment tab ref and emit to parent
watch(shipmentTabContentRef, (newRef) => {
  if (newRef) {
    emit('shipment-tab-ref', newRef)
  }
})

// Handle prescription input updates
const prescriptionInputUpdates = (data) => {
  emit('prescription-input-updates', data)
}

// Handle view prescription event with proper callback propagation
const handleViewPrescription = (record, showOrderPopup) => {
  emit('view-prescription', record, showOrderPopup)
}
</script>

<style scoped>
.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  border-bottom: 1px solid #dee2e6;
}

.nav-link {
  border: none;
  background: none;
  padding: 12px 24px;
  font-size: 14px;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #495057;
  border-bottom-color: #dee2e6;
}

.nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: transparent;
}
</style>