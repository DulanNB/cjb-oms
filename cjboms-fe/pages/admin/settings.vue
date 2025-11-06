<template>
  <div>
    <div class="container-xl">
      <!-- Page title -->
      <div class="page-header d-print-none">
        <div class="row g-2 align-items-center">

          <div class="col mb-3">
            <h4 class="text-h4">Settings</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <div class="container-xl">
        <div class="row">
          <div class="col-md-3 mb-3 mb-md-0">
            <div class="card">
              <div class="list-group list-group-flush" data-bs-toggle="tabs">
                <!--                Users -->
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/settings/users">
                  <span>
                  <svg class="icon icon-tabler icon-tabler-users mx-1" fill="none" height="24"
                       stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                       viewBox="0 0 24 24"
                       width="24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                       <circle cx="9" cy="7" r="4"></circle>
                       <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                       <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                       <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                    </svg>
                  </span>
                  Users
                </NuxtLink>
                <!--                Roles & Permissions -->
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/settings/roles">
                  <span>
                    <svg class="icon icon-tabler icon-tabler-lock-access mx-1" fill="none"
                         height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                         stroke-width="2" viewBox="0 0 24 24"
                         width="24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                       <path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path>
                       <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
                       <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
                       <path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path>
                       <rect height="5" rx="1" width="8" x="8" y="11"></rect>
                       <path d="M10 11v-2a2 2 0 1 1 4 0v2"></path>
                    </svg>
                  </span>
                  Roles & Permissions
                </NuxtLink>
                <!--                User Token -->
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/settings/user-tokens">
                  <span>
                    <svg class="icon icon-tabler icon-tabler-lock-access mx-1" fill="none"
                         height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                         stroke-width="2" viewBox="0 0 24 24"
                         width="24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                       <path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path>
                       <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
                       <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
                       <path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path>
                       <rect height="5" rx="1" width="8" x="8" y="11"></rect>
                       <path d="M10 11v-2a2 2 0 1 1 4 0v2"></path>
                    </svg>
                  </span>
                  User Token
                </NuxtLink>
                <!--                  Primed Token & Clinic ID-->
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/settings/primed-token">
                  <span>
                    <svg class="icon icon-tabler icon-tabler-mail mx-1" fill="none" height="24"
                         stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                         width="24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                       <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                      <rect height="5" rx="1" width="8" x="8" y="11"></rect>
                       <path d="M3 7l9 6l9 -6"></path>
                    </svg>
                  </span>
                  Primed Token & Clinic ID
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="col-md-9">
            <NuxtChild/>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "settings",
  layout: 'dashboard-admin'
}
</script>
