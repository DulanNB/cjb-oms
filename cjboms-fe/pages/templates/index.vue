<template>
  <div>
    <div class="page">
      <!-- Sidebar -->
      <LayoutsSidebar />
      <!-- Navbar -->
      <LayoutsNavbar />
      <div class="page-wrapper">
        <!-- Page header -->
        <div class="page-header d-print-none">
          <div class="container-fluid">
            <div class="row g-2 align-items-center">
              <div class="col">
                <!-- Page pre-title -->
                <h4 class="text-h4">All Subscriptions</h4>
              </div>
            </div>

            <!-- Filter Section -->
            <div class="filter-section">
              <form action="">
                <div class="row mt-3">
                  <div class="col-sm-12 col-xxl-5">
                    <div class="row">
                      <div class="col-12 col-sm-6">
                        <div class="form-input">
                          <div class="input-group mb-2">
                            <input
                              type="text"
                              class="form-control"
                              placeholder="Search…"
                            />
                            <button
                              class="btn bg-primary border px-2"
                              type="button"
                            >
                              <i class="ti ti-search text-white fs-20"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="col-12 col-sm-6">
                        <div class="form-input">
                          <div class="input-icon">
                            <input
                              class="form-control"
                              placeholder="Start date - End date"
                              id="datepicker-icon"
                              value=""
                            />
                            <span class="input-icon-addon"
                              ><!-- Download SVG icon from http://tabler-icons.io/i/calendar -->
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path
                                  d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"
                                />
                                <path d="M16 3v4" />
                                <path d="M8 3v4" />
                                <path d="M4 11h16" />
                                <path d="M11 15h1" />
                                <path d="M12 15v3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-sm-12 col-xxl-5">
                    <div class="row">
                      <div class="col-12 col-sm mt-2 mt-sm-0">
                        <div class="dropdown dropdown__select">
                          <input
                            class="form-control dropdown-toggle w-full justify-content-between shadow-none"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            placeholder="All Types"
                          />
                          <i class="fas fa-sort-down"></i>

                          <ul class="dropdown-menu dropdown-menu-arrow">
                            <li>
                              <a class="dropdown-item" href="#">Action</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#"
                                >Another action</a
                              >
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div class="col-12 col-sm mt-2 mt-sm-0">
                        <div class="dropdown dropdown__select">
                          <input
                            class="form-control dropdown-toggle w-full justify-content-between shadow-none"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            placeholder="All Products"
                          />
                          <i class="fas fa-sort-down"></i>

                          <ul class="dropdown-menu dropdown-menu-arrow">
                            <li>
                              <a class="dropdown-item" href="#">Action</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#"
                                >Another action</a
                              >
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="col-12 col-sm mt-2 mt-sm-0">
                        <div class="dropdown dropdown__select">
                          <input
                            class="form-control dropdown-toggle w-full justify-content-between shadow-none"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            placeholder="All status"
                          />
                          <i class="fas fa-sort-down"></i>

                          <ul class="dropdown-menu dropdown-menu-arrow">
                            <li>
                              <a class="dropdown-item" href="#">Action</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#"
                                >Another action</a
                              >
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="col-12 col-sm-6 col-xxl-2 mt-2 mt-xxl-0 ms-auto ms-xxl-0"
                  >
                    <div class="row">
                      <div class="col">
                        <button type="submit" class="btn btn-primary w-100">
                          Apply
                        </button>
                      </div>
                      <div class="col">
                        <button
                          type="submit"
                          class="btn btn-outline-primary w-100"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <!-- Page body -->
        <div class="page-body min-vh-100">
          <div class="container-fluid">
            <div class="row row-deck row-cards">
              <div class="col-12">
                <div class="card br-8">
                  <div class="card-body border-bottom py-3">
                    <div class="table-responsive">
                      <table class="table table-vcenter text-nowrap datatable">
                        <thead class="">
                          <tr>
                            <th>Sub.ID</th>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Assessment Type</th>
                            <th>Product</th>
                            <th>Subscription Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="i in 5" :key="i">
                            <td>#91615</td>
                            <td>09/11/2023</td>
                            <td>Devon Lane</td>
                            <td>Hair loss</td>
                            <td>Minoxydil</td>
                            <td class="pe-8 w-15rem">
                              <div class="dropdown dropdown__status">
                                <input
                                  class="form-control dropdown-toggle w-full justify-content-between shadow-none"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  value="New"
                                />
                                <i class="fas fa-sort-down"></i>

                                <ul class="dropdown-menu dropdown-menu-arrow">
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      >Approved</a
                                    >
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      >Intervention</a
                                    >
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      >Rejected</a
                                    >
                                  </li>
                                  <li>
                                    <a class="dropdown-item" href="#"
                                      >Cancelled</a
                                    >
                                  </li>
                                </ul>
                              </div>
                            </td>
                            <td>
                              <div class="btn-list flex-nowrap gap-4">
                                <button href="#" class="btn btn-ghost">
                                  <i class="ti ti-eye me-1"></i>
                                  View
                                </button>
                                <button href="#" class="btn btn-ghost">
                                  <i class="ti ti-trash me-1"></i>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Page Pagination -->
            <div class="row my-5">
              <div class="col-12 mx-auto">
                <div
                  class="card-footer justify-content-center d-flex flex-wrap align-items-center mx-2 gap-2"
                >
                  <p class="me-2 text-primary fs-14">Total 85 items</p>
                  <ul class="pagination m-0 gap-1">
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        tabindex="-1"
                        aria-disabled="true"
                      >
                        <i class="ti ti-chevron-left"></i>
                      </a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">1</a>
                    </li>
                    <li class="page-item active">
                      <a class="page-link" href="#">2</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">3</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">4</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">5</a>
                    </li>
                    <li class="page-item">
                      <a class="page-link" href="#">
                        <i class="ti ti-chevron-right"></i>
                      </a>
                    </li>
                  </ul>

                  <div class="col-auto ms-2">
                    <select class="form-select form-select__pagination">
                      <option value="1">20 / page</option>
                      <option value="2">21 / page</option>
                      <option value="3">22 / page</option>
                    </select>
                  </div>

                  <div class="col-auto ms-2">
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-primary fs-14">Go to</span>
                      <div class="form-input form-input__pagination w-4rem">
                        <input
                          type="text"
                          class="form-control"
                          name="example-text-input"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Footer -->
        <LayoutsFooter />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: "guest",
  // layout: 'dashboard-admin',
};
</script>
