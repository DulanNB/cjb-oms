<template>
  <div>
    <div class="container-xl">
      <div class="page-body">
        <div class="container-xl">
          <!-- Filter Form -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-11">
                  <div class="row">
                    <!-- Order Number / Name Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Search</label>
                      <div class="input-icon">
                        <FilterSearch
                            ref="orderSearchRef"
                            v-model="searchTerm"
                            :placeholder="'Order number or name'"
                            @queryUpdates="searchOrders"
                        />
                        <span class="input-icon-addon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                            <path d="M21 21l-6 -6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Status Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Status</label>
                      <div class="input-icon">
                        <Select
                          ref="statusSearchRef"
                          :attributes="status_data"
                          :placeholder="'Select status'"
                          @selectUpdates="selectOrderStatus"
                        />
                        <span class="input-icon-addon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                            class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                            fill="none"/><path d="M6 9l6 6l6 -6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-1 d-flex justify-content-end align-items-end">
                  <button class="btn clear-filter-btn" @click="clearFilters">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Table -->
          <div class="card overflow-hidden">
            <div class="card-header d-flex justify-content-between">
              <div>
                <h3 class="card-title">Orders</h3>
              </div>
              <div>
                <NuxtLink to="/admin/orders/create" class="btn default-btn-with-only-border"> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                  </svg>
                  <span class="ms-1">
                    Add New Order
                  </span>
                </NuxtLink>
              </div>
            </div>

            <Table :attributes="ordersTableAttributes" class="mb-3" @inputUpdates="ordersInputUpdates">
              <template #order_number="{ record }">
                <span class="fw-semibold">#ORD-{{ record.id }}</span>
              </template>

              <template #customer_name="{ record }">
                <span>{{ record.customer_name }}</span>
              </template>

              <template #items="{ record }">
                <div v-if="record.order_items && record.order_items.length > 0">
                  <span v-for="(item, index) in record.order_items" :key="index">
                    {{ item.product?.name || 'N/A' }}<span v-if="index < record.order_items.length - 1">, </span>
                  </span>
                </div>
                <span v-else>N/A</span>
              </template>
              
              <template #total="{ record }">
                <span v-if="record.order_items && record.order_items.length > 0">
                  Rs {{ calculateOrderTotal(record.order_items) }}
                </span>
                <span v-else>Rs 0.00</span>
              </template>

              <template #contact="{ record }">
                <div class="small">
                  <div v-if="record.contact_number_one">{{ record.contact_number_one }}</div>
                  <div v-if="record.email" class="text-muted">{{ record.email }}</div>
                </div>
              </template>

              <template #location="{ record }">
                <span>{{ record.city || 'N/A' }}</span>
              </template>
              
              <template #status="{ record }">
                <span :class="getStatusClass(record.status)" @click.prevent="openStatusChangeModal(record)">
                  {{ record.status.charAt(0).toUpperCase() + record.status.slice(1) }}
                </span>
              </template>

              <template #actions="{ record }">
                <div class="d-flex gap-2">
                  <NuxtLink :to="`/admin/orders/${record.id}`" class="btn btn-outline-secondary rounded-1 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1 fs-bold" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                  </NuxtLink>
                  <a class="btn btn-outline-secondary rounded-1 px-2" @click="viewOrderModal(record)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye fs-bold" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </a>
                  <a class="btn btn-outline-danger rounded-1 px-2" @click="openDeleteModal(record)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </a>
                </div>
              </template>

            </Table>
          </div>
          
          <!-- Add/Edit Order Modal -->
          <transition name="modal-fade">
            <div v-if="showOrderModal" class="modal-overlay" @click.self="closeOrderModal">
              <div class="order-modal">
                <div class="modal-header-custom">
                  <h5 class="modal-title">{{ isEditMode ? isViewMode ? 'View Order' : 'Edit Order' : 'Add Order' }}</h5>
                  <button class="btn-close" @click="closeOrderModal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <form @submit.prevent="handleSubmit">
                  <div class="modal-body-custom">
                    
                    <h6 class="mb-3">Customer Information</h6>
                      
                    <div class="form-group mb-3">
                      <label class="form-label">Customer Name</label>
                      <div>
                        <input
                            v-model="orderForm.customer_name"
                            type="text"
                            class="form-control rounded-1"
                            readonly
                        >
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-group mb-3">
                          <label class="form-label">Contact Number One</label>
                          <input
                              v-model="orderForm.contact_number_one"
                              type="text"
                              class="form-control rounded-1"
                              readonly
                          >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group mb-3">
                          <label class="form-label">Contact Number Two</label>
                          <input
                              v-model="orderForm.contact_number_two"
                              type="text"
                              class="form-control rounded-1"
                              readonly
                          >
                        </div>
                      </div>
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label">Email</label>
                      <input
                          v-model="orderForm.email"
                          type="text"
                          class="form-control rounded-1"
                          readonly
                      >
                    </div>

                    <h6 class="mt-4 mb-3">Order Items</h6>
                    
                    <div v-if="orderForm.order_items && orderForm.order_items.length > 0" class="mb-3">
                      <div class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Sale Amount</th>
                              <th>Del Fee</th>
                              <th>Total</th>
                              <th>Invoiced</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in orderForm.order_items" :key="index">
                              <td>{{ item.product?.name || 'N/A' }}</td>
                              <td>{{ item.qty }}</td>
                              <td>Rs {{ item.sale_amount }}</td>
                              <td>Rs {{ item.del_fee }}</td>
                              <td>Rs {{ ((item.sale_amount * item.qty) + parseFloat(item.del_fee || 0)).toFixed(2) }}</td>
                              <td>
                                <span v-if="item.is_invoiced" class="badge badge-sm bg-green-lt">Yes</span>
                                <span v-else class="badge badge-sm bg-secondary">No</span>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colspan="4" class="text-end">Grand Total:</th>
                              <th colspan="2">Rs {{ calculateOrderTotal(orderForm.order_items) }}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div v-else class="alert alert-info">
                      No items in this order
                    </div>

                    <!-- Dummy fields to keep structure -->
                    <div class="row d-none">
                      <div class="col-md-6">
                        <div class="form-group mb-3">
                          <label class="form-label">Hidden</label>
                          <input
                              v-model="orderForm.city"
                              type="text"
                              class="form-control rounded-1"
                              placeholder="State"
                              :disabled="isViewMode"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer-custom">
                    <button type="button" class="btn btn-light rounded-1" @click="closeOrderModal">
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <!-- Status Change Modal -->
          <transition name="modal-fade">
            <div v-if="showStatusModal" class="modal-overlay" @click.self="closeStatusModal">
              <div class="confirm-modal">
                <div class="modal-header-custom">
                  <h5 class="modal-title">Change Order Status</h5>
                  <button class="btn-close-custom" @click="closeStatusModal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div class="modal-body-custom">
                  <div class="form-group">
                    <label class="form-label">New Status</label>
                    <div class="input-icon">
                      <Select
                        ref="statusChangeSelectRef"
                        :attributes="status_change_data"
                        :placeholder="'Select new status'"
                        @selectUpdates="selectNewStatus"
                      />
                      <span class="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                          class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                          fill="none"/><path d="M6 9l6 6l6 -6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-back" @click="closeStatusModal">
                    Cancel
                  </button>
                  <button type="button" class="btn-confirm ms-2" @click="handleStatusChange">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Delete Confirmation Modal -->
          <transition name="modal-fade">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
              <div class="confirm-modal">
                <div class="modal-header-custom">
                  <h5 class="modal-title">Delete Order</h5>
                  <button class="btn-close-custom" @click="closeDeleteModal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div class="modal-body-custom">
                  <p class="confirm-modal-message">Are you sure you want to delete this order? This action cannot be undone.</p>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-back" @click="closeDeleteModal">
                    Cancel
                  </button>
                  <button type="button" class="btn-delete ms-2" @click="handleDelete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})

const config = useRuntimeConfig()
const csrfToken = useCookie('XSRF-TOKEN')

const {$toast} = useNuxtApp()

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  if (process.client) {
    const cookies = document.cookie.split(';')
    const xsrfCookie = cookies.find(c => c.trim().startsWith('XSRF-TOKEN='))
    if (xsrfCookie) {
      const token = decodeURIComponent(xsrfCookie.split('=')[1])
      console.log('CSRF Token from document.cookie:', token)
      return token
    }
  }
  return ''
}

// Modal states
const showOrderModal = ref(false);
const showStatusModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const selectedOrderId = ref(null);

// Form data
const orderForm = ref({
  name: '',
  item_id: null,
  price: '',
  status: 'pending',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
  email: '',
  notes: '',
})

// Filter refs
const orderSearchRef = ref(null);
const statusSearchRef = ref(null);
const itemSelectRef = ref(null);
const statusSelectRef = ref(null);
const statusChangeSelectRef = ref(null);
const searchTerm = ref({});
const validationError = ref({});
const uploading = ref(false);

// Filters
const filters = ref({
  search: '',
  status: '',
});

// Status options
const status_options = [
  { id: 0, name: 'All', value: '' },
  { id: 1, name: 'Pending', value: 'pending' },
  { id: 2, name: 'Processing', value: 'processing' },
  { id: 3, name: 'Shipped', value: 'shipped' },
  { id: 4, name: 'Delivered', value: 'delivered' },
  { id: 5, name: 'Cancelled', value: 'cancelled' },
];

const status_data = ref({
  data: status_options,
  selected: null
});

const status_data_modal = ref({
  data: status_options.filter(s => s.value !== ''),
  selected: null
});

const status_change_data = ref({
  data: status_options.filter(s => s.value !== ''),
  selected: null
});

// Items data
const items_data = ref({
  data: [],
  selected: null
});

// Table attributes
const ordersTableAttributes = ref({
  table_id: "orders_table",
  cache: false,
  loading: false,
  check_box: false,
  labels: [
    { key: "order_number", name: "Order #", sort: true },
    { key: "customer_name", name: "Customer", sort: true },
    { key: "items", name: "Items", sort: false },
    { key: "total", name: "Total", sort: false },
    { key: "contact", name: "Contact", sort: false },
    { key: "location", name: "Location", sort: false },
    { key: "status", name: "Status", sort: false },
    { key: "actions", name: "Actions", sort: false }
  ],
  api_response: {},
  filters: {},
  table_component_values: {},
});

// Calculate order total from order items
const calculateOrderTotal = (orderItems) => {
  if (!orderItems || orderItems.length === 0) return '0.00'
  
  const total = orderItems.reduce((sum, item) => {
    const itemTotal = (parseFloat(item.sale_amount) * parseInt(item.qty)) + parseFloat(item.del_fee || 0)
    return sum + itemTotal
  }, 0)
  
  return total.toFixed(2)
}

watch(
  () => filters.value,
  (newFilters, oldFilters) => {
    updateOrderTableData();
  },
  { deep: true }
)

const searchOrders = (val) => {
  filters.value.search = val;
}

const selectOrderStatus = (selectedStatus) => {
  filters.value.status = selectedStatus.value;
}

const selectItem = (selectedItem) => {
  orderForm.value.item_id = selectedItem.value;
  // Auto-fill price from item
  const item = items_data.value.data.find(i => i.value === selectedItem.value);
  if (item && item.price) {
    orderForm.value.price = item.price;
  }
}

const selectStatus = (selectedStatus) => {
  orderForm.value.status = selectedStatus.value;
}

const selectNewStatus = (selectedStatus) => {
  newStatus.value = selectedStatus.value;
}

const submitButtonText = computed(() => {
  if (isEditMode.value) {
    return 'Save Changes'
  }
  return 'Create Order'
})

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'status-warning clickable-link',
    'processing': 'status-info clickable-link',
    'shipped': 'status-primary clickable-link',
    'delivered': 'status-success clickable-link',
    'cancelled': 'status-danger clickable-link',
  };
  return statusClasses[status] || 'status-gray clickable-link';
}

const clearFilters = () => {
  searchTerm.value = {};
  filters.value = {
    search: '',
    status: '',
  };
  orderSearchRef.value?.clearInput();
  statusSearchRef.value?.reset(); 
}

const ordersInputUpdates = (values) => {
  ordersTableAttributes.value.table_component_values = values;
  updateOrderTableData(
      values.page,
      values.per_page,
      values.sort.sort_input,
  );
}

const updateOrderTableData = async (page = 1, per_page = 15, sort = "") => {
  ordersTableAttributes.value.loading = true;
  
  try {
    
    const response = await $fetch("/api/admin/orders", {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken.value ? decodeURIComponent(csrfToken.value) : '',
        'X-Requested-With': 'XMLHttpRequest'
      },
      params: {
        per_page,
        page,
        search: filters.value.search,
        status: filters.value.status,
      }
    });

    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = isDesc ? sort.substring(1) : sort;
      response.data.data.sort((a, b) => {
        let aVal = a[sortKey] || '';
        let bVal = b[sortKey] || '';
        if (aVal < bVal) return isDesc ? 1 : -1;
        if (aVal > bVal) return isDesc ? -1 : 1;
        return 0;
      })
    }

    ordersTableAttributes.value.api_response = {
      ...response.data.meta,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    console.error('Error details:', {
      status: error?.status,
      statusCode: error?.statusCode,
      message: error?.message,
      data: error?.data
    });
    ordersTableAttributes.value.api_response = {
      total: 0,
      data: [],
    };
    $toast.error(error?.data?.message || 'Failed to fetch orders.');
  } finally {
    ordersTableAttributes.value.loading = false;
  }
}

const fetchItems = async () => {
  try {
    // Get CSRF token
    // await $fetch('/sanctum/csrf-cookie', {
    //   baseURL: config.public.apiUrl,
    //   credentials: 'include'
    // });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const csrfToken = getCsrfToken();

    const response = await $fetch("/api/admin/items/available", {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': csrfToken
      }
    });

    items_data.value.data = response.data.map(item => ({
      label: item.name,
      value: item.id,
      price: item.price
    }));
  } catch (error) {
    console.error('Failed to fetch items:', error);
    $toast.error('Failed to fetch items.');
  }
}

const openOrderAddModal = () => {
  validationError.value = {};
  isEditMode.value = false;
  isViewMode.value = false;
  orderForm.value = {
    name: '',
    item_id: null,
    price: '',
    status: 'pending',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    notes: '',
  };
  status_data_modal.value.selected = status_data_modal.value.data.find(s => s.value === 'pending');
  showOrderModal.value = true;
}

const openOrderUpdateModal = (order) => {
  validationError.value = {};
  isEditMode.value = true;
  isViewMode.value = false;
  selectedOrderId.value = order.id;
  orderForm.value = {
    name: order.name,
    item_id: order.item_id,
    price: order.price,
    status: order.status,
    address_line_1: order.address_line_1,
    address_line_2: order.address_line_2 || '',
    city: order.city,
    state: order.state || '',
    postal_code: order.postal_code,
    country: order.country,
    phone: order.phone || '',
    email: order.email || '',
    notes: order.notes || '',
  };
  items_data.value.selected = items_data.value.data.find(i => i.value === order.item_id);
  status_data_modal.value.selected = status_data_modal.value.data.find(s => s.value === order.status);
  showOrderModal.value = true;
}

const viewOrderModal = (order) => {
  validationError.value = {};
  isEditMode.value = true;
  isViewMode.value = true;
  selectedOrderId.value = order.id;
  orderForm.value = {
    customer_name: order.customer_name,
    address: order.address || '',
    city: order.city || '',
    contact_number_one: order.contact_number_one || '',
    contact_number_two: order.contact_number_two || '',
    email: order.email || '',
    other: order.other || '',
    due_date: order.due_date || '',
    lead_from: order.lead_from || 'facebook',
    status: order.status,
    notes: order.notes || '',
    order_items: order.order_items || []
  };
  status_data_modal.value.selected = status_data_modal.value.data.find(s => s.value === order.status);
  showOrderModal.value = true;
}

const closeOrderModal = () => {
  selectedOrderId.value = null;
  isViewMode.value = false;
  showOrderModal.value = false;
  items_data.value.selected = null;
  status_data_modal.value.selected = null;
}

const handleSubmit = () => {
  if (isEditMode.value) {
    updateOrder()
  } else {
    saveOrder()
  }
}

const saveOrder = async () => {
  uploading.value = true;
  try {
    const csrfToken = getCsrfToken();
    const response = await $fetch('/api/admin/orders', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: orderForm.value
    });

    if (response.data && $toast) {
      showOrderModal.value = false;
      $toast.success(response.message || 'Order created successfully');
      updateOrderTableData();
    }
  } catch (err) {
    if (err?.data?.errors) {
      validationError.value = err.data.errors;
    } else {
      $toast.error(err?.data?.message || 'Failed to create order.');
    }
  } finally {
    uploading.value = false;
  }
}

const updateOrder = async () => {
  uploading.value = true;
  try {
    const csrfToken = getCsrfToken();
    const response = await $fetch(`/api/admin/orders/${selectedOrderId.value}`, {
      method: 'PUT',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: orderForm.value,
    });

    if (response.data && $toast) {
      showOrderModal.value = false;
      $toast.success(response.message || 'Order updated successfully');
      updateOrderTableData(); 
    }
  } catch (err) {
    if (err?.data?.errors) {
      validationError.value = err.data.errors;
    } else {
      $toast.error(err?.data?.message || 'Failed to update order.');
    }
  } finally {
    uploading.value = false;
  }
}

const newStatus = ref('');
const openStatusChangeModal = (order) => {
  selectedOrderId.value = order.id;
  newStatus.value = '';
  status_change_data.value.selected = status_change_data.value.data.find(s => s.value === order.status);
  showStatusModal.value = true;
}

const closeStatusModal = () => {
  selectedOrderId.value = null;
  showStatusModal.value = false;
}

const handleStatusChange = async () => {
  if (!newStatus.value) {
    $toast.error('Please select a status');
    return;
  }
  try {
    const csrfToken = getCsrfToken();
    const response = await $fetch(`/api/admin/orders/${selectedOrderId.value}/status`, {
      method: 'PATCH',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: { status: newStatus.value }
    });

    if (response.data && $toast) {
      $toast.success(response.message || 'Status updated successfully');
      closeStatusModal();
      updateOrderTableData();
    }
  } catch (error) {
    $toast.error('Failed to update status.');
  }
}

const openDeleteModal = (order) => {
  selectedOrderId.value = order.id;
  showDeleteModal.value = true;
}

const closeDeleteModal = () => {
  selectedOrderId.value = null;
  showDeleteModal.value = false;
}

const handleDelete = async () => {
  try {
    const csrfToken = getCsrfToken();
    const response = await $fetch(`/api/admin/orders/${selectedOrderId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': csrfToken
      }
    });

    if ($toast) {
      $toast.success(response.message || 'Order deleted successfully');
      closeDeleteModal();
      updateOrderTableData();
    }
  } catch (error) {
    $toast.error('Failed to delete order.');
  }
}

// Initialize
onMounted(async () => {
  try {
    // Get CSRF cookie first
    // await $fetch('/sanctum/csrf-cookie', {
    //   baseURL: config.public.apiUrl,
    //   credentials: 'include'
    // });
    
    // Small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then fetch data - if this fails with 401, it means not authenticated
    await fetchItems();
  } catch (error) {
    console.error('Initialization error:', error);
    if (error?.status === 401 || error?.statusCode === 401) {
      // Clear localStorage and redirect to login
      if (process.client) {
        localStorage.removeItem('auth.user');
        localStorage.removeItem('auth.loggedIn');
      }
      $toast.error('Session expired. Please login again.');
      await navigateTo('/admin/auth/login');
    }
  }
})

useHead({
  title: 'Order Management',
  meta: [
    { name: 'description', content: 'Manage and view order information' }
  ]
})
</script>

<style scoped>
.status-warning {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #856404;
  background-color: #fff3cd;
  padding: 4px 15px;
  border-radius: 4px;
}

.status-info {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #004085;
  background-color: #cce5ff;
  padding: 4px 15px;
  border-radius: 4px;
}

.status-primary {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #004085;
  background-color: #b8daff;
  padding: 4px 15px;
  border-radius: 4px;
}

.status-success {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #155724;
  background-color: #d4edda;
  padding: 4px 15px;
  border-radius: 4px;
}

.status-danger {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #721c24;
  background-color: #f8d7da;
  padding: 4px 15px;
  border-radius: 4px;
}

.status-gray {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #858383;
  background-color: #ebebeb;
  padding: 4px 15px;
  border-radius: 4px;
}

.clickable-link {
  cursor: pointer;
}

.card-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 12px 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
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

.btn-confirm {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #0d6efd;
  border: 1px solid #0d6efd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
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

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.confirm-modal-message {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.order-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 650px;
  width: 100%;
  margin-block: 10px;
  animation: modal-slide-up 0.3s ease-out;
}

.confirm-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  animation: modal-slide-up 0.3s ease-out;
}

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

.modal-body-custom {
  padding: 24px;
  max-height: 80vh; 
  overflow-y: auto;
}

.modal-footer-custom {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #cecece;
  background-color: #e6e6e6;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-slide-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.validation-error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.badge-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  line-height: 1.2;
}

/* Mobile responsiveness for filter layout */
@media (max-width: 767px) {
  .card-body .row > .col-11,
  .card-body .row > .col-1 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .card-body .row > .col-1 {
    margin-top: 1rem;
  }
  
  .card-body .row > .col-1 .btn {
    width: 100%;
  }
}
</style>