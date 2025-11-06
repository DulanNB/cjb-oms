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
                    <!-- Product Name Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Name</label>
                      <div class="input-icon">
                        <FilterSearch
                            ref="productNameSearchRef"
                            v-model="productName"
                            :placeholder="'Enter Product Name'"
                            @queryUpdates="searchByProductName"
                        />
                        <span class="input-icon-addon">
                          <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                            <path d="M21 21l-6 -6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Product Status Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Status</label>
                      <div class="input-icon">
                        <Select
                          ref="productStatusSearchRef"
                          :attributes="is_active_data"
                          :placeholder="'Select status'"
                          @selectUpdates="selectProductStatus"
                        />
                        <span class="input-icon-addon">
                          <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                            class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                            fill="none"/><path d="M6 9l6 6l6 -6" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Stock Status Filter -->
                    <div class="col-md-3">
                      <label class="form-label text-muted fs-4 mb-1 fw-semibold">Stock Status</label>
                      <div class="input-icon">
                        <Select
                          ref="productStockTypeSearchRef"
                          :attributes="is_stock_available_data"
                          :placeholder="'Select status'"
                          @selectUpdates="selectProductStockStatus"
                        />
                        <span class="input-icon-addon">
                          <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
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

          <!-- Products Table -->
          <div class="card overflow-hidden">
            <div class="card-header d-flex justify-content-between">
              <div>
                <h3 class="card-title">Products</h3>
              </div>
              <div>
                <button type="button" class="btn default-btn-with-only-border" @click="openProductAddModal"> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                  </svg>
                  <span class="ms-1">
                    Add New
                  </span>
                </button>
              </div>
            </div>

            <Table :attributes="productsTableAttributes" class="mb-3" @inputUpdates="productsInputUpdates">
              <template #product_image="{ record }">
                <span class="item-image-display" :style="{ backgroundImage: `url(${record.temporary_img_url})` }"></span>
              </template>

              <template #product_name="{ record }">
                <span>
                  {{ record.name }}
                </span>
              </template>

              <template #sku="{ record }">
                <span>{{ record.sku }}</span>
              </template>
              
              <template #dosage="{ record }">
                <span>{{ record.dosage }}</span>
              </template>
              
              <template #price="{ record }">
                <span>£{{ record.price }}</span>
              </template>
              
              <template #status="{ record }">
                <span v-if="record.is_active == 1" class="status-gray clickable-link" @click.prevent="openConfirmModal(record, 'active')">
                  Active
                </span>
                <span v-else class="status-red clickable-link" @click.prevent="openConfirmModal(record, 'active')">
                  Inactive
                </span>
              </template>

              <template #stock_status="{ record }">
                <span v-if="record.is_stock_available == 1" class="status-green clickable-link" @click.prevent="openConfirmModal(record, 'stock')">
                  in Stock
                </span>
                <span v-else class="status-white clickable-link" @click.prevent="openConfirmModal(record, 'stock')">
                  <i class="red-dot"></i>
                  Out of Stock
                </span>
              </template>

              <template #actions="{ record }">
                <!-- update record -->
                <div class="d-flex gap-2">
                  <a class="btn btn-outline-secondary rounded-1 px-2" @click="openProductUpdateModal(record)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1 fs-bold" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    Edit
                  </a>
                  <!-- view record -->
                  <a class="btn btn-outline-secondary rounded-1 px-2" @click="viewProductModal(record)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye fs-bold" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </a>
                </div>
              </template>

            </Table>
          </div>
          
          <!-- Modals -->
          <!-- Add/Edit Product Modal -->
          <transition name="modal-fade">
            <div v-if="showProductModal" class="modal-overlay" @click.self="closeProductModal">
              <div class="product-modal">
                <div class="modal-header-custom">
                  <h5 class="modal-title">{{ isEditMode ? isViewMode ? 'View Item' : 'Edit Item' : 'Add Item' }}</h5>
                  <button class="btn-close" @click="closeProductModal" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <form @submit.prevent="handleSubmit">
                  <div class="modal-body-custom">
                      
                    <div class="form-group mb-3">
                      <label class="form-label">Name <span class="text-danger">*</span></label>
                      <div>
                        <input
                            v-model="productForm.name"
                            type="text"
                            class="form-control rounded-1"
                            placeholder="Enter name"
                            :disabled="isViewMode == true"
                            @input="validate('required|max:50', productForm.name, 'name')"
                        >
                        <span class="validation-error-message">
                          {{ Array.isArray(validationError.name) ? validationError.name[0] 
                                                                 : validationError.name }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="form-group mb-3">
                      <label class="form-label">SKU</label>
                      <div>
                        <input
                            v-model="productForm.sku"
                            type="text"
                            class="form-control rounded-1"
                            placeholder="Enter SKU"
                            :disabled="isViewMode == true"
                            @input="validate('max:255', productForm.sku, 'sku')"
                        >
                        <span class="validation-error-message">
                          {{ Array.isArray(validationError.sku) ? validationError.sku[0] 
                                                                 : validationError.sku }}
                        </span>
                      </div>
                    </div>

                    <div class="form-group mb-3">
                      <div class="form-label">Transport Type <span class="text-danger">*</span></div>
                      <div class="input-icon">
                        <Select
                          ref="productTransportTypeSearchRef"
                          :attributes="transport_type_data"
                          :placeholder="'Select transport type'"
                          :disabled="isViewMode == true"
                          @selectUpdates="selectTransportType"
                        />
                        <span class="input-icon-addon">
                          <!-- Download SVG icon from http://tabler.io/icons/icon/search -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                            class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" 
                            fill="none"/><path d="M6 9l6 6l6 -6" />
                          </svg>
                        </span>
                      </div>
                      <span class="validation-error-message">
                        {{ Array.isArray(validationError.is_cold_chain) ? validationError.is_cold_chain[0] 
                                                                : validationError.is_cold_chain }}
                      </span>
                    </div>
                    
                    <div class="form-group mb-3">
                      <div class="form-label">Unit/strength <span class="text-danger">*</span></div>
                      <div class="input-group">
                        <input
                            v-model="productForm.quantity"
                            type="number"
                            step="0.01"
                            class="form-control flex-grow-1 rounded-left-custom"
                            placeholder="Enter strength"
                            :disabled="isViewMode == true"
                            @input="validate('required|number|zero|positive', productForm.quantity, 'dosage')"
                            @change="updateUnitValue"
                        >
                        <div class="unit-field-width">
                          <Select
                            :attributes="dosage_units_data"
                            :disabled="isViewMode == true"
                            @selectUpdates="updateUnitValue"
                          />
                        </div>
                      </div>
                      
                      <span class="validation-error-message">
                        {{ Array.isArray(validationError.dosage) ? validationError.dosage[0] 
                                                                : validationError.dosage }}
                      </span>
                    </div>

                    <div class="form-group mb-4">
                      <label class="form-label">Price <span class="text-danger">*</span></label>
                      <div>
                        <div class="input-group mb-2">
                          <span class="input-group-text rounded-left-custom"> £ </span>
                          <input
                              v-model="productForm.price"
                              type="number"
                              class="form-control rounded-right-custom"
                              placeholder="Enter Price"
                              step="0.01"
                              :disabled="isViewMode == true"
                              @input="validate('required|number|zero|positive', productForm.price, 'price')"
                          >
                        </div>
                        <span class="validation-error-message">
                          {{ Array.isArray(validationError.price) ? validationError.price[0] 
                                                                  : validationError.price }}
                        </span>
                      </div>
                    </div>

                    <div class="form-group row mb-4">
                      <div>
                        <FileUploadField
                          label="Product Image"
                          :width=100
                          :height=100
                          :disableFileUpload="disableFileUpload"
                          :existingImage="productForm.temporary_img_url"
                          @setFileKey="setFileKey"
                          @removeFileKey="removeFileKey"
                          @fileUploading="disableButton"
                        />
                      </div>
                      <span class="validation-error-message mt-1">
                        {{ Array.isArray(validationError.file) ? validationError.file[0] 
                                                                  : validationError.file }}
                      </span>
                    </div>
                    
                    <div class="form-group">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">Note</label>
                        <span class="char-count">{{ productForm.note?.length }}/100</span>
                      </div>
                      <textarea
                          v-model="productForm.note"
                          class="form-control rounded-1"
                          rows="5"
                          placeholder="Add your note here..."
                          maxlength="100"
                          :disabled="isViewMode == true"
                          @input="validate('max:100', productForm.note, 'note')"
                        ></textarea>
                        <span class="validation-error-message">
                          {{ Array.isArray(validationError.note) ? validationError.note[0] 
                                                                  : validationError.note }}
                        </span>
                    </div>

                  </div>
                  <div class="modal-footer-custom">
                    <button type="button" class="btn btn-light rounded-1" @click="closeProductModal" :disabled="fileUploading || uploading ">
                      Back
                    </button>
                    <button type="submit" class="default-btn d-flex justify-content-between " :disabled="fileUploading">
                      <span v-if="uploading" class="me-2">
                        <span class="loader"></span>
                      </span>
                      {{ submitButtonText }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>

          <!-- Confirmation Modal -->
          <transition name="modal-fade">
            <div v-if="showConfirmModal" class="modal-overlay" @click.self="cancelConfirmation">
              <div class="confirm-modal">
                <div class="modal-header-custom">
                  <h5 class="modal-title">{{ confirmModalTitle }}</h5>
                  <button class="btn-close-custom" @click="cancelConfirmation" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div class="modal-body-custom">
                  <p class="confirm-modal-message">{{ confirmModalMessage }}</p>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-back" @click.prevent="cancelConfirmation">
                    Cancel
                  </button>
                  <button type="button" class="btn-delete ms-2" @click.once.prevent="handleConfirmModalSubmit">
                    Confirm
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
import { is_active, is_stock_available, transport_type, dosage_units } from '~/constants/constants.js';

// Define layout for Nuxt 3
definePageMeta({
  layout: 'dashboard-admin'
})
// get tost message 
const {$toast, $validation} = useNuxtApp()
// Runtime config
const config = useRuntimeConfig();
// Get CSRF token from cookie
const csrfCookie = useCookie('XSRF-TOKEN');
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : '';

// Modal states
const showProductModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const selectedProductId = ref(null);

// confirm modal 
const showConfirmModal = ref(false);
const updatingStatusType = ref('');
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');

// product modal form
const productForm = ref({
  name: '',
  sku: '',
  is_cold_chain: '',
  quantity: null,
  unit: 'mg',
  dosage: '',
  price: '',
  item_image_key: '',
  file: null,
  note: '',
  temporary_img_url: null,
})

// filter search references
const productStatusSearchRef = ref(null);
const productStockTypeSearchRef = ref(null);
const productTransportTypeSearchRef = ref(null);
const productNameSearchRef = ref(null);
const productName = ref({});
const validationError = ref({});

// for file upload component variables
// file upload
const fileUploading = ref(false);
// file upload component disable
const disableFileUpload = ref(false);
// uploading bar enable/disable
const uploading = ref(false);

// Reactive state
const filters = ref({
  isActive: '',
  productName: '',
  stockStatus: '',
});

// update active status and stock type status for select component
const is_active_data = ref({
  data: is_active,
  selected: null
})
const is_stock_available_data = ref({
  data: is_stock_available,
  selected: null
})
// for transport type field
const transport_type_data = ref({
  data: transport_type,
  selected: null
})

// for dosage units field
const dosage_units_data = ref({
  data: dosage_units,
  selected: null
})

// Table attributes
const productsTableAttributes = ref({
  table_id: "patients_table",
  cache: false,
  loading: false,
  check_box: false,
  labels: [
    { key: "product_image", name: "", sort: false },
    { key: "name", name: "Product Name", sort: true },
    { key: "sku", name: "SKU", sort: true },
    { key: "dosage", name: "Unit/stre..", sort: true },
    { key: "price", name: "Price", sort: true },
    { key: "status", name: "Status", sort: false },
    { key: "stock_status", name: "Stock Status", sort: false },
    { key: "actions", name: "Actions", sort: false }
  ],
  api_response: {},
  filters: {},
  table_component_values: {},
});

watch(
  () => filters.value,
  (newFilters, oldFilters) => {
    updateProductTableData();
  },
  { deep: true }
)

// validate fields
const validate = (validation, value, label) => {
  let validationMessage = $validation(validation, value);
  // check there is any validation error
  if (validationMessage) {
    validationError.value[label] = validationMessage;
  } else {
    delete validationError.value[label];
  }
}

// disable submit button
const disableButton = (boolean) => {
  fileUploading.value = boolean;
}

// trigger when type in the product name filter
const searchByProductName = (val) => {
  filters.value.productName = val;
}

// filter product status when select
const selectProductStatus = (selectedStatus) => {
  filters.value.isActive = selectedStatus.value;
}

// filter product stock type when select
const selectProductStockStatus = (selectedStockStatus) => {
  filters.value.stockStatus = selectedStockStatus.value;
}

// selected transport type
const selectTransportType = (selectedTransportType) => {
  productForm.value.is_cold_chain = selectedTransportType.value;
}

// get the image key
const setFileKey = (file) => {
  productForm.value.file = {
    key: file.key,   // the file path on storage
    name: file.name  // original filename
  }
}

// get the image key
const removeFileKey = async () => {
  // if selected product id is null
  if (!selectedProductId.value) {
    productForm.value.file = null;
    return Promise.resolve();
  }

  // memorize item file is change because we need that in update request file
  productForm.value.temporary_img_url = null;
  // otherwise wait for backend removal
  return removeItemFile();
}

// update the submit button text
const submitButtonText = computed(() => {
  if (isEditMode.value) {
    return isViewMode.value ? 'Edit item' : 'Save Changes'
  }
  return 'Add Item'
})

// clear filters
const clearFilters = () => {
  productName.value = {};
  filters.value = {
    isActive: '',
    productName: '',
    stockStatus: '',
  };
  productNameSearchRef.value.clearInput();
  productStatusSearchRef.value.reset(); 
  productStockTypeSearchRef.value.reset(); 
}

const productsInputUpdates = (values) => {
  productsTableAttributes.value.table_component_values = values;
  updateProductTableData(
      values.page,
      values.per_page,
      values.sort.sort_input,
  );
}

const updateProductTableData = async (page = 1, per_page = 15, sort = "") => {
  // activate loading
  productsTableAttributes.value.loading = true;
  try {
    const response = await $fetch("/api/admin/items", {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      params: {
        per_page,
        page,
        'filter[is_active]': filters.value.isActive,
        'filter[name]': filters.value.productName,
        'filter[is_stock_available]': filters.value.stockStatus,
      }
    });

    // Apply sorting
    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = isDesc ? sort.substring(1) : sort;

      response.data.sort((a, b) => {
        let aVal = a[sortKey] || '';
        let bVal = b[sortKey] || '';

        if (sortKey.includes('date')) {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return isDesc ? 1 : -1;
        if (aVal > bVal) return isDesc ? -1 : 1;
        return 0;
      })
    }
    // for update the table with new data
    productsTableAttributes.value.api_response = {
      ...response.meta,    // for keep pagination details
      data: response.data, // for display table data 
    };
  } catch (error)
  {
    productsTableAttributes.value.api_response = {
      total: 0,
      data: [],
    };
    $toast.error('Failed to fetched product data.');
  } finally {
    // deactivate loading
    productsTableAttributes.value.loading = false;
  }
}

// break the dosage value when its came from BE
const breakDosageValue = (dosage) => {
  if (!dosage) return;

  // get quantity and unit separately
  const match = dosage.match(/^([\d.]+)\s*(\w+)$/);
 
  if (match) {
    // get quantity of the dosage
    productForm.value = {
      quantity: parseFloat(match[1]),
    };
    // find the matching dosage unite
    dosage_units_data.value.selected = dosage_units_data.value.data.find(
      (unit) => unit.value === match[2]
    );
  }
};

// get the dosage unit
const updateUnitValue = (dosageUnits) => {
  productForm.value.dosage = `${productForm.value.quantity} ${dosageUnits.value}`;
};

// open product add modal
const openProductAddModal = () => {
  // set default selected value for dosage units
  dosage_units_data.value.selected = dosage_units_data.value.data.find(
    (unit) => unit.value === 'mg'
  );
  //remove validation errors value
  validationError.value = {};
  isEditMode.value = false;
  isViewMode.value = false;
  productForm.value = {
    name: '',
    sku: '',
    is_cold_chain: '',
    quantity: null,
    unit: 'mg',
    dosage: '',
    price: '',
    item_image_key: '',
    note: '',
    temporary_img_url: null,
  }
  showProductModal.value = true;
}

// open update product modal
const openProductUpdateModal = (product) => {
  //remove validation errors value
  validationError.value = {};
  isEditMode.value = true;
  isViewMode.value = false;
  // get the selected product id
  selectedProductId.value = product.id;
  // break dosage value
  breakDosageValue(product.dosage);
  productForm.value = {
    ...productForm.value,
    name: product.name,
    dosage: product.dosage,
    sku: product.sku,
    is_cold_chain: product.is_cold_chain == 1 ? true : false,
    price: product.price,
    note: product.note ?? '',
    temporary_img_url: product.temporary_img_url,
  }
  // find the matching transport type
  transport_type_data.value.selected = transport_type_data.value.data.find(
    (t) => t.value === productForm.value.is_cold_chain
  );
  showProductModal.value = true;
}

// open view product modal
const viewProductModal = (product) => {
  // disable file upload component
  disableFileUpload.value = true;
  //remove validation errors value
  validationError.value = {};
  isEditMode.value = true;
  isViewMode.value = true;
  // get the selected product id
  selectedProductId.value = product.id;
  // break dosage value
  breakDosageValue(product.dosage);
  productForm.value = {
    ...productForm.value,
    name: product.name,
    dosage: product.dosage,
    sku: product.sku,
    is_cold_chain: product.is_cold_chain == 1 ? true : false,
    price: product.price,
    note: product.note ?? '',
    temporary_img_url: product.temporary_img_url,
  }
  // find the matching transport type
  transport_type_data.value.selected = transport_type_data.value.data.find(
    (t) => t.value === productForm.value.is_cold_chain
  );
  showProductModal.value = true;
}

// close product modal
const closeProductModal = () => {
  // remove the selected product id
  selectedProductId.value = null;
  // enable file upload component
  disableFileUpload.value = false;
  isViewMode.value = false;
  // check if modal close after removing image file then we need to update the table data
  if(isEditMode.value && productForm.value.temporary_img_url == null)
  {
    updateProductTableData()
    showProductModal.value = false;
  } else {
    showProductModal.value = false;
  }
  productForm.value = {
    name: '',
    sku: '',
    is_cold_chain: '',
    quantity: null,
    unit: 'mg',
    dosage: '',
    price: '',
    item_image_key: '',
    note: '',
    temporary_img_url: null,
  }
  // remove selected values
  transport_type_data.value.selected = null;
  // set default value is mg
  dosage_units_data.value.selected = dosage_units_data.value.data.find(
    (unit) => unit.value === 'mg'
  );
}

// handle submit button
const handleSubmit = () => {
  if (isEditMode.value) {
    if (isViewMode.value) {
      // if view mode and edit mode on then submit button click
      // then we need to disable view mode
      isViewMode.value = false;
      disableFileUpload.value = false
    } else {
      // only edit mode is true then we need to call updateItem function
      updateItem()
    }
  } else {
    // if edit mode is false then we need to call saveIItem function
    saveItem()
  }
}

// validate before sending to the backend
const validateForm = () => {
  validate('required|max:50', productForm.value.name, 'name');
  validate('max:255', productForm.value.sku, 'sku');
  validate('required|max:255', productForm.value.dosage, 'dosage');
  validate('required|number|zero|positive', productForm.value.price, 'price');
  validate('max:100', productForm.value.note, 'note');
  validate('required', productForm.value.is_cold_chain, 'is_cold_chain');
  // check if is edit mode on then we need to check there have temporary image if not required file
  if (isEditMode.value && !productForm.value.temporary_img_url) {
      validate('required', productForm.value.file, 'file');
  } // else is not edit mode then we must required file
  else if(!isEditMode.value) {
    validate('required', productForm.value.file, 'file');
  }
  // Check if there are any validation errors
  return Object.keys(validationError.value).length > 0; 
}

// update product data
const updateItem = async () => {
  // check is there any validation error
  const hasValidationError = validateForm();
  if (hasValidationError) return;
  // enable loading 
  uploading.value = true;
  try {
    // send request
    const response = await $fetch(`/api/admin/items/${selectedProductId.value}`, {
      method: 'PUT',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: productForm.value,
    });

    if (response.success && $toast) {
      // hide modal
      showProductModal.value = false;
      $toast.success(response.success);
      updateProductTableData(); 
    }
  } catch (err)
  {
    // check validation errors have
    if (err?.data?.errors) {
      validationError.value = err.data.errors;
    } else {
      $toast.error('Failed to update item details.');
    }
  } finally {
    // disable loading
    uploading.value = false;
  }
}

// create new product
const saveItem = async () => {
  // check is there any validation error
  const hasValidationError = validateForm();
  if (hasValidationError) return;
  // enable loading 
  uploading.value = true;
  try {
    // send request
    const response = await $fetch('/api/admin/items', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: productForm.value
    });

    // if response is success then show success toast and return to the index page 
    if (response.success && $toast) {
      // hide modal
      showProductModal.value = false;
      $toast.success(response.success);
      updateProductTableData();
    }
  } catch (err)
  {
    if (err?.data?.errors) {
      validationError.value = err.data.errors;
    } else {
      $toast.error('Failed to create product.');
    }
  } finally {
    // disable loading
    uploading.value = false;
  }
}

// remove product item file
const removeItemFile = async () => {
  // enable loading 
  uploading.value = true;
  try {
    // send request
    const response = await $fetch(`/api/admin/items/${selectedProductId.value}/remove-file`, {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (response.success && $toast) {
      $toast.success(response.success);
    }
  } catch (err)
  {
    $toast.error('Failed to remove item file.');
  } finally {
    // disable loading
    uploading.value = false;
  }
}
// show and close confirm modal
const openConfirmModal = (record, type) => {
  // save the item id
  selectedProductId.value = record.id;
  updatingStatusType.value = type;
  // set confirm modal title and message
  if (type === "stock") {
    confirmModalMessage.value = "Are you sure you want to change the stock status?";
    confirmModalTitle.value = "Stock Status Change";
  } else if (type === "active") {
    confirmModalMessage.value = "Are you sure you want to change the item status?";
    confirmModalTitle.value = "Item Status Change";
  }
  // display confirm modal
  showConfirmModal.value = true;
}

const cancelConfirmation = () => {
  // remove the selected product id
  selectedProductId.value = null;
  // hide confirm modal
  showConfirmModal.value = false;
}

// handle confirm modal submit button
const handleConfirmModalSubmit = () => {
  if(updatingStatusType.value == 'stock')
  {
    changeItemStockType();
  } else if(updatingStatusType.value == 'active')
  {
    updateItemStatus();
  }
}


// send request to change the item stock status
const changeItemStockType = async () => {
  try {
    // send request
    const response = await $fetch(`/api/admin/items/${selectedProductId.value}/update-stock-status`, {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (response.success && $toast) {
      $toast.success(response.success);
      cancelConfirmation();
      updateProductTableData();
    }
  } catch(error)
  {
    $toast.error('Failed to update item stock status.');
    cancelConfirmation();
    updateProductTableData();
  }
}

// send request to change the item status
const updateItemStatus = async () => {
  try {
    // send request
    const response = await $fetch(`/api/admin/items/${selectedProductId.value}/update-status`, {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    if (response.success && $toast) {
      $toast.success(response.success);
      cancelConfirmation();
      updateProductTableData();
    }
  } catch(error)
  {
    $toast.error('Failed to update item active status.');
    cancelConfirmation();
    updateProductTableData();
  }
}

// Set page title and meta for Nuxt 3
useHead({
  title: 'Product Management',
  meta: [
    { name: 'description', content: 'Manage and view product information' }
  ]
})
</script>

<style scoped>
/* Custom styles for pixel-perfect design */
/* Form styling */
.form-select-sm {
  font-size: 13px;
  padding: 6px 8px;
}

/* Status badge styling */
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

.status-red {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #ad3131;
  background-color: #fad0d0;
  padding: 4px 10px;
  border-radius: 4px;
}

.status-white {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #9c9c9c;
  border: 2px solid #c6c6c6;
  padding: 4px 10px;
  border-radius: 4px;
}

.status-green {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #36b052;
  border: 1px solid #36b052;
  padding: 4px 24px;
  border-radius: 4px;
}

.clickable-link {
  cursor: pointer;
}

/* Table header styling */
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

/* Filter form styling */
.card-body {
  padding: 16px;
}

.form-label {
  margin-bottom: 4px;
  font-weight: 500;
}

.item-image-display {
  display: block;
  width: 100px;
  height: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f8f8f8;
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

/* Loader styles */
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

/* unit field style */
.unit-field-width {
  flex: 0 0 45px;
  max-width: 45px; 
}

.unit-field-width .select-input-field {
  margin-top: 0px !important;
  padding: 8px 8px !important;
}

.confirm-modal-message {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Product Modal */
.product-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 650px;
  width: 100%;
  margin-block: 10px;
  animation: modal-slide-up 0.3s ease-out;
}

/* confirm Modal */
.confirm-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  animation: modal-slide-up 0.3s ease-out;
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

/* Modal Body */
.modal-body-custom {
  padding: 24px;
  max-height: 80vh; 
  overflow-y: auto;
}

/* Modal Footer */
.modal-footer-custom {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #cecece;
  background-color: #e6e6e6;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
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