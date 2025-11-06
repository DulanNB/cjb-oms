<template>
  <div v-if="normalizedStatus !== 'shipped'" class="card mt-3">
    <div class="card-body p-3">
      <!-- Clinical Check Status - Show Approve, Hold, Cancel -->
      <div v-if="normalizedStatus === 'clinicalcheck' && !showDispatchForm && !showConfirmShipment && !showReverseHeld">
        <div class="d-flex gap-2">
          <button class="btn btn-outline-warning flex-fill" @click="confirmHoldOrder">
            Hold
          </button>
          <button class="btn btn-outline-danger flex-fill" @click="confirmCancelOrder">
            Cancel
          </button>
        </div>
        <div class="mt-2">
          <button class="btn btn-success w-100" @click="confirmApprove">
            Approve
          </button>
        </div>
      </div>

      <!-- Approved Status - Show Hold, Cancel, Disapprove, Dispatch -->
      <div v-else-if="normalizedStatus === 'approved' && !showDispatchForm && !showConfirmShipment && !showReverseHeld">
        <div class="d-flex gap-2 mb-2">
          <button class="btn btn-outline-warning flex-fill" @click="confirmHoldOrder">
            Hold
          </button>
          <button class="btn btn-outline-danger flex-fill" @click="confirmCancelOrder">
            Cancel
          </button>
        </div>
        <div class="d-flex gap-2 mb-2">
          <button class="btn btn-outline-secondary flex-fill" @click="confirmDisapprove">
            Disapprove
          </button>
        </div>
        <div>
          <button class="btn btn-dispatch w-100" @click="confirmDispatch">
            Dispatch Order
          </button>
        </div>
      </div>

      <!-- Dispatched Status - Show Reverse Dispatch and Continue to Shipment -->
      <div v-else-if="normalizedStatus === 'dispatched' && !showConfirmShipment && !showReverseHeld">
        <!-- When dispatch form is not shown yet, show Continue to Shipment -->
        <div v-if="!showDispatchForm">
          <div class="mb-2">
            <button class="btn btn-outline-secondary w-100" @click="confirmReverseDispatch">
              Reverse Dispatch
            </button>
          </div>
          <div>
            <button class="btn btn-dispatch w-100" @click="$emit('continue-shipment')">
              Continue to Shipment
            </button>
          </div>
        </div>
        <!-- When dispatch form is shown, show options to proceed -->
        <div v-else>
          <div class="mb-2">
            <button class="btn btn-outline-secondary w-100" @click="confirmReverseDispatch">
              Reverse Dispatch
            </button>
          </div>
          <div>
            <button class="btn btn-dispatch w-100" @click="$emit('proceed-to-shipment')">
              Proceed to Shipment
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm Shipment Button Layout (when continuing from dispatch) -->
      <div v-else-if="showConfirmShipment && !showReverseHeld">
        <div>
          <button class="btn btn-success w-100" @click="$emit('confirm-shipment')">
            Confirm Shipment
          </button>
        </div>
      </div>

      <!-- Reverse Held Button Layout -->
      <div v-else-if="showReverseHeld">
        <div>
          <button class="btn btn-outline-secondary w-100" @click="confirmReverseHeld">
            Reverse Held
          </button>
        </div>
      </div>

      <!-- Held Status - Show Reverse Held Button -->
      <div v-else-if="normalizedStatus === 'held'">
        <div>
          <button class="btn btn-outline-secondary w-100" @click="confirmReverseHeld">
            Reverse Held
          </button>
        </div>
      </div>

      <!-- Cancelled Status - Show Reverse Cancel Button -->
      <div v-else-if="normalizedStatus === 'cancelled'">
        <div>
          <button class="btn btn-outline-danger w-100" @click="confirmReverseCancel">
            Reverse Cancel
          </button>
        </div>
      </div>

      <!-- Fallback - Default Clinical Check Layout -->
      <div v-else>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-warning flex-fill" @click="confirmHoldOrder">
            Hold
          </button>
          <button class="btn btn-outline-danger flex-fill" @click="confirmCancelOrder">
            Cancel
          </button>
        </div>
        <div class="mt-2">
          <button class="btn btn-success w-100" @click="confirmApprove">
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <transition name="modal-fade">
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="cancelConfirmation">
      <div class="delete-modal">
        <div class="modal-header-custom">
          <h5 class="modal-title">{{ confirmationTitle }}</h5>
          <button class="btn-close-custom" @click="cancelConfirmation" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="delete-message">{{ confirmationMessage }}</p>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-back" @click="cancelConfirmation">
            Cancel
          </button>
          <button type="button" class="btn-delete" @click="executeConfirmedAction">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  shipmentStatus: {
    type: String,
    default: 'clinicalCheck'
  },
  showApproveOptions: {
    type: Boolean,
    default: false
  },
  showDispatchForm: {
    type: Boolean,
    default: false
  },
  showConfirmShipment: {
    type: Boolean,
    default: false
  },
  showReverseHeld: {
    type: Boolean,
    default: false
  }
})

// Normalize the shipment status to handle different case variations
const STATUS_MAP = {
  clinicalcheck: 'clinicalcheck',
  approved: 'approved',
  approve: 'approved',
  dispatched: 'dispatched',
  dispatch: 'dispatched',
  held: 'held',
  cancelled: 'cancelled',
  canceled: 'cancelled',
  shipped: 'shipped',
  ship: 'shipped'
}

const normalizedStatus = computed(() => {
  const normalized = props.shipmentStatus?.toLowerCase().replace(/[^a-z]/g, '') || ''
  return STATUS_MAP[normalized] || 'clinicalcheck'
})

const emit = defineEmits([
  'hold-order',
  'cancel-order',
  'approve',
  'disapprove',
  'dispatch',
  'reverse-dispatch',
  'continue-shipment',
  'proceed-to-shipment',
  'confirm-shipment',
  'reverse-held',
  'reverse-cancel',
  'reverse-approve' 
])


const showConfirmModal = ref(false)
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const pendingAction = ref(null)

// Confirmation methods
const confirmHoldOrder = () => {
  confirmationTitle.value = 'Hold Order'
  confirmationMessage.value = 'Are you sure you want to hold this order? This will change the status to held.'
  pendingAction.value = 'hold-order'
  showConfirmModal.value = true
}

const confirmCancelOrder = () => {
  confirmationTitle.value = 'Cancel Order'
  confirmationMessage.value = 'Are you sure you want to cancel this order? This action will mark the order as cancelled.'
  pendingAction.value = 'cancel-order'
  showConfirmModal.value = true
}

const confirmApprove = () => {
  confirmationTitle.value = 'Approve Order'
  confirmationMessage.value = 'Are you sure you want to approve this order? This will change the status to approved.'
  pendingAction.value = 'approve'
  showConfirmModal.value = true
}

const confirmDisapprove = () => {
  confirmationTitle.value = 'Disapprove Order'
  confirmationMessage.value = 'Are you sure you want to disapprove this order? This will change the status back to clinical check.'
  pendingAction.value = 'disapprove'
  showConfirmModal.value = true
}

const confirmDispatch = () => {
  confirmationTitle.value = 'Dispatch Order'
  confirmationMessage.value = 'Are you sure you want to dispatch this order? This will change the status to dispatched.'
  pendingAction.value = 'dispatch'
  showConfirmModal.value = true
}

const confirmReverseDispatch = () => {
  confirmationTitle.value = 'Reverse Dispatch'
  confirmationMessage.value = 'Are you sure you want to reverse the dispatch status? This will change the shipment back to approved status.'
  pendingAction.value = 'reverse-dispatch'
  showConfirmModal.value = true
}

const confirmReverseHeld = () => {
  confirmationTitle.value = 'Reverse Held Status'
  confirmationMessage.value = 'Are you sure you want to reverse the held status? This will change the shipment back to clinical check status.'
  pendingAction.value = 'reverse-held'
  showConfirmModal.value = true
}

const confirmReverseCancel = () => {
  confirmationTitle.value = 'Reverse Cancellation'
  confirmationMessage.value = 'Are you sure you want to reverse the cancellation? This will change the shipment back to clinical check status.'
  pendingAction.value = 'reverse-cancel'
  showConfirmModal.value = true
}

const executeConfirmedAction = () => {
  if (pendingAction.value) {
    emit(pendingAction.value)
  }
  cancelConfirmation()
}

const cancelConfirmation = () => {
  showConfirmModal.value = false
  confirmationTitle.value = ''
  confirmationMessage.value = ''
  pendingAction.value = null
}
</script>

<style scoped>
.card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 16px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.15s ease-in-out;
}

.btn-outline-warning {
  border-color: #ffc107;
  color: #ffc107;
  background-color: transparent;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
  background-color: transparent;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
  background-color: transparent;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.btn-outline-success {
  border-color: #28a745;
  color: #28a745;
  background-color: transparent;
}

.btn-outline-success:hover {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.btn-dispatch {
  background-color: #8B4513;
  border-color: #8B4513;
  color: #fff;
}

.btn-dispatch:hover {
  background-color: #7A3E0F;
  border-color: #6D360D;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.flex-fill {
  flex: 1 1 auto;
}

.w-100 {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

/* Modal Overlay */
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
}

/* Delete Modal */
.delete-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  animation: modal-slide-up 0.3s ease-out;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Header */
.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
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

/* Modal Body */
.modal-body-custom {
  padding: 24px;
}

/* Delete Message */
.delete-message {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Modal Footer */
.modal-footer-custom {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-back {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.btn-delete {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>