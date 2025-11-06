<template>
  <div class="modal-content">
    <div class="modal-header">
      <div>
        <h5 class="modal-title required">Description - {{
            order_log_type.replace(/([a-z])([A-Z])/g, '$1').charAt(0).toUpperCase() +
            order_log_type.replace(/([a-z])([A-Z])/g, '$1 $2').slice(1).toLowerCase()
          }}
        </h5>
      </div>
      <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
    </div>
    <div class="modal-body">
      <!--              order Log Type: order State Change -->
      <div v-if="order_log_type === 'OrderStatusChanged'">
        <div>
          <p>
            <b>From status:</b>
            <span class="rounded-pill">
              {{
                (order_log_data.from_state === 'clinicalCheck') ? 'Clinical Check' :
                  (order_log_data.from_state === 'paymentPending') ? 'Payment Pending' :
                    (order_log_data.from_state === 'orderProcessing') ? 'Order Processing' :
                      firstLetterUpperCase(order_log_data.from_state)
              }}
                  </span>
            <b>To status:</b>
            <span class="rounded-pill">
              {{
                (order_log_data.to_state === 'clinicalCheck') ? 'Clinical Check' :
                  (order_log_data.to_state === 'orderProcessing') ? 'Order Processing' :
                    firstLetterUpperCase(order_log_data.to_state)
              }}
                </span>
          </p>
        </div>
        <div>
          <p v-if="!order_log_data.note"><b>Note:</b> N/A</p>
          <p v-else style="word-wrap: break-word;"><b>Note:</b> {{ order_log_data.note }}</p>
        </div>
      </div>
      <!--              order Log Type: Note Added-->
      <div v-if="order_log_type === 'NoteAdded'">
        <p style="word-wrap: break-word;"><b>Note:</b>
          {{ order_log_data.note }}
        </p>
      </div>
      <!--              order Log Type: Note Added-->
      <div v-if="order_log_type === 'SystemRejectedOrder'">
        <p style="word-wrap: break-word;">
          {{ order_log_data.description }}
        </p>
      </div>
      <!--              order Log Type: Order Sent To Primed-->
      <div v-if="order_log_type === 'OrderSentToPrimed'">
        <p style="word-wrap: break-word;"><b>Primed Order ID:</b>
          <span> #ODR-{{ order_log_data.primed_order_id }} </span>
        </p>
        <p style="word-wrap: break-word;"><b>Primed Shipment ID:</b>
          <span> #SHIP-{{ order_log_data.primed_shipment_id }}</span>
        </p>
      </div>
      <!--      order Log Type: order Created or order details updated-->
      <div
        v-if="order_log_type === 'OrderCreated' || order_log_type === 'OrderDetailsUpdated'">
        <div>
          <h6>Customer Details</h6>
          <hr class="mt-2 mb-2">
          <div class="row">
            <div class="mb-2">
              <label class="fw-bold">First Name: </label>
              <span>{{ firstLetterUpperCase(order_customer_details.first_name) }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Last Name: </label>
              <span>{{ firstLetterUpperCase(order_customer_details.last_name) }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Date Of Birth: </label>
              <span>{{ formattedDateOfBirth }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Gender: </label>
              <span>{{ firstLetterUpperCase(order_customer_details.gender) }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">E-mail: </label>
              <span>{{ order_customer_details.email }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Phone Number/s: </label>
              <span>{{ order_customer_details.phone_1 }}</span>
              <span v-if="order_customer_details.phone_2">{{ order_customer_details.phone_2 }}</span>
            </div>
          </div>
        </div>
        <hr class="mt-2 mb-2">
        <div>
          <h6>Personal, Billing and Shipping Addresses</h6>
          <hr class="mt-2 mb-2">
          <div v-for="(address, index) in order_customer_addresses" :key="index" class="row">
            <span v-if="address.type === 'personal'" class="mb-3 my-4 mt-1"
                  style="font-weight:bold;color:rgba(27, 40, 41, 1);">
                          Personal Address</span>
            <span v-if="address.type === 'billing'" class="mb-3 border-top my-4 mt-1"
                  style="font-weight:bold;color:rgba(27, 40, 41, 1);padding-top: 1rem">
                          Billing Address</span>
            <span v-if="address.type === 'shipping'" class="mb-3 border-top my-4 mt-1 pt-2" style="font-weight:bold;color:rgba(27, 40, 41, 1);">
                          Shipping Address</span>
            <div class="mb-2">
              <label class="fw-bold">Street Address 1: </label>
              <span>{{ firstLetterUpperCase(address.street_address_1) }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Street Address 2: </label>
              <span v-if="address.street_address_2">{{ firstLetterUpperCase(address.street_address_2) }}</span>
              <span v-else>N/A</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">City: </label>
              <span>{{ firstLetterUpperCase(address.city) }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Post Code: </label>
              <span>{{ address.post_code }}</span>
            </div>
            <div class="mb-2">
              <label class="fw-bold">Country: </label>
              <span v-if="address.country === 'GB'">UK</span>
            </div>
          </div>
        </div>
<!--        <hr class="mt-2 mb-2">-->
<!--        <div>-->
<!--          <h6>Order Details</h6>-->
<!--          <hr class="mt-2 mb-2">-->
<!--          <div class="row">-->
<!--            <div class="mb-2">-->
<!--              <label class="fw-bold">Treatment: </label>-->
<!--              <span>{{ firstLetterUpperCase(order_customer_plan.treatment_name) }}</span>-->
<!--            </div>-->
<!--            <div class="mb-2">-->
<!--              <label class="fw-bold">Plan: </label>-->
<!--              <span>{{ firstLetterUpperCase(order_customer_plan.plan_group_name) }}</span>-->
<!--            </div>-->
<!--            <div class="mb-2">-->
<!--              <label class="fw-bold">Submitted Date: </label>-->
<!--              <span>{{ formattedOrderDate }}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="modal-footer">
      <button id="closeModalBtn" class="btn me-auto" data-bs-dismiss="modal" type="button">Close</button>
    </div>
  </div>
</template>

<script>
import moment from "moment/moment";

export default {
  props: {
    order_log_type: {
      type: String,
      default: '',
    },
    order_log_data: {
      type: Object,
      default: () => ({}),
    },
    order_customer_details: {
      type: Object,
      default: () => ({}),
    },
    order_customer_addresses: {
      type: Array,
      default: () => [],
    },
    order_customer_plan: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formattedOrderDate: '',
      formattedDateOfBirth: ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    formatDate() {
      // Update the formattedOrderDate and formattedDateOfBirth property with the formatted date
      this.formattedOrderDate = moment.utc(this.order_customer_details.created_at).format('Do MMMM YYYY h:mm a');
      this.formattedDateOfBirth = moment(this.order_customer_details.date_of_birth).format('Do MMMM YYYY');
    },
  },
  mounted() {
    // Call the formatDate methods when the component is mounted
    this.formatDate();
  },
};
</script>

<style scoped></style>
