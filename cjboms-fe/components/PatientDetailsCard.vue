<template>
  <div class="card br-8">
    <div class="card-body">
      <div v-if="loading" class="loader-container">
        <div class="loader"></div>
      </div>
      <div v-else class="row">
        <div class="col-md-4 border-end border-gray">
          <div class="row">
            <div class="row mb-2">
              <span class="fw-bold text-primary" style="font-size: small">
                Name
              </span>
              <span v-if="(patient.first_name + patient.last_name).length > 20" class=" text-primary"
                    style="font-size: small">
              {{ patient.first_name.slice(0, 1) }}. {{ patient.last_name }}
            </span>
              <span v-else class="text-primary" style="font-size: small">
              {{ patient.first_name }} {{ patient.last_name }}
            </span>
            </div>
            <div class="row mb-2">
              <span class="fw-bold text-primary" style="font-size: small">
                Age
              </span>
              <span class=" text-primary" style="font-size: smaller">
                {{ calculateAge }}
              </span>
            </div>
            <div class="row mb-2">
              <span class="fw-bold text-primary" style="font-size: small">
                Email
              </span>
              <span class=" text-primary" style="font-size: smaller">
                {{ patient.email }}
              </span>
            </div>
            <div class="row mb-2">
              <span class="fw-bold text-primary" style="font-size: small">
                Phone Number/s
              </span>
              <span class=" text-primary" style="font-size: smaller">
                {{ patient.phone_1 }}
              </span>
              <span class=" text-primary" style="font-size: smaller">
<!--                {{ patient.phone_2 ? patient.phone_2: 'N/A' }}-->
                {{ patient.phone_2 }}
              </span>
            </div>
          </div>

        </div>
        <div class="col-md-4">
          <div class="row">
            <span class="fw-bold text-primary" style="font-size: small">Address Details</span>
            <div v-for="(address, index) in patient.addresses" :key="index" class="text-primary" style="font-size: smaller; margin-bottom: 0.5rem;">
              <p>
                <span class="fw-bold" style="font-size: smaller;">{{ firstLetterUpperCase(address.type) }}</span><br>
                {{ firstLetterUpperCase(address.street_address_1) }}, {{ firstLetterUpperCase(address.street_address_2) }},
                {{ firstLetterUpperCase(address.city) }}, {{ firstLetterUpperCase(address.post_code) }},
                {{ firstLetterUpperCase(address.country) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PatientDetailsCard",
  props: {
    patient: Object,
    loading: Boolean,
  },
  computed: {
    calculateAge() {
      let currentDate = new Date();
      let birthDate = new Date(this.patient.date_of_birth);

      let currentYear = currentDate.getFullYear();
      let currentMonth = currentDate.getMonth();
      let currentDay = currentDate.getDate();

      let birthYear = birthDate.getFullYear();
      let birthMonth = birthDate.getMonth();
      let birthDay = birthDate.getDate();

      let ageYears = currentYear - birthYear;
      let ageMonths = currentMonth - birthMonth;

      if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        ageYears--;
        ageMonths += 12;
      }

      if (currentDay < birthDay) {
        ageMonths--;
        if (ageMonths < 0) {
          ageYears--;
          ageMonths += 12;
        }
      }

      return `${ageYears} years ${ageMonths} months`;
    }
  },
};
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-dots {
  list-style-type: none;
  padding: 0;
}
</style>
