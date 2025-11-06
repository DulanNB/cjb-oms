<template>
  <header
    class="navbar navbar-expand-lg fixed-top d-print-none topnav-wrapper shadow-md">
    <div class="container-fluid">
      <div class="d-flex ms-auto align-items-center">
        <div class="navbar-nav flex-row order-lg-last ms-auto me-3 me-lg-0">
<!--          <div class="d-flex">-->
<!--            <div class="nav-item dropdown me-3">-->
<!--              <a-->
<!--                aria-expanded="false"-->
<!--                aria-label="Show notifications"-->
<!--                class="nav-link px-0"-->
<!--                data-bs-toggle="dropdown"-->
<!--                href="#"-->
<!--                tabindex="-1"-->
<!--              >-->
<!--                &lt;!&ndash; Download SVG icon from http://tabler-icons.io/i/bell &ndash;&gt;-->
<!--                <i class="ti ti-bell fs-24"></i>-->
<!--                <span class="badge bg-red"></span>-->
<!--              </a>-->
<!--              <div-->
<!--                class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"-->
<!--              >-->
<!--                <div class="card">-->
<!--                  <div class="card-header">-->
<!--                    <h3 class="card-title">Last updates</h3>-->
<!--                  </div>-->
<!--                  <div class="list-group list-group-flush list-group-hoverable">-->
<!--                    <div class="list-group-item">-->
<!--                      <div class="row align-items-center">-->
<!--                        <div class="col-auto">-->
<!--                          <span-->
<!--                            class="status-dot status-dot-animated bg-red d-block"-->
<!--                          ></span>-->
<!--                        </div>-->
<!--                        <div class="col text-truncate">-->
<!--                          <a class="text-body d-block" href="#">Example 1</a>-->
<!--                          <div-->
<!--                            class="d-block text-secondary text-truncate mt-n1"-->
<!--                          >-->
<!--                            Change deprecated html tags to text decoration-->
<!--                            classes (#29604)-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-auto">-->
<!--                          <a class="list-group-item-actions" href="#">-->
<!--                            &lt;!&ndash; Download SVG icon from http://tabler-icons.io/i/star &ndash;&gt;-->
<!--                            <svg-->
<!--                              class="icon text-muted"-->
<!--                              fill="none"-->
<!--                              height="24"-->
<!--                              stroke="currentColor"-->
<!--                              stroke-linecap="round"-->
<!--                              stroke-linejoin="round"-->
<!--                              stroke-width="2"-->
<!--                              viewBox="0 0 24 24"-->
<!--                              width="24"-->
<!--                              xmlns="http://www.w3.org/2000/svg"-->
<!--                            >-->
<!--                              <path-->
<!--                                d="M0 0h24v24H0z"-->
<!--                                fill="none"-->
<!--                                stroke="none"-->
<!--                              ></path>-->
<!--                              <path-->
<!--                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"-->
<!--                              ></path>-->
<!--                            </svg>-->
<!--                          </a>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <div class="list-group-item">-->
<!--                      <div class="row align-items-center">-->
<!--                        <div class="col-auto">-->
<!--                          <span class="status-dot d-block"></span>-->
<!--                        </div>-->
<!--                        <div class="col text-truncate">-->
<!--                          <a class="text-body d-block" href="#">Example 2</a>-->
<!--                          <div-->
<!--                            class="d-block text-secondary text-truncate mt-n1"-->
<!--                          >-->
<!--                            justify-content:between ⇒-->
<!--                            justify-content:space-between (#29734)-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-auto">-->
<!--                          <a class="list-group-item-actions show" href="#">-->
<!--                            &lt;!&ndash; Download SVG icon from http://tabler-icons.io/i/star &ndash;&gt;-->
<!--                            <svg-->
<!--                              class="icon text-yellow"-->
<!--                              fill="none"-->
<!--                              height="24"-->
<!--                              stroke="currentColor"-->
<!--                              stroke-linecap="round"-->
<!--                              stroke-linejoin="round"-->
<!--                              stroke-width="2"-->
<!--                              viewBox="0 0 24 24"-->
<!--                              width="24"-->
<!--                              xmlns="http://www.w3.org/2000/svg"-->
<!--                            >-->
<!--                              <path-->
<!--                                d="M0 0h24v24H0z"-->
<!--                                fill="none"-->
<!--                                stroke="none"-->
<!--                              ></path>-->
<!--                              <path-->
<!--                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"-->
<!--                              ></path>-->
<!--                            </svg>-->
<!--                          </a>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <div class="list-group-item">-->
<!--                      <div class="row align-items-center">-->
<!--                        <div class="col-auto">-->
<!--                          <span class="status-dot d-block"></span>-->
<!--                        </div>-->
<!--                        <div class="col text-truncate">-->
<!--                          <a class="text-body d-block" href="#">Example 3</a>-->
<!--                          <div-->
<!--                            class="d-block text-secondary text-truncate mt-n1"-->
<!--                          >-->
<!--                            Update change-version.js (#29736)-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-auto">-->
<!--                          <a class="list-group-item-actions" href="#">-->
<!--                            &lt;!&ndash; Download SVG icon from http://tabler-icons.io/i/star &ndash;&gt;-->
<!--                            <svg-->
<!--                              class="icon text-muted"-->
<!--                              fill="none"-->
<!--                              height="24"-->
<!--                              stroke="currentColor"-->
<!--                              stroke-linecap="round"-->
<!--                              stroke-linejoin="round"-->
<!--                              stroke-width="2"-->
<!--                              viewBox="0 0 24 24"-->
<!--                              width="24"-->
<!--                              xmlns="http://www.w3.org/2000/svg"-->
<!--                            >-->
<!--                              <path-->
<!--                                d="M0 0h24v24H0z"-->
<!--                                fill="none"-->
<!--                                stroke="none"-->
<!--                              ></path>-->
<!--                              <path-->
<!--                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"-->
<!--                              ></path>-->
<!--                            </svg>-->
<!--                          </a>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <div class="list-group-item">-->
<!--                      <div class="row align-items-center">-->
<!--                        <div class="col-auto">-->
<!--                          <span-->
<!--                            class="status-dot status-dot-animated bg-green d-block"-->
<!--                          ></span>-->
<!--                        </div>-->
<!--                        <div class="col text-truncate">-->
<!--                          <a class="text-body d-block" href="#">Example 4</a>-->
<!--                          <div-->
<!--                            class="d-block text-secondary text-truncate mt-n1"-->
<!--                          >-->
<!--                            Regenerate package-lock.json (#29730)-->
<!--                          </div>-->
<!--                        </div>-->
<!--                        <div class="col-auto">-->
<!--                          <a class="list-group-item-actions" href="#">-->
<!--                            &lt;!&ndash; Download SVG icon from http://tabler-icons.io/i/star &ndash;&gt;-->
<!--                            <svg-->
<!--                              class="icon text-muted"-->
<!--                              fill="none"-->
<!--                              height="24"-->
<!--                              stroke="currentColor"-->
<!--                              stroke-linecap="round"-->
<!--                              stroke-linejoin="round"-->
<!--                              stroke-width="2"-->
<!--                              viewBox="0 0 24 24"-->
<!--                              width="24"-->
<!--                              xmlns="http://www.w3.org/2000/svg"-->
<!--                            >-->
<!--                              <path-->
<!--                                d="M0 0h24v24H0z"-->
<!--                                fill="none"-->
<!--                                stroke="none"-->
<!--                              ></path>-->
<!--                              <path-->
<!--                                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"-->
<!--                              ></path>-->
<!--                            </svg>-->
<!--                          </a>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="nav-item dropdown">
            <a aria-label="Open user menu" class="nav-link dropdown-toggle d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown"
               href="#">
              <span class="avatar avatar-sm rounded-circle bg-cover"
                    style="background-image: url(https://source.unsplash.com/iFgRcqHznqg/50x50);"></span>
              <div class="d-none d-xl-block px-2">
                <p class="fs-14 text-primary fw-medium">{{ $auth.user.first_name }} {{ $auth.user.last_name }}</p>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <!--              <a href="./profile.html" class="dropdown-item">Profile</a>-->
              <NuxtLink class="dropdown-item" to="/admin/profile/general">
                Profile & Account
              </NuxtLink>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
            </div>
          </div>
        </div>

        <button
          aria-controls="sidebar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
          class="navbar-toggler"
          data-bs-target="#sidebar-menu"
          data-bs-toggle="collapse"
          type="button"
        >
          <span class="navbar-toggler-icon text-white"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      organization_data: {},
      current_organization: {},
    }
  },
  mounted() {
    this.getOrganizations()
    this.getCurrentOrganization()
  },
  methods: {
    logout() {
      localStorage.setItem('organization', '');
      this.$auth.logout();
    },
    async getOrganizations() {
      this.organization_data = await this.$axios.$get('api/admin/organizations', {'params': {'per_page': 100}});
    },
    getCurrentOrganization() {
      if (localStorage.getItem('organization')) {
        this.current_organization = JSON.parse(localStorage.getItem('organization'))
      }
    },
    async goToOrganization(organization) {
      await this.$setGlobalOrganization(organization.id)
      window.location.reload(true)
    },
    async copyURL() {
      let portal_url = process.env.patientPortalURL + `/patient/auth/` + this.current_organization.uuid + `/consultation-form`
      await navigator.clipboard.writeText(portal_url)
      document.getElementById('copy_patient_portal').innerHTML = this.icon_copied + 'Patient portal Link Copied'
      setTimeout(() => {
        document.getElementById('copy_patient_portal').innerHTML = this.icon_copy + 'Patient portal Link'
      }, 3000)
    },
    async getWaitingRoomCount() {
      this.waiting_room_count = (await this.$axios.$get('api/admin/appointment-waiting-room-count')).data
    },
  }
}
</script>

<style scoped>
#organization_list {
  max-height: 280px;
  overflow-y: auto;
}
</style>

