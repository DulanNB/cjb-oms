<!-- components/patient/PatientNotesTab.vue -->
<template>
  <div class="tab-content">
    <div class="card overflow-hidden">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h3 class="card-title mb-0">Patient Notes</h3>
        </div>
        <div>
          <button type="button" class="btn default-btn-with-only-border" @click="openAddNoteModal"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
            </svg>
            <span class="ms-1">
              Add Note
            </span>
          </button>
        </div>
      </div>

      <Table :attributes="notesTableAttributes" class="mb-3" @inputUpdates="notesInputUpdates">
        <template #created_at="{ record }">
          <span>{{ formatDateTime(record.created_at) }}</span>
        </template>
        <template #title="{ record }">
          <span>{{ record.title }}</span>
        </template>
        <template #body="{ record }">
          <span class="note-body-preview">{{ record.note }}</span>
        </template>
        <template #actions="{ record }">
          <div class="d-flex gap-2">
            <a class="btn btn-outline-secondary rounded-1 px-2" @click="editNote(record)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
              Update
              </a>
            <a class="btn btn-outline-danger rounded-1 px-0" @click="deleteNote(record)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="icon icon-tabler icons-tabler-outline icon-tabler-trash ms-2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </a>
          </div>
        </template>
      </Table>
    </div>

    <!-- Add/Edit Note Modal -->
    <transition name="modal-fade">
      <div v-if="showNoteModal" class="modal-overlay" @click.self="closeNoteModal">
        <div class="note-modal">
          <div class="modal-header-custom">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Note' : 'Add Note' }}</h5>
            <button class="btn-close-custom" @click="closeNoteModal" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body-custom">
              
                <div class="form-group">
                  <label class="form-label-custom">Title <span class="text-danger">*</span></label>
                  <div class="input-wrapper">
                    <input
                        v-model="noteForm.title"
                        type="text"
                        class="form-control-custom"
                        placeholder="Enter title here"
                        @input="validate('required|max:100', noteForm.title, 'title')"
                    >
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span class="validation-error-message">
                      {{ Array.isArray(validationError.title) ? validationError.title[0] 
                                                              : validationError.title }}
                    </span>
                  </div>
                </div>
                <div class="form-group">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label-custom mb-0">Body <span class="text-danger">*</span></label>
                    <span class="char-count">{{ noteForm.note.length }}/100</span>
                  </div>
                  <textarea
                      v-model="noteForm.note"
                      class="form-control-custom"
                      rows="5"
                      placeholder="Enter your note here"
                      maxlength="100"
                      @input="validate('required|max:100', noteForm.note, 'note')"
                  ></textarea>
                  <span class="validation-error-message">
                    {{ Array.isArray(validationError.note) ? validationError.note[0] 
                                                            : validationError.note }}
                  </span>
                </div>
            </div>
            <div class="modal-footer-custom">
              <button type="button" class="btn-back" @click="closeNoteModal">
                Back
              </button>
              <button type="submit" class="btn-add-note">
                {{ isEditMode ? 'Update Note' : 'Add Note' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="delete-modal">
          <div class="modal-header-custom">
            <h5 class="modal-title">Delete Note</h5>
            <button class="btn-close-custom" @click="closeDeleteModal" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="modal-body-custom">
            <p class="delete-message">Are you sure you want to delete this note?</p>
          </div>
          <div class="modal-footer-custom">
            <button type="button" class="btn-back" @click="closeDeleteModal">
              Back
            </button>
            <button type="button" class="btn-delete" @click="confirmDelete">
              Delete Note
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

// Runtime config
const config = useRuntimeConfig();
// for get route parameters
const route = useRoute();
// Get CSRF token from cookie
const csrfCookie = useCookie('XSRF-TOKEN');
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : '';
// Show toast message
const {$toast, $validation} = useNuxtApp();

// patient note array
const patientNotes = ref([]);
const selectedNoteId = ref(null);
const validationError = ref({});
// assign per page
const notes_per_page = 8;
// Modal states
const showNoteModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)

// Note form
const noteForm = ref({
  title: '',
  note: ''
})

// Notes Table attributes
const notesTableAttributes = ref({
  table_id: "notes_table",
  cache: false,
  loading: false,
  labels: [
    { key: "created_at", name: "Created Date", sort: true },
    { key: "title", name: "Title", sort: true },
    { key: "note", name: "Body", sort: false },
    { key: "actions", name: "Actions", sort: false }
  ],
  api_response: {},
  filters: {},
  table_component_values: {},
})

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
const updateNotesTableData = async (page = 1, per_page = 8, sort = "") => {
  try {
    // activate loading bar
    notesTableAttributes.value.loading = true;
    const response = await $fetch(`/api/admin/patients/${route.params.id}/notes`, {
      method: 'GET',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      params: {
        per_page,
        page
      }
    });
    patientNotes.value = response.data;
    // sorting
    if (sort) {
      const isDesc = sort.startsWith('-')
      const sortKey = isDesc ? sort.substring(1) : sort

      patientNotes.value.sort((a, b) => {
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
    notesTableAttributes.value.loading = false;
    // send data to table component
    notesTableAttributes.value.api_response = {
      ...response,
    }
  } catch (error)
  {
    // disable loading bar
    notesTableAttributes.value.loading = false;
    // display error message
    if ($toast) {
      $toast.error('Failed to fetch patient notes.');
    }
  }
}

const notesInputUpdates = (values) => {
  notesTableAttributes.value.table_component_values = values
  updateNotesTableData(
      values.page,
      notes_per_page,// replace table component per page
      values.sort.sort_input
  )
}

// Modal functions
const openAddNoteModal = () => {
  // clear previous validation messages
  validationError.value = {};
  
  isEditMode.value = false
  noteForm.value = {
    title: '',
    note: ''
  }
  showNoteModal.value = true
}

const editNote = (note) => {
  // clear previous validation messages
  validationError.value = {};

  isEditMode.value = true
  selectedNoteId.value = note.id;
  noteForm.value = {
    title: note.title,
    note: note.note
  }
  showNoteModal.value = true
}

const closeNoteModal = () => {
  showNoteModal.value = false;
  selectedNoteId.value = null;
  noteForm.value = {
    title: '',
    body: ''
  };
}

// patient note create and update check and send to separate functions
const handleSubmit = () => {
  isEditMode.value ? updateNote() : saveNote();
}

// validate before sending to the backend
const validateForm = () => {
  validate('required|max:100', noteForm.value.title, 'title');
  validate('required|max:100', noteForm.value.note, 'note');

  // Check if there are any validation errors
  return Object.keys(validationError.value).length > 0; 
}

const saveNote = async () => {
  // check is there any validation error
  const hasValidationError = validateForm();
  if (hasValidationError) return;
  // store patient id to note form
  noteForm.value.patient_id = route.params.id;
  try {
      const response = await $fetch('/api/admin/patient-notes', {
        method: 'POST',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: noteForm.value
      });
      // close modal
      closeNoteModal();
      // display success message
      if (response.success && $toast) {
        $toast.success(response.success);
      }
      // update table data
      updateNotesTableData(
        notesTableAttributes.value.table_component_values.page,
        notes_per_page,// replace table component per page 
        notesTableAttributes.value.table_component_values.sort.sort_input
      );
  } catch (error)
  {
    // display error message
    // check validation errors have
    if (error?.data?.errors) {
      validationError.value = error.data.errors;
    } else {
      $toast.error('Failed to create patient note.');
    }
  }
}
  
const updateNote = async () => {
  // check is there any validation error
  const hasValidationError = validateForm();
  if (hasValidationError) return;
  // store patient id to note form
  noteForm.value.patient_id = route.params.id;
  try {
      const response = await $fetch(`/api/admin/patient-notes/${selectedNoteId.value}`, {
        method: 'PUT',
        baseURL: config.public.apiUrl,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken
        },
        body: noteForm.value
      });
      // close modal
      closeNoteModal();
      // display success message
      if (response.success && $toast) {
        $toast.success(response.success);
      }
      // update table data
      updateNotesTableData(
        notesTableAttributes.value.table_component_values.page,
        notes_per_page,// replace table component per page
        notesTableAttributes.value.table_component_values.sort.sort_input
      );
  } catch (error)
  {
    // display error message
    // check validation errors have
    if (error?.data?.errors) {
      validationError.value = error.data.errors;
    } else {
      $toast.error('Failed to update patient note');
    }
  }
}

const deleteNote = (note) => {
  selectedNoteId.value = note.id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedNoteId.value = null
}

const confirmDelete = async () => {
  // check selectedNoteId is null
  if (!selectedNoteId.value) {
    if ($toast) $toast.error('Please select patient note.');
    return;
  }
  try {
    const response = await $fetch(`/api/admin/patient-notes/${selectedNoteId.value}`, {
      method: 'DELETE',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      }
    });
    // close modal
    closeDeleteModal();
    // display success message
    if (response.success && $toast) {
      $toast.success(response.success);
    }

    let currentPage = notesTableAttributes.value.table_component_values.page;
    // get after deleting length of the data
    const totalItemsAfterDelete = patientNotes.value.length - 1;
    // check the current page number is empty then change current page if not keep the page number
    const newPage = totalItemsAfterDelete <= (currentPage - 1) * notes_per_page
      ? Math.max(currentPage - 1, 1)
      : currentPage;
    // assign it to table component values
    notesTableAttributes.value.table_component_values.page = newPage;
    // update table data
    updateNotesTableData(
      newPage,
      notes_per_page,// replace table component per page
      notesTableAttributes.value.table_component_values.sort.sort_input
    );
  } catch (error)
  {
    // display error message
    if ($toast) {
      $toast.error('Failed to delete patient note.');
    }
    // close modal
    closeDeleteModal();
  }
}
</script>

<style scoped>
.tab-content {
  min-height: 400px;
}

.card-header {
  background-color: #ffffff;
  border-bottom: 1px solid #dee2e6;
  padding: 16px 18px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.note-body-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 300px;
  line-height: 1.4;
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

/* Note Modal */
.note-modal {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  animation: modal-slide-up 0.3s ease-out;
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

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label-custom {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.text-danger {
  color: #dc2626;
}

/* Input Wrapper with Icon */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.form-control-custom {
  width: 100%;
  padding: 10px 36px 10px 12px;
  font-size: 14px;
  color: #1f2937;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s;
}

textarea.form-control-custom {
  padding: 10px 12px;
  resize: vertical;
  min-height: 120px;
}

.form-control-custom:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control-custom::placeholder {
  color: #9ca3af;
}

/* Character Count */
.char-count {
  font-size: 13px;
  color: #9ca3af;
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

.btn-add-note {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #92400e;
  border: 1px solid #92400e;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-note:hover {
  background-color: #78350f;
  border-color: #78350f;
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

/* Delete Message */
.delete-message {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
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