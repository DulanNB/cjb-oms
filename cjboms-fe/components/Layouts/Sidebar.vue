<template>
  <aside
    class="navbar navbar-vertical navbar-expand-lg overflow-y-auto sidenav-wrapper bg-primary"
  >
    <div class="container-fluid">
      <div class="navbar-brand navbar-brand-autodark">
        <a href=".">
          <img
            alt="Tabler"
            class="d-none d-lg-block"
            src=""
          />
          <img
            alt="Tabler"
            class="d-lg-none d-block"
            src=""
          />
        </a>
      </div>
      <!-- <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon text-white"></span>
      </button> -->

      <div id="sidebar-menu" class="collapse navbar-collapse">
        <ul class="navbar-nav pt-3">
          <!--          Admin -->
          <li class="nav-link nav-link__head mb-2">
            <p class="fs-14 text-body-200 ps-2">ADMIN</p>
          </li>
          <!--          Subscription -->
          <!--          <li class="nav-item" v-if="($checkOrganizationPermission('list-subscription'))">-->
          <li class="nav-item mb-2">
            <NuxtLink class="nav-link" to="/admin/subscriptions">
              <span class="nav-link-icon d-md-none d-lg-inline-block"
                ><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <svg
                  class="icon icon-tabler icon-tabler-hand-click"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                  <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5"></path>
                  <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5"></path>
                  <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5"></path>
                  <path
                    d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"
                  ></path>
                  <path d="M5 3l-1 -1"></path>
                  <path d="M4 7h-1"></path>
                  <path d="M14 3l1 -1"></path>
                  <path d="M15 6h1"></path>
                </svg>
              </span>
              <span class="nav-link-title"> Subscriptions </span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/admin/subscriptions">
              <span class="nav-link-icon d-md-none d-lg-inline-block"
                ><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <i class="ti ti-align-box-center-middle"></i>
              </span>
              <span class="nav-link-title"> Subscriptions </span>
            </NuxtLink>
          </li>
          <!--          Settings -->
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/admin/settings">
              <span class="nav-link-icon d-md-none d-lg-inline-block"
                ><!-- Download SVG icon from http://tabler-icons.io/i/home -->
                <i class="ti ti-settings"></i>
              </span>
              <span class="nav-link-title"> Settings </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<!--<script>-->
<!--export default {-->
<!--  name: "Sidebar",-->
<!--  data() {-->
<!--    return {}-->
<!--  },-->
<!--  watch: {-->
<!--    '$route.path'(val) {-->
<!--      if (val === '/admin/settings') this.$router.push('/admin/settings/users')-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      organization_data: {},
      current_organization: {},
      pending_payment_requests_count: 0,
    };
  },
  mounted() {
    this.getOrganizations();
    this.getCurrentOrganization();
  },
  watch: {
    "$route.path"(val) {
      if (val === "/admin/settings") this.$router.push("/admin/settings/users");
    },
  },
  methods: {
    logout() {
      localStorage.setItem("organization", "");
      this.$auth.logout();
    },
    async getOrganizations() {
      this.organization_data = await this.$axios.$get(
        "api/admin/organizations",
        { params: { per_page: 100 } }
      );
    },
    getCurrentOrganization() {
      if (localStorage.getItem("organization")) {
        this.current_organization = JSON.parse(
          localStorage.getItem("organization")
        );
      }
    },
    async goToOrganization(organization) {
      await this.$setGlobalOrganization(organization.id);
      window.location.reload(true);
    },
  },
};
</script>
