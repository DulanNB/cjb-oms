<!-- components/patient/OrderHistoryTab.vue -->
<template>
  <div class="tab-content">
    <!-- Filter Form -->
    <div class="card mb-3">
      <div class="card-body py-3">
        <div class="filter-row">
          <label class="form-label text-muted fs-13 mb-1">Shipment ID</label>
          <div class="d-flex align-items-center gap-2">
            <div class="input-group input-group-sm filter-input-group" style="max-width: 260px;">
              <input
                  v-model="shipmentFilter.shipmentId"
                  type="text"
                  class="form-control form-control-sm py-2"
                  placeholder="Search"
              >
              <span class="input-group-text"><i class="ti ti-search"></i></span>
            </div>
            <button class="btn btn-light btn-sm filter-clear-btn ms-auto py-2" style="min-width: 100px;" @click="clearOrderFilters">
              Clear Filter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Prescriptions Table -->
    <div class="card overflow-hidden">
      <div class="card-header">
        <h3 class="card-title">Prescriptions</h3>
      </div>

      <Table :attributes="ordersTableAttributes" class="mb-3" @inputUpdates="ordersInputUpdates">
        <template #order_date="{ record }">
          <span>{{ record.order_date }}</span>
        </template>
        <template #shipment_ref_id="{ record }">
          <span class="text-primary fw-medium odr-ref-link" style="cursor:pointer" @click="redirectToShipmentView(record)">
            {{ record.shipment?.reference_id }}
          </span>
        </template>
        <template #shipment_status="{ record }">
          <span :class="['badge-inline-view', getStateColor(record.shipment?.state)]">
            {{ formatShipmentState(record.shipment?.state) }}
          </span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import {state_with_colors} from "@/constants/constants.js";

const props = defineProps({
  patientData: {
    type: Object,
    required: true
  }
})

// Runtime config
const config = useRuntimeConfig();
// for get route parameters
const route = useRoute();
const router = useRouter()
// Show toast message
const {$toast} = useNuxtApp();
// Reactive state
// assign per page
const notes_per_page = 8;
const shipmentFilter = ref({
  shipmentId: ''
})

// Orders Table attributes
const ordersTableAttributes = ref({
  table_id: "orders_table",
  cache: false,
  loading: false,
  labels: [
    { key: "order_date", name: "Order Date", sort: true },
    { key: "shipment_ref_id", name: "SHIP REF ID", sort: false },
    { key: "shipment_status", name: "Status", sort: false }
  ],
  api_response: {},
  filters: {},
  table_component_values: {},
})

const selectedOrderItems = ref([]);

// Methods
const clearOrderFilters = () => {
  shipmentFilter.value = {
    shipmentId: ''
  }
}

// get the state color
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


// format date and time for display
const formatDateTime = (createdDate) => {
  const date = new Date(createdDate)

  // Format date part manually
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();

  // Format time
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}, ${month} ${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

// get table data
const updateOrdersTableData = async (page = 1, per_page = 8, sort = "") => {
  try {
    // activate loading bar
    ordersTableAttributes.value.loading = true;
    const response = await $fetch(`/api/admin/patients/${route.params.id}/orders`, {
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
        'filter[shipment_id]': shipmentFilter.value.shipmentId
      }
    });

    // transform data
    let transformedData  = response.data.map(order => ({
      ...order,
      shipment_status: order.shipment?.state || '',
      order_date: formatDateTime(order.created_at) || '',
      shipment_ref_id: order.shipment?.reference_id || '',
    }));

    // sorting
    if (sort) {
      const isDesc = sort.startsWith('-')
      const sortKey = isDesc ? sort.substring(1) : sort

      transformedData.sort((a, b) => {
        let aVal = a[sortKey] || ''
        let bVal = b[sortKey] || ''

        if (sortKey === 'created_date') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        }

        if (aVal < bVal) return isDesc ? 1 : -1
        if (aVal > bVal) return isDesc ? -1 : 1
        return 0
      })
    }
    // deactivate loading bar
    ordersTableAttributes.value.loading = false;
    // send data to table component
    ordersTableAttributes.value.api_response = {
      ...response, // for get the pagination data
      data: transformedData, // for display table data 
    }
  } catch (error)
  {
    // disable loading bar
    ordersTableAttributes.value.loading = false;
    // display error message
    if ($toast) {
      $toast.error('Failed to fetch patient orders.');
    }
  }
}

const ordersInputUpdates = (values) => {
  ordersTableAttributes.value.table_component_values = values
  updateOrdersTableData(
      values.page,
      notes_per_page,
      values.sort.sort_input,
      shipmentFilter.value.shipmentId || values.search
  )
}

// redirect to shipment view
const redirectToShipmentView = (order) => {
  const shipment_id = order?.shipment?.id;
  
  // if shipment note found
  if (!shipment_id) {
    console.error("No shipment ID found for this order");
    return;
  }

  router.push(`/admin/shipments/${shipment_id}`);
}


watch(
  () => shipmentFilter.value.shipmentId,
  (newFilters, oldFilters) => {
    updateOrdersTableData();
  },
  { deep: true }
)
</script>

<style scoped>
.fs-13 {
  font-size: 13px;
}

.tab-content {
  min-height: 400px;
}

/* Filter input group */
.filter-input-group .form-control {
  border-right: none;
  border-color: #e0e0e0;
  background: #fff;
}

.filter-input-group .input-group-text {
  background: #fff;
  border-left: none;
  border-color: #e0e0e0;
}

.filter-clear-btn {
  border: 1px solid #e0e0e0;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-row .d-flex {
  width: 100%;
}

.odr-ref-link:hover {
  text-decoration: underline;
}

.badge-inline-view {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 4px;
}
</style>