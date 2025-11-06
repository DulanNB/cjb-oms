<template>
  <div class="file-view">
    <a :href="document.tempUrl" target="_blank" rel="noopener noreferrer">
      <div v-if="document.mime_type === 'application/pdf'" class="file-icon pdf-icon">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF Icon" />
      </div>
      <div v-else class="file-icon image-icon" :style="{ backgroundImage: `url(${document.tempUrl})` }">
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'PrescriptionFileView',
  props: ['document'],
};
</script>

<style scoped>
.file-view {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  transition: transform 0.3s;
}
.file-view:hover {
  transform: scale(1.05);
}
.file-icon {
  height: 110px;
  width: 110px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.pdf-icon {
  background-color: #fdd8d8;
}
.image-icon {
  background-size: cover;
  background-position: center;
}
.file-name {
  font-size: 0.9em;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
