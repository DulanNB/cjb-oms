<template>
  <ActivitiesLogTable 
    :activity="['Shipment State Updated', 'Shipment Details Created']"
    :shipment-id="shipmentId"
  />
</template>

<script setup>
import ActivitiesLogTable from '~/components/Activities/LogTable.vue'

definePageMeta({
  layout: 'dashboard-admin'
})

const route = useRoute()
const shipmentId = route.query.shipment_id || null

console.log('Shipment ID from query:', shipmentId)
</script>

<style scoped>

</style>
