import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import semua ikon solid

// Tambahkan ikon ke library
library.add(fas);

// Buat aplikasi Vue
const app = createApp(App);

// Registrasi komponen FontAwesomeIcon secara global
app.component('font-awesome-icon', FontAwesomeIcon);

// Gunakan router
app.use(router);

// Mount aplikasi
app.mount('#app');
