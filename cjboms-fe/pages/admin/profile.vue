<template>
  <div>
    <div class="container-xl">
      <!-- Page title -->
      <div class="page-header d-print-none">
        <div class="row g-2 align-items-center">
          <div class="col">
            <div class="d-flex align-items-center">



                <a aria-label="Facebook" class="btn btn-icon me-3" href="#" @click="$router.back()">
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

              <span class="fw-medium fs-18">Profile</span>
              <span class="mb-1 mx-1">
                <svg class="icon icon-tabler icon-tabler-chevrons-right" fill="none" height="24"
                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                     viewBox="0 0 24 24"
                     width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                <polyline points="7 7 12 12 7 17"></polyline>
                <polyline points="13 7 18 12 13 17"></polyline>
              </svg>
              </span>
              <span class="fw-bold text-primary">{{$auth.user.first_name}} {{$auth.user.last_name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body min-vh-100">
      <div class="container-xl">
        <div class="row">
          <div class="col-md-3 mb-3 mb-md-0">
            <div class="card">
              <div class="list-group list-group-flush" data-bs-toggle="tabs">
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/profile/general">
                   <span>
                        <svg class="icon icon-tabler icon-tabler-user mx-1" fill="none" height="24"
                             stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                             viewBox="0 0 24 24"
                             width="24" xmlns="http://www.w3.org/2000/svg">
                             <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
                             <circle cx="12" cy="7" r="4"></circle>
                             <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                     </span>
                  General
                </NuxtLink>
                <NuxtLink class="list-group-item list-group-item-action" to="/admin/profile/password">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lock-open mx-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                       <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                       <circle cx="12" cy="16" r="1"></circle>
                       <path d="M8 11v-5a4 4 0 0 1 8 0"></path>
                    </svg>
                  </span>
                  Change Password
                </NuxtLink>
<!--                <NuxtLink class="list-group-item list-group-item-action" to="/admin/profile/invitations">-->
<!--                  <span>-->
<!--                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-join" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>-->
<!--                       <path d="M3 7h5l3.5 5h9.5"></path>-->
<!--                       <path d="M3 17h5l3.495 -5"></path>-->
<!--                       <path d="M18 15l3 -3l-3 -3"></path>-->
<!--                    </svg>-->
<!--                  </span>-->
<!--                  Invitations-->
<!--                </NuxtLink>-->
<!--                <NuxtLink class="list-group-item list-group-item-action" to="/admin/profile/2fa">-->
<!--                  <span>-->
<!--                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-2fa" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>-->
<!--                       <path d="M7 16h-4l3.47 -4.66a2 2 0 1 0 -3.47 -1.54"></path>-->
<!--                       <path d="M10 16v-8h4"></path>-->
<!--                       <line x1="10" y1="12" x2="13" y2="12"></line>-->
<!--                       <path d="M17 16v-6a2 2 0 0 1 4 0v6"></path>-->
<!--                       <line x1="17" y1="13" x2="21" y2="13"></line>-->
<!--                    </svg>-->
<!--                  </span>-->
<!--                  2FA-->
<!--                </NuxtLink>-->
<!--                <NuxtLink class="list-group-item list-group-item-action" to="/admin/profile/primed-token">-->
<!--                  <span>-->
<!--                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">-->
<!--                       <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>-->
<!--                       <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>-->
<!--                       <path d="M3 7l9 6l9 -6"></path>-->
<!--                    </svg>-->
<!--                  </span>-->
<!--                  Primed Token & Clinic ID-->
<!--                </NuxtLink>-->
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
  name: "profile",
  // layout: 'dashboard-admin-organization'
  layout: 'dashboard-admin'
}
</script>

<!-- <style scoped>
.container-xl {
  max-width: 1250px;
}
</style> -->
