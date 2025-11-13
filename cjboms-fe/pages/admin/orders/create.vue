<template>
  <div>
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row align-items-center">
          <div class="col">
            <div class="page-pretitle">Orders</div>
            <h2 class="page-title">Create New Order</h2>
          </div>
          <div class="col-auto ms-auto">
            <NuxtLink to="/admin/orders" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-1">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Orders
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="page-body">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <!-- Left Column -->
                <div class="col-md-6">
                  <div class="row g-3">
                    <!-- Customer Name -->
                    <div class="col-12">
                      <label class="form-label">Customer Name <span class="text-danger">*</span></label>
                      <input
                        v-model="orderForm.customer_name"
                        type="text"
                        class="form-control"
                        placeholder="Enter Customer Name"
                      >
                      <span v-if="validationError.customer_name" class="text-danger small">
                        {{ validationError.customer_name }}
                      </span>
                    </div>

                    <!-- Address -->
                    <div class="col-12">
                      <label class="form-label">Address</label>
                      <textarea
                        v-model="orderForm.address"
                        class="form-control"
                        placeholder="Enter Full Address"
                        rows="2"
                      ></textarea>
                      <span v-if="validationError.address" class="text-danger small">
                        {{ validationError.address }}
                      </span>
                    </div>

                    <!-- City Select -->
                    <div class="col-12">
                      <label class="form-label">City</label>
                      <select 
                        v-model="orderForm.city" 
                        class="form-select"
                      >
                        <option value="">Select City</option>
                        <option v-for="city in cities" :key="city" :value="city">
                          {{ city }}
                        </option>
                      </select>
                      <span v-if="validationError.city" class="text-danger small">
                        {{ validationError.city }}
                      </span>
                    </div>

                    <!-- Contact Numbers -->
                    <div class="col-12">
                      <label class="form-label">Contact Number One</label>
                      <input
                        v-model="orderForm.contact_number_one"
                        type="text"
                        class="form-control"
                        placeholder="Enter Primary Contact Number"
                      >
                    </div>

                    <div class="col-12">
                      <label class="form-label">Contact Number Two</label>
                      <input
                        v-model="orderForm.contact_number_two"
                        type="text"
                        class="form-control"
                        placeholder="Enter Secondary Contact Number"
                      >
                    </div>

                    <!-- Email -->
                    <div class="col-12">
                      <label class="form-label">Email</label>
                      <input
                        v-model="orderForm.email"
                        type="email"
                        class="form-control"
                        placeholder="Enter Email"
                      >
                    </div>

                    <!-- Other -->
                    <div class="col-12">
                      <label class="form-label">Other</label>
                      <textarea
                        v-model="orderForm.other"
                        class="form-control"
                        rows="2"
                        placeholder="Additional information"
                      ></textarea>
                    </div>

                    <!-- Due Date -->
                    <div class="col-12">
                      <label class="form-label">Due Date</label>
                      <input
                        v-model="orderForm.due_date"
                        type="date"
                        class="form-control"
                      >
                    </div>

                    <!-- Lead From -->
                    <div class="col-12">
                      <label class="form-label">Lead From</label>
                      <div class="d-flex flex-wrap gap-3">
                        <div class="form-check">
                          <input 
                            v-model="orderForm.lead_from" 
                            class="form-check-input" 
                            type="radio" 
                            value="facebook" 
                            id="leadFacebook"
                          >
                          <label class="form-check-label" for="leadFacebook">
                            Facebook
                          </label>
                        </div>
                        <div class="form-check">
                          <input 
                            v-model="orderForm.lead_from" 
                            class="form-check-input" 
                            type="radio" 
                            value="whatsapp" 
                            id="leadWhatsApp"
                          >
                          <label class="form-check-label" for="leadWhatsApp">
                            WhatsApp
                          </label>
                        </div>
                        <div class="form-check">
                          <input 
                            v-model="orderForm.lead_from" 
                            class="form-check-input" 
                            type="radio" 
                            value="advertisement" 
                            id="leadAdvertisement"
                          >
                          <label class="form-check-label" for="leadAdvertisement">
                            Advertisement
                          </label>
                        </div>
                        <div class="form-check">
                          <input 
                            v-model="orderForm.lead_from" 
                            class="form-check-input" 
                            type="radio" 
                            value="other" 
                            id="leadOther"
                          >
                          <label class="form-check-label" for="leadOther">
                            Other
                          </label>
                        </div>
                      </div>
                    </div>

                    <!-- Reset Button -->
                    <div class="col-12">
                      <button 
                        type="button" 
                        class="btn btn-sm btn-warning p-2"
                        @click="resetForm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-counterclockwise me-1" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                        </svg>
                        Reset Form
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="col-md-6">
                  <div class="row g-3">
                    <!-- Product Selector (duplicate for right side) -->
                    <div class="col-12">
                      <label class="form-label">Product</label>
                      <Select
                        ref="productSelectRef"
                        :attributes="products_data"
                        :placeholder="'Select Product'"
                        @selectUpdates="selectProduct"
                      />
                    </div>

                    <!-- Qty -->
                    <div class="col-12">
                      <label class="form-label">Qty <span class="text-danger">*</span></label>
                      <input
                        v-model="currentProduct.qty"
                        type="number"
                        class="form-control"
                        min="1"
                      >
                    </div>

                    <!-- Sale Amount -->
                    <div class="col-12">
                      <label class="form-label">Sale Amount (Rs) <span class="text-danger">*</span></label>
                      <input
                        v-model="currentProduct.sale_amount"
                        type="number"
                        class="form-control"
                        placeholder="Price per item"
                        step="0.01"
                      >
                    </div>

                    <!-- Del Fee -->
                    <div class="col-12">
                      <label class="form-label">Del Fee</label>
                      <input
                        v-model="currentProduct.del_fee"
                        type="number"
                        class="form-control"
                        min="0"
                        step="0.01"
                      >
                    </div>

                    <!-- Invoiced Order Checkbox -->
                    <div class="col-12">
                      <div class="form-check">
                        <input 
                          v-model="currentProduct.is_invoiced" 
                          class="form-check-input" 
                          type="checkbox" 
                          id="invoicedOrder"
                        >
                        <label class="form-check-label" for="invoicedOrder">
                          Invoiced Order
                        </label>
                      </div>
                    </div>

                    <!-- Add Product Button -->
                    <div class="col-12">
                      <button 
                        type="button" 
                        class="btn btn-warning w-100"
                        @click="addProduct"
                      >
                        Add Product
                      </button>
                    </div>

                    <!-- Added Products Section -->
                    <div class="col-12">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <h5 class="mb-0">Added Products</h5>
                        <span class="badge bg-red-lt">{{ addedProducts.length }}</span>
                      </div>
                      
                      <div v-if="addedProducts.length === 0" class="text-center text-muted py-5">
                        No products added!
                      </div>

                      <div v-else class="products-list">
                        <div 
                          v-for="(product, index) in addedProducts" 
                          :key="index"
                          class="product-item d-flex justify-content-between align-items-center p-2 border-bottom"
                        >
                          <div class="flex-grow-1">
                            <div class="d-flex align-items-center gap-2 mb-1">
                              <strong>{{ product.name }}</strong>
                              <span v-if="product.is_invoiced" class="badge badge-sm bg-green-lt">Invoiced</span>
                            </div>
                            <div class="small text-muted">
                              Qty: {{ product.qty }} | 
                              Sale: Rs {{ product.sale_amount }} | 
                              Del Fee: Rs {{ product.del_fee }}
                            </div>
                          </div>
                          <button 
                            type="button" 
                            class="btn btn-sm btn-ghost-danger"
                            @click="removeProduct(index)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="mt-4 d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  class="btn btn-light px-4"
                  @click="$router.push('/admin/orders')"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-info px-4"
                  :disabled="uploading || addedProducts.length === 0"
                >
                  <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ addedProducts.length === 0 ? 'Please Add Products' : 'Create Order' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard-admin'
})

const config = useRuntimeConfig()
const {$toast} = useNuxtApp()

const getCsrfToken = () => {
  if (process.client) {
    const cookies = document.cookie.split(';')
    const xsrfCookie = cookies.find(c => c.trim().startsWith('XSRF-TOKEN='))
    if (xsrfCookie) {
      return decodeURIComponent(xsrfCookie.split('=')[1])
    }
  }
  return ''
}

const orderForm = ref({
  customer_name: '',
  address: '',
  city: '',
  contact_number_one: '',
  contact_number_two: '',
  email: '',
  other: '',
  due_date: '',
  lead_from: 'facebook',
  status: 'pending',
  notes: ''
})

const currentProduct = ref({
  product_id: null,
  qty: 1,
  sale_amount: '',
  del_fee: 0,
  is_invoiced: false
})
const itemSelectRef = ref(null)
const productSelectRef = ref(null)
const validationError = ref({})
const uploading = ref(false)
const addedProducts = ref([])

const cities = ref([
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose'
])

const items_data = ref({
  data: [],
  selected: null
})

const products_data = ref({
  data: [],
  selected: null
})

const selectProduct = (selectedProduct) => {
  const product = products_data.value.data.find(p => p.value === selectedProduct.value)
  if (product) {
    currentProduct.value.product_id = product.value
    currentProduct.value.sale_amount = product.price || ''
  }
}

const resetForm = () => {
  orderForm.value = {
    customer_name: '',
    address: '',
    city: '',
    contact_number_one: '',
    contact_number_two: '',
    email: '',
    other: '',
    due_date: '',
    lead_from: 'facebook',
    status: 'pending',
    notes: ''
  }
  validationError.value = {}
  $toast.info('Form reset successfully')
}

const addProduct = () => {
  if (!currentProduct.value.product_id) {
    $toast.error('Please select a product')
    return
  }

  if (!currentProduct.value.qty || currentProduct.value.qty < 1) {
    $toast.error('Please enter a valid quantity')
    return
  }

  if (!currentProduct.value.sale_amount) {
    $toast.error('Please enter a sale amount')
    return
  }

  const product = items_data.value.data.find(i => i.value === currentProduct.value.product_id)
  if (product) {
    addedProducts.value.push({
      product_id: currentProduct.value.product_id,
      name: product.name,
      qty: currentProduct.value.qty,
      sale_amount: parseFloat(currentProduct.value.sale_amount),
      del_fee: parseFloat(currentProduct.value.del_fee) || 0,
      is_invoiced: currentProduct.value.is_invoiced
    })
    
    $toast.success('Product added successfully')
    
    // Reset product fields
    currentProduct.value = {
      product_id: null,
      qty: 1,
      sale_amount: '',
      del_fee: 0,
      is_invoiced: false
    }
    products_data.value.selected = null
  }
}

const removeProduct = (index) => {
  addedProducts.value.splice(index, 1)
  $toast.info('Product removed')
}

const fetchItems = async () => {
  try {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const csrfToken = getCsrfToken()

    const response = await $fetch("/api/admin/items/available", {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': csrfToken
      }
    })

    items_data.value.data = response.data.map(item => ({
      id: item.id,
      name: item.name,
      value: item.id,
      price: item.price
    }))
    
    products_data.value.data = [...items_data.value.data]
  } catch (error) {
    console.error('Failed to fetch items:', error)
    $toast.error('Failed to fetch items.')
  }
}

const handleSubmit = async () => {
  if (addedProducts.value.length === 0) {
    $toast.error('Please add at least one product')
    return
  }

  uploading.value = true
  validationError.value = {}
  
  try {
    const csrfToken = getCsrfToken()
    
    // Prepare order items in the format backend expects
    const order_items = addedProducts.value.map(product => ({
      product_id: product.product_id,
      qty: product.qty,
      sale_amount: product.sale_amount,
      del_fee: product.del_fee,
      is_invoiced: product.is_invoiced
    }))
    
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
      body: {
        customer_name: orderForm.value.customer_name,
        address: orderForm.value.address,
        city: orderForm.value.city,
        contact_number_one: orderForm.value.contact_number_one,
        contact_number_two: orderForm.value.contact_number_two,
        email: orderForm.value.email,
        other: orderForm.value.other,
        due_date: orderForm.value.due_date,
        lead_from: orderForm.value.lead_from,
        status: orderForm.value.status,
        notes: orderForm.value.notes,
        order_items: order_items
      }
    })

    if (response.data && $toast) {
      $toast.success(response.message || 'Order created successfully')
      await navigateTo('/admin/orders')
    }
  } catch (err) {
    if (err?.data?.errors) {
      validationError.value = err.data.errors
    } else {
      $toast.error(err?.data?.message || 'Failed to create order.')
    }
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  try {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: config.public.apiUrl,
      credentials: 'include'
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    await fetchItems()
    
    // Set default status
    orderForm.value.status = 'pending'
  } catch (error) {
    console.error('Initialization error:', error)
    if (error?.status === 401 || error?.statusCode === 401) {
      if (process.client) {
        localStorage.removeItem('auth.user')
        localStorage.removeItem('auth.loggedIn')
      }
      $toast.error('Session expired. Please login again.')
      await navigateTo('/admin/auth/login')
    }
  }
})

useHead({
  title: 'Create Order - Order Management',
})
</script>

<style scoped>
.form-label {
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 4px;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  font-size: 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
}

.products-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #f8fafc;
}

.product-item {
  background: white;
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f8fafc;
}

.product-item:last-child {
  border-bottom: none;
}

.btn-ghost-danger {
  color: #dc2626;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
}

.btn-ghost-danger:hover {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge {
  font-size: 11px;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
}

.badge-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  line-height: 1.2;
}

.badge.rounded-circle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

.text-danger.small {
  display: block;
  margin-top: 0.25rem;
  font-size: 12px;
}

.input-group-text {
  padding: 0.5rem 0.75rem;
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  font-size: 14px;
}

.flex-grow-1 {
  flex-grow: 1;
}

.btn-info {
  background-color: #06b6d4;
  border-color: #06b6d4;
  color: white;
}

.btn-info:hover {
  background-color: #0891b2;
  border-color: #0891b2;
}

.btn-info:disabled {
  background-color: #a5f3fc;
  border-color: #a5f3fc;
  opacity: 0.65;
}
</style>