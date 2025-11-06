<template>
  <footer class="footer footer-transparent d-print-none">
    <div class="container-xl">
      <div class="row text-center align-items-center flex-row-reverse">
        <div class="col-lg-auto ms-lg-auto">
          <ul class="list-inline list-inline-dots mb-0">
            <!-- Add any additional footer links here -->
          </ul>
        </div>
        <div class="col-12 col-lg-auto mt-3 mt-lg-0">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">
              Copyright &copy; {{ currentYear }}
              <a class="link-secondary" href=".">CJBOMS</a>.
              All rights reserved.
            </li>
            <li class="list-inline-item">
              Generated {{ generatedDate }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Get current year and date
const currentYear = new Date().getFullYear()
const generatedDate = new Date().toISOString().slice(0, 10)
</script>

<style scoped>
/* Add any footer-specific styles here */
</style>