<template>
  <div class="m-4">
    <!-- Activities table -->
    <div>
      <div class="container-xl">
        <div class="row">
          <div class="col-md-12">
            <div class="card br-8 overflow-hidden">
              <div class="card-header">
                <a class="btn btn-icon me-3" href="#" @click="goBack">
                  <svg class="icon icon-tabler icon-tabler-arrow-narrow-left" fill="none"
                       height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                       viewBox="0 0 24 24"
                       width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                    <line x1="5" x2="9" y1="12" y2="16"></line>
                    <line x1="5" x2="9" y1="12" y2="8"></line>
                  </svg>
                </a>
                <div class="col mb-md-0 mb-2">
                  <h3 class="card-title fw-semibold">Activity History</h3>
                </div>
              </div>

              <Table :attributes="activity_attributes" class="mb-3" @inputUpdates="inputUpdates1">
                <template v-slot:causer_name="props">
                  {{ firstLetterUpperCase(props.record.causer?.first_name) }}
                  {{ firstLetterUpperCase(props.record.causer?.last_name) }}
                </template>
                <template v-slot:causer_email="props">
                  {{ props.record.causer?.email }}
                </template>
                <template v-slot:created_at="props">
                  {{ formatDateTime(props.record.created_at) }}
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: Array,
    required: true,
  },
  shipmentId: {
    type: [String, Number],
    default: null
  }
})

const config = useRuntimeConfig()
const csrfCookie = useCookie('XSRF-TOKEN')
const csrfToken = csrfCookie.value ? decodeURIComponent(csrfCookie.value) : ''
const router = useRouter()

const activity_attributes = ref({
  table_id: 'activities_table',
  cache: true,
  loading: false,
  labels: [
    {key: 'event', name: 'Activity Type', sort: true},
    {key: 'description', name: 'Description', sort: true},
    {key: 'causer_name', name: 'Admin Name', sort: true},
    {key: 'causer_email', name: 'Admin Email', sort: true},
    {key: 'created_at', name: 'Date Time', sort: true},
  ],
  api_response: {},
  filters: {},
  table_component_values: {}
})

const firstLetterUpperCase = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const goBack = () => {
  router.back()
}

const inputUpdates1 = (values) => {
  activity_attributes.value.table_component_values = values
  getActivityData(values.page, values.sort.sort_input, values.search, values.per_page)
}

const getActivityData = async (page = 1, sort = '', search = '', per_page = 15) => {
  try {
    activity_attributes.value.loading = true
    
    const params = {
      per_page: per_page,
      page: page,
      sort: sort,
      'filter[search]': search,
      ...activity_attributes.value.filters
    }

    // Add activity event filter - FORMAT AS ARRAY
    if (props.activity && props.activity.length > 0) {
      // Add each activity as a separate filter[event][] parameter
      props.activity.forEach((event, index) => {
        params[`filter[event][${index}]`] = event
      })
    }

    // Add shipment filter if shipmentId is provided
    if (props.shipmentId) {
      params['filter[subject_id]'] = props.shipmentId
    }

    console.log('Fetching activities with params:', params)
    
    const response = await $fetch('/api/admin/activities', {
      baseURL: config.public.apiUrl,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      params
    })
    
    console.log('Activities response:', response)
    activity_attributes.value.api_response = response
    
  } catch (error) {
    console.error('Error fetching activity data:', error)
  } finally {
    activity_attributes.value.loading = false
  }
}

onMounted(() => {
  getActivityData()
})
</script>