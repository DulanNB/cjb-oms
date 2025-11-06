<template>
  <div>
    <label class="form-label required">{{ label }}</label>
    <div v-if="loading" class="position-relative border rounded-1 p-4">
      <div class="file-import-infield-border d-flex justify-content-center p-5">
        <div class="loader"></div>
      </div>
    </div>
    <div v-else>
      <div 
        ref="dropZone"
        class="position-relative border rounded-1 p-4 text-center drop-zone"
        :class="{ 
          'disabled-upload': disableFileUpload, 
          'bg-light': isDragging,
          'drag-active': isDragging 
        }"
      >
        <input 
          type="file" 
          class="file-import-field" 
          ref="fileInput"
          @change="handleFileChange"
          v-show="!previewUrl"
          :disabled="disableFileUpload"
          accept="image/jpeg,image/jpg,image/png"
        />

        <div class="file-import-infield-border p-5" :class="{ 'pointer-events-none': isDragging }">
          <template v-if="isFileUploaded">
            <div class="position-relative d-inline-block">
              <img :src="previewUrl" alt="Preview" style="max-height: 200px;" />
              <button type="button" 
                class="btn btn-sm bg-black position-absolute top-50 end-50 m-1 rounded-circle"
                :class="{ 'disabled-upload' : disableFileUpload }"
                @click="removeImage"
                :disabled="disableFileUpload"
              >
                <span class="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                  </svg>
                </span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="d-inline-flex align-items-center text-muted border border-1 rounded-1 p-2">
              <slot name="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square fw-bolder" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </slot>
              <span class="ms-1 fs-4 fw-bold">Browse image</span>
            </div>
            <div class="my-2 fs-4">or Drop files here to upload</div>
            <div class="fs-5">Maximum upload file size: 5MB</div>
          </template>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
// get tost message 
const {$toast} = useNuxtApp();
// Runtime config
const config = useRuntimeConfig();
// Get CSRF token from cookie
const csrfCookie = useCookie('XSRF-TOKEN');
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : '';

const props = defineProps({
  label: {
    type: String,
    default: 'Upload File',
  },
  existingImage: { 
    type: String,
    default: ''
  },
  disableFileUpload: { 
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['setFileKey', 'removeFileKey', 'fileUploading']);

const isDragging = ref(false);
const fileInput = ref(null);
const previewUrl = ref(null);
const isFileUploaded = ref(false);
const loading = ref(false);
const dropZone = ref(null);

const handleFileChange = (event) => {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    getFileKey(file);
  } else {
    $toast.error('Please select a file.');
    return;
  }

  // clear file input
  fileInput.value = '';
}

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
}

const highlight = (e) => {
  if (props.disableFileUpload) return;
  isDragging.value = true;
}

const unhighlight = (e) => {
  if (props.disableFileUpload) return;
  isDragging.value = false;
}

const handleDrop = (e) => {
  if (props.disableFileUpload) return;
  
  unhighlight(e);
  
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files && files.length > 0) {
    const file = files[0];
    getFileKey(file);
  } else {
    $toast.error('Please select a file.');
  }
}

const getFileKey = async (file) => {
  try {
    // enable loading
    loading.value = true;
    // enable file uploading
    emit('fileUploading', true)
    // Array of allowed MIME types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    // Check if the file type is allowed
    if (!allowedMimeTypes.includes(file.type)) {
      $toast.error('File format should be only .jpeg, .jpg, or .png');
      // disable loading
      loading.value = false;
      // disable file uploading
      emit('fileUploading', false)
      return;
    }

    // Check file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      $toast.error('File size should not exceed 5MB');
      // disable loading
      loading.value = false;
      // disable file uploading
      emit('fileUploading', false)
      return;
    }

    // Upload the file
    const response = await $fetch('/api/admin/signed-storage-url', {
      method: 'POST',
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        bucket: '',
        content_type: file.type,
        expires: '',
        visibility: 'private',
      }),
    })

    let headers = response.headers;

    // Remove `Host` header if exists (S3 restriction)
    if ('Host' in headers) {
      delete headers.Host;
    }

    // Upload file to S3 using fetch PUT
    await fetch(response.url, {
      method: 'PUT',
      headers,
      body: file,
    })

    // disable loading
    loading.value = false;

    previewUrl.value = URL.createObjectURL(file);
    file.key = response.key;

    isFileUploaded.value = true;
    emit('setFileKey', file)
    // disable file uploading
    emit('fileUploading', false)
  } catch (error)
  {
    // disable loading
    loading.value = false;
    // disable file uploading
    emit('fileUploading', false)
    $toast.error("Error uploading file: " + error.message);
    console.error("Upload error:", error);
  }
}

const removeImage = async () => {
  if (previewUrl.value) {
    // enable loading bar
    loading.value = true;
    await nextTick();

    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
    isFileUploaded.value = false;

    try {
      await emit('removeFileKey');
    } finally {
      loading.value = false;
    }
  }
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Setup drag and drop listeners
onMounted(() => {
  if (props.existingImage) {
    previewUrl.value = props.existingImage;
    isFileUploaded.value = true;
  }

  // Add drag and drop event listeners
  if (dropZone.value) {
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    
    events.forEach(eventName => {
      dropZone.value.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.value.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.value.addEventListener(eventName, unhighlight, false);
    });

    dropZone.value.addEventListener('drop', handleDrop, false);
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value && !props.existingImage) {
    URL.revokeObjectURL(previewUrl.value);
  }
  isFileUploaded.value = false;

  // Remove event listeners
  if (dropZone.value) {
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    
    events.forEach(eventName => {
      dropZone.value.removeEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.value.removeEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.value.removeEventListener(eventName, unhighlight, false);
    });

    dropZone.value.removeEventListener('drop', handleDrop, false);
  }
})
</script>

<style scoped>
.file-import-infield-border {
  border: 1px dashed rgb(181, 181, 181);
  border-radius: 6px;
  padding: 16px;
  transition: all 0.3s ease;
}

.drop-zone {
  transition: all 0.3s ease;
  min-height: 250px;
}

.drop-zone.drag-active {
  background-color: #f8f9fa !important;
  border-color: #3498db !important;
  border-width: 2px !important;
}

.drop-zone.drag-active .file-import-infield-border {
  border-color: #3498db;
  border-style: dashed;
  background-color: rgba(52, 152, 219, 0.05);
}

.file-import-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-import-field:disabled {
  cursor: not-allowed;
}

.pointer-events-none {
  pointer-events: none;
}

/* disable file uploading component */
.disabled-upload {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loader styles */
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>