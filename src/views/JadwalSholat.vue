<template>
  <div class="container my-3">
    <div class="">
      <div class="card-body">
        <div class="row">
          <div class="col-md-9 mb-3">
            <input list="city-list" v-model="selectedCityLocation" @input="updateSelectedCity" class="form-control"
              placeholder="Select or enter city name" />
            <datalist id="city-list">
              <option v-for="city in cities" :key="city.id" :value="city.lokasi">{{ city.lokasi }}</option>
            </datalist>
          </div>
          <div class="col-md-3 mb-3">
            <input v-model="selectedDateTime" @change="updateScheduleShalat" class="form-control" type="date">
          </div>
        </div>
      </div>
      <div class="card m-2" v-if="scheduleShalat">
        <div class="card-body d-flex flex-wrap justify-content-center">
          <div class="card border-primary mb-3" style="max-width: 18rem;">
            <div class="card-body text-primary text-center">
              <h5 class="card-title">Imsak</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.imsak }}</p>
            </div>
          </div>
          <div class="card border-secondary mb-3" style="max-width: 18rem;">
            <div class="card-body text-secondary text-center">
              <h5 class="card-title">Subuh</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.subuh }}</p>
            </div>
          </div>
          <div class="card border-success mb-3" style="max-width: 18rem;">
            <div class="card-body text-success text-center">
              <h5 class="card-title">Dzuhur</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.dzuhur }}</p>
            </div>
          </div>
          <div class="card border-danger mb-3" style="max-width: 18rem;">
            <div class="card-body text-danger text-center">
              <h5 class="card-title">Ashar</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.ashar }}</p>
            </div>
          </div>
          <div class="card border-warning mb-3" style="max-width: 18rem;">
            <div class="card-body text-warning text-center">
              <h5 class="card-title">Maghrib</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.maghrib }}</p>
            </div>
          </div>
          <div class="card border-info mb-3" style="max-width: 18rem;">
            <div class="card-body text-info text-center">
              <h5 class="card-title">Isya</h5>
              <p class="card-text">{{ scheduleShalat.jadwal.isya }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card" v-if="scheduleShalatMonthly">
        <div class="card-body">
          <div class="row">
            <!-- <div class="col-md-9"></div> -->
            <div class="col-md m-2">
              <input v-model="selectedDate" @change="updateScheduleShalatMonthly" class="form-control" type="month">
            </div>
          </div>
          <div class="card-container d-flex flex-wrap justify-content-center">
            <div v-for="(jadwal, index) in scheduleShalatMonthly.jadwal" :key="index" class="card m-2">
              <div class="card-body text-center">
                <h5 class="card-title">{{ jadwal.tanggal }}</h5>
                <div class="border-top m-2 pt-2">
                  <p class="card-text"><strong>Imsak:</strong> {{ jadwal.imsak }}</p>
                  <p class="card-text"><strong>Subuh:</strong> {{ jadwal.subuh }}</p>
                  <p class="card-text"><strong>Terbit:</strong> {{ jadwal.terbit }}</p>
                  <p class="card-text"><strong>Dhuha:</strong> {{ jadwal.dhuha }}</p>
                  <p class="card-text"><strong>Dzuhur:</strong> {{ jadwal.dzuhur }}</p>
                  <p class="card-text"><strong>Ashar:</strong> {{ jadwal.ashar }}</p>
                  <p class="card-text"><strong>Maghrib:</strong> {{ jadwal.maghrib }}</p>
                  <p class="card-text"><strong>Isya:</strong> {{ jadwal.isya }}</p>
                </div>
              </div>
            </div>
          </div>
          <br>
          <pre>
            {{ scheduleShalatMonthly }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'JadwalSholat',
  data() {
    return {
      cities: [],
      selectedCity: '',
      selectedCityLocation: '',
      selectedDate: '',
      selectedDateTime: '',
      scheduleShalat: null,
      scheduleShalatMonthly: null
    }
  },
  methods: {
    async fetchAllCityNames() {
      try {
        const response = await axios.get('https://api.myquran.com/v2/sholat/kota/semua');
        this.cities = response.data.data;

        // Set default city to 1301
        const defaultCity = this.cities.find(city => city.id === '1301');
        if (defaultCity) {
          this.selectedCity = defaultCity.id;
          this.selectedCityLocation = defaultCity.lokasi;
        }

        // Fetch initial schedules for default city
        this.updateScheduleShalat();
        this.updateScheduleShalatMonthly();
      } catch (error) {
        console.error('Error fetching all city names:', error);
      }
    },
    async fetchScheduleShalat(kotaId, date) {
      try {
        const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${date}`);
        this.scheduleShalat = response.data.data;
      } catch (error) {
        console.error('Error fetching sholat schedule:', error);
      }
    },
    async fetchScheduleShalatMonthly(kotaId, tahun, bulan) {
      try {
        const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${tahun}/${bulan}`);
        this.scheduleShalatMonthly = response.data.data;
      } catch (error) {
        console.error('Error fetching sholat schedule:', error);
      }
    },
    updateSelectedCity() {
      const selectedCity = this.cities.find(city => city.lokasi === this.selectedCityLocation);
      if (selectedCity) {
        this.selectedCity = selectedCity.id;
        this.updateScheduleShalat();
        this.updateScheduleShalatMonthly();
      }
    },
    updateScheduleShalat() {
      if (this.selectedCity && this.selectedDateTime) {
        this.fetchScheduleShalat(this.selectedCity, this.selectedDateTime);
      }
    },
    updateScheduleShalatMonthly() {
      if (this.selectedCity && this.selectedDate) {
        const [year, month] = this.selectedDate.split('-');
        this.fetchScheduleShalatMonthly(this.selectedCity, year, month);
      }
    }
  },
  mounted() {
    this.fetchAllCityNames();

    // Set default dates to today
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    this.selectedDateTime = `${year}-${month}-${day}`;
    this.selectedDate = `${year}-${month}`;
  }
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.card {
  margin-right: 1rem;
}

.list-group-item {
  border: none;
  padding: 0.5rem 0;
}
</style>
