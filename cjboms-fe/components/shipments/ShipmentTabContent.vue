<template>
  <div class="row g-4">
    <div class="col-md-6">
      <label class="form-label" :class="[formErrors.deliveryTypeId ? 'text-danger' : '']">
        Services <span class="text-danger">*</span>
      </label>
      <select
          class="form-select"
          :class="[formErrors.deliveryTypeId ? 'is-invalid' : '']"
          :value="dispatchFormData.deliveryTypeId"
          @input="updateField('deliveryTypeId', $event.target.value)"
          :disabled="loadingDeliveryTypes"
      >
        <option value="">{{ loadingDeliveryTypes ? 'Loading...' : 'Select delivery type' }}</option>
        <option 
          v-for="deliveryType in deliveryTypes" 
          :key="deliveryType.id" 
          :value="deliveryType.id"
        >
          {{ deliveryType.name }} - £{{ deliveryType.price }}
        </option>
      </select>
      <div v-if="formErrors.deliveryTypeId" class="invalid-feedback">
        {{ formErrors.deliveryTypeId }}
      </div>
    </div>

    <div class="col-md-6">
      <label class="form-label" :class="[formErrors.weight ? 'text-danger' : '']">
        Weight <span class="text-danger">*</span>
      </label>
      <input
          type="text"
          class="form-control"
          :class="[formErrors.weight ? 'is-invalid' : '']"
          placeholder="Enter weight"
          :value="dispatchFormData.weight"
          @input="handleWeightInput($event.target.value)"
      >
      <div v-if="formErrors.weight" class="invalid-feedback">
        {{ formErrors.weight }}
      </div>
    </div>

    <div class="col-md-6">
      <label class="form-label">Customs Value</label>
      <input
          type="text"
          class="form-control"
          placeholder="Enter value"
          :value="dispatchFormData.customsValue"
          @input="updateField('customsValue', $event.target.value)"
      >
    </div>

    <div class="col-md-6">
      <label class="form-label">Collection Date</label>
      <input
          type="text"
          class="form-control"
          placeholder="dd/mm/yyyy"
          :value="dispatchFormData.collectionDate"
          @input="updateField('collectionDate', $event.target.value)"
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dispatchFormData: {
    type: Object,
    required: true
  },
  deliveryTypes: {
    type: Array,
    default: () => []
  },
  loadingDeliveryTypes: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dispatchFormData', 'validation-result'])

const { $validation } = useNuxtApp()

const formErrors = reactive({
  weight: '',
  deliveryTypeId: ''
})

watch(() => props.deliveryTypes, (newVal) => {
}, { deep: true })

const updateField = (field, value) => {
  if (formErrors[field]) {
    formErrors[field] = ''
  }
  
  emit('update:dispatchFormData', {
    ...props.dispatchFormData,
    [field]: value
  })
}

const validate = (validation, value, tag) => {
  const message = $validation(validation, value)
  if (message) {
    formErrors[tag] = message
  } else {
    formErrors[tag] = ''
  }
}

const handleWeightInput = (value) => {
  validate('required|positive:0', value, 'weight')
  
  updateField('weight', value)
}

const validateForm = () => {
  let isValid = true
  
  if (formErrors.deliveryTypeId || formErrors.weight) {
    isValid = false
  }
  
  if (!props.dispatchFormData.deliveryTypeId) {
    formErrors.deliveryTypeId = 'Please select a delivery type'
    isValid = false
  }
  
  if (!props.dispatchFormData.weight || props.dispatchFormData.weight.trim() === '') {
    formErrors.weight = 'Field is required.'
    isValid = false
  }
  
  emit('validation-result', { isValid, errors: formErrors })
  
  return isValid
}


defineExpose({
  validateForm
})

watch(() => props.dispatchFormData.weight, (newValue) => {
  if (newValue) {
    validate('required|positive:0', newValue, 'weight')
  }
})

watch(() => props.dispatchFormData.deliveryTypeId, (newValue) => {
  if (newValue && formErrors.deliveryTypeId) {
    formErrors.deliveryTypeId = ''
  }
})
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}

.g-4 {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 1.5rem;
}

.g-4 > * {
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}

.col-md-6 {
  flex: 0 0 auto;
  width: 50%;
}

.form-label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.text-danger {
  color: #dc3545 !important;
}

.form-control,
.form-select {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  appearance: none;
  border-radius: 4px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  color: #212529;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.form-control::placeholder {
  color: #6c757d;
  opacity: 1;
}

@media (max-width: 768px) {
  .col-md-6 {
    width: 100%;
  }
}
</style>