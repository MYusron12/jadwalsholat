<template>
  <div class="container my-3">
    <div class="map-wrap" style="display:none">
      <a href="https://www.maptiler.com" class="watermark">
        <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
      </a>
      <div class="map" ref="mapContainer"></div>
    </div>
    <div v-if="currentTime" class="text-center mb-3">
      <h2>{{ currentTime }}</h2>
    </div>
    <div class="">
      <div class="">
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
      <div class="m-2" v-if="scheduleShalat">
        <div class="card-body d-flex flex-wrap justify-content-center">
          <div class="border-primary m-3" style="max-width: 18rem;">
            <div class="card-body text-primary text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="hourglass-start" />
                Imsak
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.imsak }}</p>
            </div>
          </div>
          <div class="border-secondary m-3" style="max-width: 18rem;">
            <div class="card-body text-secondary text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="cloud-sun" />
                Subuh
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.subuh }}</p>
            </div>
          </div>
          <div class="border-success m-3" style="max-width: 18rem;">
            <div class="card-body text-success text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="sun" />
                Dzuhur
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.dzuhur }}</p>
            </div>
          </div>
          <div class="border-danger m-3" style="max-width: 18rem;">
            <div class="card-body text-danger text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="person-praying" />
                Ashar
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.ashar }}</p>
            </div>
          </div>
          <div class="border-warning m-3" style="max-width: 18rem;">
            <div class="card-body text-warning text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="cloud-moon" />
                Maghrib
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.maghrib }}</p>
            </div>
          </div>
          <div class="border-info m-3" style="max-width: 18rem;">
            <div class="card-body text-info text-center">
              <h5 class="card-title">
                <font-awesome-icon icon="moon" />
                Isya
              </h5>
              <p class="card-text">{{ scheduleShalat.jadwal.isya }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card" v-if="scheduleShalatMonthly">
        <div class="card-body">
          <div class="row">
            <div class="col-md m-2">
              <input v-model="selectedDate" @change="updateScheduleShalatMonthly" class="form-control" type="month">
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Imsak</th>
                  <th>Subuh</th>
                  <th>Terbit</th>
                  <th>Dhuha</th>
                  <th>Dzuhur</th>
                  <th>Ashar</th>
                  <th>Maghrib</th>
                  <th>Isya</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(jadwal, index) in scheduleShalatMonthly.jadwal" :key="index">
                  <td>{{ jadwal.tanggal }}</td>
                  <td>{{ jadwal.imsak }}</td>
                  <td>{{ jadwal.subuh }}</td>
                  <td>{{ jadwal.terbit }}</td>
                  <td>{{ jadwal.dhuha }}</td>
                  <td>{{ jadwal.dzuhur }}</td>
                  <td>{{ jadwal.ashar }}</td>
                  <td>{{ jadwal.maghrib }}</td>
                  <td>{{ jadwal.isya }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHourglassStart, faCloudSun, faSun, faPersonPraying, faCloudMoon, faMoon } from '@fortawesome/free-solid-svg-icons';

import { Map, NavigationControl, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

library.add(faHourglassStart, faCloudSun, faSun, faPersonPraying, faCloudMoon, faMoon);

export default {
  components: {
    FontAwesomeIcon,
  },
  name: 'JadwalSholat',
  data() {
    return {
      cities: [],
      selectedCity: '',
      selectedCityLocation: '',
      selectedDate: '',
      selectedDateTime: '',
      scheduleShalat: null,
      scheduleShalatMonthly: null,
      currentTime: '',
      currentLocation: '',
      map: null,
      latitude: null,
      longitude: null,
      zoom: 14
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
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
    },
    updateCurrentTime() {
      setInterval(() => {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString();
      }, 1000);
    },
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

    // Start the clock
    this.updateCurrentTime();

    const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

    this.map = new Map({
      container: this.$refs.mapContainer,
      style: `https://api.maptiler.com/maps/streets/style.json?key=Y0N0Nz2zGqEhg5yMoYPP`,
      // center: [initialState.lng, initialState.lat],
      center: [this.longitude, this.latitude],
      zoom: this.zoom
    });
    this.map.addControl(new NavigationControl(), 'top-right');
    new Marker({ color: "#FF0000" })
      // .setLngLat([139.7525, 35.6841])
      .setLngLat([this.longitude, this.latitude])
      .addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px);
  /* calculate height of the screen minus the heading */
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}

.table-danger {
  background-color: #f8d7da;
  /* Warna merah */
}
</style>

