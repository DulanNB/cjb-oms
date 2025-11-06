<template>
      <div class="row">
        <div class="col-md-12">
          <div class="card br-8 overflow-hidden">

            <div class="card-header row">
              <div class="col mb-md-0 mb-2">
                <h3 class="card-title fw-semibold">Invitations</h3>
              </div>
            </div>

            <Table :attributes="attributes" @inputUpdates="inputUpdates">
              <template v-slot:organization="props">{{ props.record.organization.name }}</template>
              <template v-slot:invitee="props">
                {{ props.record.invitee.first_name }} {{ props.record.invitee.last_name }}
              </template>
              <template v-slot:state="props">{{ firstLetterUpperCase(props.record.state) }}</template>
              <template v-slot:action="props">
                <button class="btn" @click="acceptInvitation(props.record.id)"
                        :class="props.record.state!=='sent' ? 'disabled' : ''"
                >Accept</button>
              </template>
            </Table>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  name: "general",
  data() {
    return {
      attributes: {
        table_id: 'profile_invite_table',
        cache: true,
        loading: false,
        labels: [
          {key: 'organization', name: 'Organization'},
          {key: 'email', name: 'Email'},
          {key: 'invitee', name: 'Invitee'},
          {key: 'state', name: 'status'},
          {key: 'action', name: 'Action'},
        ],
        api_response: {},
        filters: {},
        table_component_values: {}
      }
    }
  },
  methods: {
    async getProfileInviteTableData(page = 1, sort = '', search = '', per_page = 15) {
      try {
        this.attributes.api_response = await this.$axios.$get('/api/admin/profile/invitations',
          {
            params: {
              per_page: per_page,
              page: page,
              sort: sort,
              'filter[search]': search,
              ...this.attributes.filters
            }
          }
        );
      } catch (error) {
      }
    },
    async acceptInvitation(id) {
      try {
        await this.$axios.$post(`api/admin/profile/invitations/${id}/accept`)
        // await this.showSuccessMessage('Status changed successfully')
        await this.getInviteTableData()
      } catch (e) {
        // await this.showErrorMessage(e)
      }
    },
    inputUpdates(values) {
      this.attributes.table_component_values = values;
      this.getProfileInviteTableData(values.page, values.sort.sort_input, values.search, values.per_page)
    },
    filterUpdates() {
      const values = this.attributes.table_component_values
      this.getProfileInviteTableData(1, values.sort.sort_input, values.search, values.per_page)
    },
    filterClear() {
      this.attributes.filters = {}
      this.filterUpdates()
    }
  }
}
</script>

<style scoped>

</style>
